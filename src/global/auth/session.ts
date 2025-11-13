'use client';

import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { authStore, setActiveUserId, setAccessTokenFor as cacheAccessTokenFor } from './store';
import type { TokenSource } from './store';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://staging.api.v3.teachita.com/api';

const SIGN_IN_PATH = `/T/dl/sayongjas/sign-in`;
const REFRESH_SEGMENT = 'refresh-access';

const dropApiPrefix = (p: string) => (p === '/api' ? '/' : p.startsWith('/api/') ? p.slice(4) : p);

const stripTrailingSlash = (p: string) =>
  p.length <= 1 ? p : p.endsWith('/') ? p.slice(0, -1) : p;

const normalizePath = (url?: string): string => {
  if (!url) return '';
  const clean = (raw: string) => {
    const base = (raw.split('?')[0] ?? '').trim();
    const withSlash = base.startsWith('/') ? base : `/${base}`;
    const path = stripTrailingSlash(dropApiPrefix(withSlash));
    return path === '/' ? '' : path;
  };
  try {
    return clean(new URL(url, API_BASE_URL).pathname);
  } catch {
    return clean(url);
  }
};

const isSignInPath = (url?: string) => normalizePath(url) === SIGN_IN_PATH;

const getRefreshUserId = (path: string): string | null => {
  const m = path.match(/^\/T\/dl\/sayongjas\/([^/]+)\/refresh-access$/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
};

const isRefreshPath = (url?: string) => {
  const path = normalizePath(url);
  return path.includes(REFRESH_SEGMENT) || getRefreshUserId(path) !== null;
};

const isAuthExempt = (url?: string) => isSignInPath(url) || isRefreshPath(url);

type NodeBuffer = { from(i: string, e: string): { toString(e: string): string } };

const getNodeBuffer = (): NodeBuffer | null => {
  const g = globalThis as unknown as { Buffer?: NodeBuffer };
  return g && typeof g.Buffer?.from === 'function' ? g.Buffer : null;
};

const padBase64 = (s: string) => (s.length % 4 === 0 ? s : s + '='.repeat(4 - (s.length % 4)));

const b64Decode = (input: string): string => {
  try {
    const n = padBase64(input.replace(/-/g, '+').replace(/_/g, '/'));
    if (typeof atob === 'function') return atob(n);
    const B = getNodeBuffer();
    return B ? B.from(n, 'base64').toString('utf-8') : '';
  } catch {
    return '';
  }
};

export const isTokenExpiring = (token: string, skewSec = 60): boolean => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return true;
    const exp = (JSON.parse(b64Decode(payload)) as { exp?: number }).exp ?? 0;
    return Date.now() >= exp * 1000 - skewSec * 1000;
  } catch {
    return true;
  }
};

const getAuthState = () => authStore.getState();

export const getActiveUserId = () => getAuthState().activeUserId;

export const getAccessTokenForUser = (userId: string): string | null =>
  getAuthState().tokensByUser[userId] ?? null;

const tokenForActive = (): string | null => {
  const state = getAuthState();
  const uid = state.activeUserId;
  return uid ? (state.tokensByUser[uid] ?? null) : null;
};

const setAccessTokenFor = (userId: string, token: string | null, source: TokenSource = 'api') =>
  cacheAccessTokenFor(userId, token, source);

const ensureHeaders = (h?: AxiosRequestHeaders) =>
  h instanceof AxiosHeaders ? h : AxiosHeaders.from(h ?? {});

const withAuth = (headers: AxiosRequestHeaders | undefined, token: string | null) => {
  const hx = ensureHeaders(headers);
  if (token) hx.set('Authorization', `Bearer ${token}`);
  else hx.delete('Authorization');
  return hx;
};

export type AccessTokenPayload = { accessToken: string; nanoId?: string };

export const hasAccessToken = (v: unknown): v is AccessTokenPayload =>
  typeof v === 'object' &&
  v !== null &&
  typeof (v as { accessToken?: unknown }).accessToken === 'string';

