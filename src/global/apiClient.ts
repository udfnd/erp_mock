// global/apiClient.ts
'use client';

import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

import { API_BASE_URL, handleAuthResponse, handleAuthError } from '@/global/auth/session';

export { configureUnauthorizedHandler } from '@/global/auth/session';

type AuthContext = {
  token: string | null;
  userId: string | null;
};

let authContext: AuthContext = {
  token: null,
  userId: null,
};

export const setApiClientAuthContext = (ctx: Partial<AuthContext>) => {
  authContext = { ...authContext, ...ctx };
};

type AuthenticatedRequestConfig = InternalAxiosRequestConfig & {
  _authUserId?: string;
  _authOverrideToken?: string;
};

const ensureHeaders = (headers?: AxiosRequestHeaders) =>
  headers instanceof AxiosHeaders ? headers : AxiosHeaders.from(headers ?? {});

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const cfg = config as AuthenticatedRequestConfig;
    const headers = ensureHeaders(cfg.headers);

    const token = cfg._authOverrideToken ?? authContext.token;
    const userId = cfg._authUserId ?? authContext.userId;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      headers.delete('Authorization');
    }

    cfg.headers = headers;
    cfg._authUserId = userId ?? undefined;

    return cfg;
  },
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

export default apiClient;
