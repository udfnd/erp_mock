'use client';

import type { AuthHistoryEntry } from './store';
import { useShallow } from 'zustand/react/shallow';
import {
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
} from './store';

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
