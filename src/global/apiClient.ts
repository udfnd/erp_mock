'use client';

import axios, { AxiosInstance } from 'axios';
import {
  API_BASE_URL,
  attachAuthHeader,
  handleAuthResponse,
  handleAuthError,
  getAccessTokenForUser,
} from '@/global/auth/session';

export { configureUnauthorizedHandler } from '@/global/auth/session';

export const getAccessTokenFor = getAccessTokenForUser;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => attachAuthHeader(config),
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => handleAuthResponse(response),
  (error) => handleAuthError(error, apiClient),
);

export default apiClient;
