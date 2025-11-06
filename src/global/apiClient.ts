import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  getActiveUserId,
  setActiveUserId,
  getLegacyAccessToken,
  setLegacyAccessToken,
  getAccessTokenFor as _getAccessTokenFor,
  cacheAccessTokenFor as _cacheAccessTokenFor,
  configureUnauthorizedHandler as _configureUnauthorizedHandler,
  finalizeUnauthorized as _finalizeUnauthorized,
} from '@/global/auth/token-store';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://staging.api.v3.teachita.com/api';

const AUTH_BASE_PATH = '/T/dl/sayongjas';
const SIGN_IN_PATH = `${AUTH_BASE_PATH}/sign-in`;
const REFRESH_SEGMENT = 'refresh-access';

const dropApiPrefix = (path: string) => {
  if (path === '/api') return '/';
  if (path.startsWith('/api/')) return path.slice(4);
  return path;
};

const stripTrailingSlash = (path: string) => {
  if (path.length <= 1) return path;
  return path.endsWith('/') ? path.slice(0, -1) : path;
};

const normalizePath = (url?: string): string => {
  if (!url) return '';
  const clean = (raw: string) => {
    const base = raw.split('?')[0] ?? '';
    const withLeadingSlash = base.startsWith('/') ? base : `/${base}`;
    const withoutApi = dropApiPrefix(withLeadingSlash);
    const trimmed = stripTrailingSlash(withoutApi);
    return trimmed === '/' ? '' : trimmed;
  };
  try {
    return clean(new URL(url, API_BASE_URL).pathname);
  } catch {
    return clean(url);
  }
};

const isSignInPath = (url?: string) => normalizePath(url) === SIGN_IN_PATH;

const getRefreshUserIdFromNormalizedPath = (path: string): string | null => {
  const match = path.match(/^\/T\/dl\/sayongjas\/([^/]+)\/refresh-access$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
};

const isRefreshPath = (url?: string) => {
  const normalized = normalizePath(url);
  return (
    normalized === `${AUTH_BASE_PATH}/${REFRESH_SEGMENT}` ||
    getRefreshUserIdFromNormalizedPath(normalized) !== null
  );
};

type NodeBuffer = { from(i: string, e: string): { toString(e: string): string } };
const getNodeBuffer = (): NodeBuffer | null => {
  const g = globalThis as unknown as { Buffer?: NodeBuffer };
  return g && typeof g.Buffer?.from === 'function' ? g.Buffer : null;
};

const padBase64 = (s: string): string => {
  const r = s.length % 4;
  return r === 0 ? s : s + '='.repeat(4 - r);
};

const b64Decode = (input: string): string => {
  try {
    const normalized = padBase64(input.replace(/-/g, '+').replace(/_/g, '/'));
    if (typeof atob === 'function') return atob(normalized);
    const B = getNodeBuffer();
    return B ? B.from(normalized, 'base64').toString('utf-8') : '';
  } catch {
    return '';
  }
};

const isTokenExpiring = (token: string, skewSec = 60): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return true;
    const payload = JSON.parse(b64Decode(parts[1])) as { exp?: number };
    const expMs = (payload.exp ?? 0) * 1000;
    return Date.now() >= expMs - skewSec * 1000;
  } catch {
    return true;
  }
};

const ensureAxiosHeaders = (h?: AxiosRequestHeaders): AxiosHeaders =>
  h instanceof AxiosHeaders ? h : AxiosHeaders.from(h ?? {});

const setAuthOn = (headers: AxiosRequestHeaders | undefined, token: string): AxiosHeaders => {
  const hx = ensureAxiosHeaders(headers);
  hx.set('Authorization', `Bearer ${token}`);
  return hx;
};

const deleteAuthOn = (headers: AxiosRequestHeaders | undefined): AxiosHeaders => {
  const hx = ensureAxiosHeaders(headers);
  hx.delete('Authorization');
  return hx;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const refreshClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

type AccessTokenPayload = { accessToken: string; nanoId?: string };
const hasAccessToken = (value: unknown): value is AccessTokenPayload =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { accessToken?: unknown }).accessToken === 'string';

const getNanoId = (value: unknown): string | undefined => {
  const candidate = (value as { nanoId?: unknown })?.nanoId;
  return typeof candidate === 'string' ? candidate : undefined;
};

