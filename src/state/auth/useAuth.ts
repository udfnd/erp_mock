'use client';

import { useEffect, useMemo } from 'react';
import { useSyncExternalStore } from 'react';

import {
  clearAuthState,
  getAuthSnapshot,
  initializeAuthStore,
  setAuthState,
  subscribeAuthStore,
  updateAuthState,
} from './auth-store';

export const useAuth = () => {
  useEffect(() => {
    initializeAuthStore();
  }, []);

  const snapshot = useSyncExternalStore(subscribeAuthStore, getAuthSnapshot, getAuthSnapshot);

  return useMemo(
    () => ({
      state: snapshot.state,
      isReady: snapshot.isReady,
      isAuthenticated: snapshot.isAuthenticated,
      setAuthState,
      updateAuthState,
      clearAuthState,
    }),
    [snapshot],
  );
};

export type { AuthState } from './auth-store';