export const getNanoId = (v: unknown): string | undefined => {
  const n = (v as { nanoId?: unknown })?.nanoId;
  return typeof n === 'string' ? n : undefined;
};

const refreshClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const refreshInflight = new Map<string, Promise<string>>();

const requestRefresh = async (userId: string): Promise<string> => {
  const endpoint = `/T/dl/sayongjas/${encodeURIComponent(userId)}/${REFRESH_SEGMENT}`;
  const { data } = await refreshClient.post<AccessTokenPayload>(endpoint);
  if (!hasAccessToken(data)) throw new Error('No accessToken from refresh');
  setAccessTokenFor(userId, data.accessToken, 'refresh');
  return data.accessToken;
};

export const refreshAccessTokenFor = (userId: string): Promise<string> => {
  const existing = refreshInflight.get(userId);
  if (existing) return existing;
  const p = requestRefresh(userId)
    .finally(() => {
      refreshInflight.delete(userId);
    })
    .catch((e) => {
      throw e;
    });
  refreshInflight.set(userId, p);
  return p;
};

let onUnauthorized: (() => void) | null = null;

export const configureUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

export const finalizeUnauthorized = () => {
  getAuthState().handleUnauthorized();
  onUnauthorized?.();
};

const applyAccessTokenFromResponse = (url: string | undefined, payload: unknown) => {
  if (!hasAccessToken(payload)) return;
  const path = normalizePath(url);
  const token = payload.accessToken;

  if (path === SIGN_IN_PATH) {
    const uid = getNanoId(payload) ?? getActiveUserId() ?? undefined;
    if (uid) {
      setAccessTokenFor(uid, token, 'api');
      setActiveUserId(uid);
    }
    return;
  }

  if (isRefreshPath(url)) {
    const uid = getNanoId(payload) ?? getRefreshUserId(path) ?? getActiveUserId() ?? undefined;
    if (uid) {
      setAccessTokenFor(uid, token, 'refresh');
      setActiveUserId(uid);
    }
  }
};

export async function switchUser(userId: string, onNeedLogin?: (id: string) => void) {
  const cached = getAccessTokenForUser(userId);
  if (cached && !isTokenExpiring(cached)) {
    setActiveUserId(userId);
    setAccessTokenFor(userId, cached, 'store');
    return;
  }
  try {
    const newToken = await refreshAccessTokenFor(userId);
    setActiveUserId(userId);
    setAccessTokenFor(userId, newToken, 'refresh');
  } catch {
    if (onNeedLogin) onNeedLogin(userId);
    else throw new Error('Refresh token not found for this user. Redirect to sign-in.');
  }
}

export const attachAuthHeader = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  if (!isAuthExempt(config.url)) {
    config.headers = withAuth(config.headers, tokenForActive());
  }
  return config;
};

export const handleAuthResponse = (response: AxiosResponse): AxiosResponse => {
  applyAccessTokenFromResponse(response.config?.url, response.data);
  return response;
};

export const handleAuthError = async (
  error: AxiosError,
  client: AxiosInstance,
): Promise<AxiosResponse<unknown> | never> => {
  const cfg = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
  const status = error.response?.status;

  if (!cfg || status !== 401 || isAuthExempt(cfg.url)) {
    if (status === 401 && cfg?._retry) finalizeUnauthorized();
    return Promise.reject(error);
  }

  if (cfg._retry) {
    finalizeUnauthorized();
    return Promise.reject(error);
  }

  const uid = getActiveUserId();
  if (!uid) {
    finalizeUnauthorized();
    return Promise.reject(error);
  }

  try {
    const newToken = await refreshAccessTokenFor(uid);
    cfg._retry = true;
    cfg.headers = withAuth(cfg.headers, newToken);
    return client(cfg);
  } catch (e) {
    finalizeUnauthorized();
    return Promise.reject(e);
  }
};