const applyAccessTokenFromResponse = (url: string | undefined, payload: unknown) => {
  if (!hasAccessToken(payload)) return;

  const { accessToken } = payload;
  const path = normalizePath(url);

  if (path === SIGN_IN_PATH) {
    const userId = getNanoId(payload);
    if (userId) {
      _cacheAccessTokenFor(userId, accessToken, 'api');
      setActiveUserId(userId);
    } else {
      setLegacyAccessToken(accessToken, 'api');
    }
    return;
  }

  const uidFromUrl = getRefreshUserIdFromNormalizedPath(path);
  const isRefresh = path === `${AUTH_BASE_PATH}/${REFRESH_SEGMENT}` || uidFromUrl !== null;
  if (isRefresh) {
    const uid = getNanoId(payload) ?? uidFromUrl ?? getActiveUserId() ?? undefined;
    if (uid) {
      _cacheAccessTokenFor(uid, accessToken, 'refresh');
      setActiveUserId(uid);
    } else {
      setLegacyAccessToken(accessToken, 'refresh');
    }
  }
};

apiClient.interceptors.request.use(
  (config) => {
    const { url } = config;

    if (!isSignInPath(url) && !isRefreshPath(url)) {
      const uid = getActiveUserId();
      const token = uid ? _getAccessTokenFor(uid) : getLegacyAccessToken();

      if (token) {
        config.headers = setAuthOn(config.headers, token);
      } else if (config.headers) {
        config.headers = deleteAuthOn(config.headers);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const refreshPromises = new Map<string, Promise<string>>();

const requestAccessTokenRefresh = async (userId: string): Promise<string> => {
  const endpoint = `${AUTH_BASE_PATH}/${encodeURIComponent(userId)}/${REFRESH_SEGMENT}`;
  const { data } = await refreshClient.post(endpoint);
  if (!hasAccessToken(data)) throw new Error('No accessToken from refresh');
  const newToken = data.accessToken;
  _cacheAccessTokenFor(userId, newToken, 'refresh');
  return newToken;
};

const refreshAccessTokenFor = (userId: string): Promise<string> => {
  const existing = refreshPromises.get(userId);
  if (existing) return existing;

  const promise = requestAccessTokenRefresh(userId)
    .then((token) => {
      refreshPromises.delete(userId);
      return token;
    })
    .catch((err) => {
      refreshPromises.delete(userId);
      throw err;
    });

  refreshPromises.set(userId, promise);
  return promise;
};

apiClient.interceptors.response.use(
  (response) => {
    applyAccessTokenFromResponse(response.config?.url, response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalConfig = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const status = error.response?.status;
    const url = originalConfig?.url;

    const shouldSkip =
      !originalConfig || !status || status !== 401 || isSignInPath(url) || isRefreshPath(url);

    if (shouldSkip) {
      if (status === 401 && originalConfig?._retry) {
        _finalizeUnauthorized(getActiveUserId());
      }
      return Promise.reject(error);
    }

    if (originalConfig._retry) {
      _finalizeUnauthorized(getActiveUserId());
      return Promise.reject(error);
    }

    const uid = getActiveUserId();
    if (!uid) {
      _finalizeUnauthorized(null);
      return Promise.reject(error);
    }

    try {
      const newToken = await refreshAccessTokenFor(uid);
      originalConfig._retry = true;
      originalConfig.headers = setAuthOn(originalConfig.headers, newToken);
      return apiClient(originalConfig);
    } catch (refreshError) {
      _finalizeUnauthorized(uid);
      return Promise.reject(refreshError);
    }
  },
);

export const cacheAccessTokenFor = (userId: string, token: string | null) =>
  _cacheAccessTokenFor(userId, token, 'api');

export const getAccessTokenFor = (userId: string) => _getAccessTokenFor(userId);

export const configureUnauthorizedHandler = (fn: (() => void) | null) =>
  _configureUnauthorizedHandler(fn);

export const clearAuthHeader = () => setLegacyAccessToken(null, 'clear');

export async function switchUser(userId: string, onNeedLogin?: (id: string) => void) {
  const cached = _getAccessTokenFor(userId);
  if (cached && !isTokenExpiring(cached)) {
    setActiveUserId(userId);
    setLegacyAccessToken(cached, 'store');
    return;
  }
  try {
    const newToken = await refreshAccessTokenFor(userId);
    setActiveUserId(userId);
    setLegacyAccessToken(newToken, 'refresh');
  } catch {
    if (onNeedLogin) onNeedLogin(userId);
    else throw new Error('Refresh token not found for this user. Redirect to sign-in.');
  }
}

export async function hydrateAccessTokenFor(userId: string) {
  const cached = _getAccessTokenFor(userId);
  if (cached && !isTokenExpiring(cached)) return;

  try {
    const newToken = await refreshAccessTokenFor(userId);
    if (getActiveUserId() === userId) setLegacyAccessToken(newToken, 'refresh');
  } catch {}
}

export default apiClient;
