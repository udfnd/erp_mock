'use client';

import { useEffect } from 'react';
import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/global/auth/store';
import { API_BASE_URL, handleAuthResponse, handleAuthError, getAccessTokenForUser } from '@/global/auth/session';

export { configureUnauthorizedHandler } from '@/global/auth/session';

export const getAccessTokenFor = getAccessTokenForUser;

type AuthenticatedRequestConfig = InternalAxiosRequestConfig & {
  _authUserId?: string;
  _authOverrideToken?: string;
};

type AuthContext = {
  token: string | null;
  userId: string | null;
};

const AUTH_USER_HEADER = 'X-Auth-User';
const AUTH_STORAGE_KEY = 'erp-auth';

const ensureHeaders = (headers?: AxiosRequestHeaders) =>
  headers instanceof AxiosHeaders ? headers : AxiosHeaders.from(headers ?? {});

let persistedUserId: string | null | undefined;

const readPersistedUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  if (persistedUserId !== undefined) return persistedUserId;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      persistedUserId = null;
      return null;
    }
    const parsed = JSON.parse(raw) as { state?: { activeUserId?: unknown } };
    const value = parsed.state?.activeUserId;
    persistedUserId = typeof value === 'string' ? value : null;
    return persistedUserId;
  } catch {
    persistedUserId = null;
    return null;
  }
};

let authContext: AuthContext = { token: null, userId: null };

export const setApiClientAuthContext = (context: Partial<AuthContext>) => {
  authContext = { ...authContext, ...context };
  if (Object.prototype.hasOwnProperty.call(context, 'userId')) {
    persistedUserId = context.userId ?? null;
  }
};

const applyAuthContext = (config: AuthenticatedRequestConfig): AuthenticatedRequestConfig => {
  const headers = ensureHeaders(config.headers);
  const overrideToken = config._authOverrideToken;
  const token = overrideToken ?? authContext.token;
  const userId = authContext.userId ?? readPersistedUserId() ?? undefined;

  if (token) headers.set('Authorization', `Bearer ${token}`);
  else headers.delete('Authorization');

  if (userId) headers.set(AUTH_USER_HEADER, userId);
  else headers.delete(AUTH_USER_HEADER);

  config.headers = headers;
  config._authUserId = userId;
  if (overrideToken !== undefined) {
    delete config._authOverrideToken;
  }
  return config;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => applyAuthContext(config as AuthenticatedRequestConfig),
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => handleAuthResponse(response),
  (error) => handleAuthError(error, apiClient),
);

export const publicApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

publicApiClient.interceptors.response.use(
  (response) => handleAuthResponse(response),
  (error) => Promise.reject(error),
);

export const useSyncApiClientAuthContext = () => {
  const { token, userId } = useAuthStore(
    useShallow((state) => ({
      token: state.getCurrentAccessToken(),
      userId: state.activeUserId,
    })),
  );

  useEffect(() => {
    setApiClientAuthContext({ token, userId: userId ?? null });
  }, [token, userId]);
};

export default apiClient;
