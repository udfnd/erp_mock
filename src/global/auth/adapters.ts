'use client';

import type { AxiosInstance } from 'axios';
import { useAuth } from './store';

export function bindAxiosAuth(axios: AxiosInstance, onUnauthorized?: () => void) {
  axios.interceptors.request.use((cfg) => {
    const token = useAuth.getState().getCurrentAccessToken();
    if (token) {
      cfg.headers = cfg.headers ?? {};
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
  });

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        useAuth.getState().handleUnauthorized();
        onUnauthorized?.();
      }
      throw err;
    },
  );
}

export function subscribeAccessToken(listener: (token: string | null) => void) {
  return useAuth.subscribe(
    s => s.getCurrentAccessToken(),
    (next) => listener(next),
  );
}
