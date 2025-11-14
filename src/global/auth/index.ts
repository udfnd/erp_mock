// global/auth/index.ts
'use client';

import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  type QueryKey,
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';
import apiClient from '../apiClient';

import type { AuthHistoryEntry } from './store';
import {
  authStore,
  clearAll,
  setAccessTokenFor,
  setActiveUserId,
  setAuthState,
  upsertUser,
  useAccessToken,
  useActiveUserMeta,
  useAuthStore,
  useIsAuthenticated,
  useUnauthorizedTick,
} from './store';

import { switchUser } from './session';

export type { TokenSource, AuthHistoryEntry, UserMeta } from './store';

export {
  useAuthStore,
  useIsAuthenticated,
  useAccessToken,
  useActiveUserMeta,
  useUnauthorizedTick,
  authStore,
  setActiveUserId,
  setAuthState,
  upsertUser,
  clearAll,
  setAccessTokenFor,
  switchUser,
  apiClient,
};

export type AuthUIState = {
  gigwanNanoId: string | null;
  gigwanName: string | null;
  sayongjaNanoId: string | null;
  sayongjaName: string | null;
  loginId: string | null;
};

export type UseAuthResult = {
  state: AuthUIState;
  activeUserId: string | null;
  accessToken: string | null;
  history: AuthHistoryEntry[];
  isReady: boolean;
  isAuthenticated: boolean;
  unauthorizedTick: number;
  setAuthState: typeof setAuthState;
  setActiveUserId: typeof setActiveUserId;
  upsertUser: typeof upsertUser;
  clearAll: typeof clearAll;
  setAccessTokenFor: typeof setAccessTokenFor;
};

export function useAuth(): UseAuthResult {
  const {
    activeUserId,
    isReady,
    isAuthenticated,
    unauthorizedTick,
    history,
    gigwanNanoId,
    gigwanName,
    sayongjaNanoId,
    sayongjaName,
    loginId,
    accessToken,
  } = useAuthStore(
    useShallow((s) => ({
      activeUserId: s.activeUserId,
      isReady: s.isReady,
      isAuthenticated: s.isAuthenticated(),
      unauthorizedTick: s.unauthorizedTick,
      history: s.history,
      gigwanNanoId: s.getActiveUserMeta()?.gigwanNanoId ?? null,
      gigwanName: s.getActiveUserMeta()?.gigwanName ?? null,
      sayongjaNanoId: s.getActiveUserMeta()?.sayongjaNanoId ?? null,
      sayongjaName: s.getActiveUserMeta()?.sayongjaName ?? null,
      loginId: s.getActiveUserMeta()?.loginId ?? null,
      accessToken: s.getCurrentAccessToken(),
    })),
  );

  return {
    state: { gigwanNanoId, gigwanName, sayongjaNanoId, sayongjaName, loginId },
    activeUserId,
    accessToken,
    history,
    isReady,
    isAuthenticated,
    unauthorizedTick,
    setAuthState,
    setActiveUserId,
    upsertUser,
    clearAll,
    setAccessTokenFor,
  };
}

const AUTH_USER_HEADER = 'X-Auth-User';

export function useApiAuthContext() {
  const { activeUserId, accessToken } = useAuthStore(
    useShallow((s) => ({
      activeUserId: s.activeUserId,
      accessToken: s.getCurrentAccessToken(),
    })),
  );

  return {
    userId: activeUserId,
    token: accessToken,
  };
}

export type AuthedApiClient = Pick<
  AxiosInstance,
  'get' | 'post' | 'put' | 'patch' | 'delete' | 'request'
>;

export type AuthedQueryFnContext = {
  api: AuthedApiClient;
  token: string | null;
  userId: string | null;
};

function createAuthedApiClient(
  raw: AxiosInstance,
  ctx: { token: string | null; userId: string | null },
): AuthedApiClient {
  const makeConfig = (
    config?: AxiosRequestConfig,
  ): AxiosRequestConfig & { _authUserId?: string; _authOverrideToken?: string } => {
    const headers: AxiosRequestConfig['headers'] = {
      ...(config?.headers ?? {}),
    };

    if (ctx.userId) {
      headers[AUTH_USER_HEADER] = ctx.userId;
    }

    return {
      ...(config ?? {}),
      headers,
      _authUserId: ctx.userId ?? undefined,
      _authOverrideToken: ctx.token ?? undefined,
    };
  };

  return {
    get(url, config) {
      return raw.get(url, makeConfig(config));
    },
    post(url, data, config) {
      return raw.post(url, data, makeConfig(config));
    },
    put(url, data, config) {
      return raw.put(url, data, makeConfig(config));
    },
    patch(url, data, config) {
      return raw.patch(url, data, makeConfig(config));
    },
    delete(url, config) {
      return raw.delete(url, makeConfig(config));
    },
    request(config) {
      return raw.request(makeConfig(config));
    },
  };
}

export function useAuthedApiClient(): AuthedApiClient {
  const { userId, token } = useApiAuthContext();

  return useMemo(() => createAuthedApiClient(apiClient, { token, userId }), [token, userId]);
}

export type UseAuthedQueryOptions<TData, TError, TQueryKey extends QueryKey> = Omit<
  UseQueryOptions<TData, TError, TData, TQueryKey>,
  'queryKey' | 'queryFn'
> & {
  queryKey: TQueryKey;
  queryFn: (ctx: AuthedQueryFnContext) => Promise<TData>;
};

export function useAuthedQuery<
  TData = unknown,
  TError = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseAuthedQueryOptions<TData, TError, TQueryKey>) {
  const { userId, token } = useApiAuthContext();

  const authedApi = useMemo(
    () => createAuthedApiClient(apiClient, { token, userId }),
    [token, userId],
  );

  return useQuery<TData, TError, TData, TQueryKey>({
    ...options,
    queryKey: options.queryKey,
    queryFn: () => options.queryFn({ api: authedApi, token, userId }),
  });
}

export type AuthedMutationFnContext = AuthedQueryFnContext;

export type UseAuthedMutationOptions<TData, TError, TVariables, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn'
> & {
  mutationFn: (variables: TVariables, ctx: AuthedMutationFnContext) => Promise<TData>;
};

export function useAuthedMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(options: UseAuthedMutationOptions<TData, TError, TVariables, TContext>) {
  const { userId, token } = useApiAuthContext();

  const authedApi = useMemo(
    () => createAuthedApiClient(apiClient, { token, userId }),
    [token, userId],
  );

  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: (variables: TVariables) =>
      options.mutationFn(variables, { api: authedApi, token, userId }),
  });
}
