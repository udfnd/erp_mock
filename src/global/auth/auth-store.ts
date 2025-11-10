'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

import { cacheAccessTokenFor, clearAllTokens, setActiveUserId } from '@/global/auth/token-store';
import { setAccessToken as broadcastAccessToken, subscribeAccessToken } from './access-token';

export type AuthState = {
  accessToken: string | null;
  sayongjaNanoId: string | null;
  // sayongjaName: string | null;
  gigwanNanoId: string | null;
  gigwanName: string | null;
  loginId: string | null;
};

export type AuthSnapshot = {
  state: AuthState;
  isReady: boolean;
  isAuthenticated: boolean;
};

type AuthStoreState = AuthSnapshot & {
  initialize: () => void;
  setAuthState: (next: AuthState) => void;
  updateAuthState: (partial: Partial<AuthState>) => void;
  clearAuthState: () => void;
};

const STORAGE_KEY = 'erp-auth-state';
const isBrowser = typeof window !== 'undefined';

const createDefaultState = (): AuthState => ({
  accessToken: null,
  sayongjaNanoId: null,
  // sayongjaName: null,
  gigwanNanoId: null,
  gigwanName: null,
  loginId: null,
});

const toSnapshot = (state: AuthState, isReady: boolean): AuthSnapshot => ({
  state,
  isReady,
  isAuthenticated: Boolean(state.accessToken),
});

const readPersistedState = (): AuthState | null => {
  if (!isBrowser) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AuthState>;
    return { ...createDefaultState(), ...(parsed ?? {}) };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const runSideEffects = (state: AuthState) => {
  if (state.accessToken && state.sayongjaNanoId) {
    cacheAccessTokenFor(state.sayongjaNanoId, state.accessToken);
    setActiveUserId(state.sayongjaNanoId);
    if (isBrowser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } else {
    if (state.sayongjaNanoId) {
      cacheAccessTokenFor(state.sayongjaNanoId, null);
    }
    setActiveUserId(null);
    clearAllTokens();
    if (isBrowser) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  broadcastAccessToken(state.accessToken, 'store');
};

let hasInitialized = false;

const useAuthStore = create<AuthStoreState>((set) => ({
  state: createDefaultState(),
  isReady: false,
  isAuthenticated: false,
  initialize: () => {
    if (hasInitialized) return;
    hasInitialized = true;

    subscribeAccessToken((token, source) => {
      if (source === 'store') return;
      set((prev) => {
        const nextState = { ...prev.state, accessToken: token };
        return toSnapshot(nextState, prev.isReady);
      });
    });

    if (!isBrowser) return;

    const restored = readPersistedState();
    const nextState = restored ?? createDefaultState();
    set(() => toSnapshot(nextState, true));
  },
  setAuthState: (next) => {
    const merged: AuthState = { ...createDefaultState(), ...next };
    set(() => toSnapshot(merged, true));
  },
  updateAuthState: (partial) => {
    set((prev) => {
      const merged = { ...prev.state, ...partial };
      return toSnapshot(merged, true);
    });
  },
  clearAuthState: () => {
    clearAllTokens();
    set(() => toSnapshot(createDefaultState(), true));
  },
}));

useAuthStore.subscribe(
  (store) => ({ state: store.state, isReady: store.isReady }),
  ({ state, isReady }, previous) => {
    if (!isReady) return;
    if (!previous?.isReady || previous.state !== state) {
      runSideEffects(state);
    }
  },
);

export const initializeAuthStore = () => useAuthStore.getState().initialize();

export const getAuthSnapshot = (): AuthSnapshot => {
  const { state, isReady, isAuthenticated } = useAuthStore.getState();
  return { state, isReady, isAuthenticated };
};

export const setAuthState = (next: AuthState) => useAuthStore.getState().setAuthState(next);

export const updateAuthState = (partial: Partial<AuthState>) =>
  useAuthStore.getState().updateAuthState(partial);

export const clearAuthState = () => useAuthStore.getState().clearAuthState();

export const useAuth = () => {
  useEffect(() => {
    initializeAuthStore();
  }, []);

  return useAuthStore(
    (store) => ({
      state: store.state,
      isReady: store.isReady,
      isAuthenticated: store.isAuthenticated,
      setAuthState: store.setAuthState,
      updateAuthState: store.updateAuthState,
      clearAuthState: store.clearAuthState,
    }),
    shallow,
  );
};
