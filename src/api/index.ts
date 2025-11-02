import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { refreshAccessToken as apiRefreshAccessToken } from './auth/auth.api';

import type { SignInResponse } from '@/api/auth';

const API_BASE_URL = 'http://staging.api.v3.teachita.com/api';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

const stripQueryAndSlash = (url?: string) => {
  if (!url) return '';
  const q = url.indexOf('?');
  const base = q >= 0 ? url.slice(0, q) : url;
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

const isSignIn = (url?: string) => stripQueryAndSlash(url).endsWith('/sign-in');
const isRefresh = (url?: string) => stripQueryAndSlash(url).endsWith('/refresh-access');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers && !isSignIn(config.url) && !isRefresh(config.url)) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: AxiosError) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

const refreshAccessTokenInternal = async (): Promise<{ accessToken: string }> => {
  const { accessToken: newAccessToken } = await apiRefreshAccessToken();
  return { accessToken: newAccessToken };
};

apiClient.interceptors.response.use(
  (response) => {
    const url = response.config?.url;
    if (isSignIn(url) && response.data?.accessToken) {
      setAccessToken((response.data as SignInResponse).accessToken);
    }
    if (isRefresh(url) && response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefresh(originalRequest.url) &&
      !isSignIn(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          (originalRequest.headers ??= {} as any).Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken: newAccessToken } = await refreshAccessTokenInternal();
        setAccessToken(newAccessToken);
        (apiClient.defaults.headers.common as any)['Authorization'] = `Bearer ${newAccessToken}`;
        (originalRequest.headers ??= {} as any).Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        processQueue(refreshError as AxiosError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const clearAuthHeader = () => {
  delete (apiClient.defaults.headers.common as any)['Authorization'];
  setAccessToken(null);
};

export default apiClient;
