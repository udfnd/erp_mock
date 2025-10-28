'use client';

import { clearAuthHeader, setAccessToken } from '@/api';

type AuthData = {
  accessToken: string | null;
  gigwanNanoId: string | null;
  gigwanName: string | null;
  loginId: string | null;
};

export type AuthState = AuthData;

export type AuthSnapshot = {
  state: AuthState;
  isReady: boolean;
  isAuthenticated: boolean;
};

const STORAGE_KEY = 'erp-auth-state';

const listeners = new Set<() => void>();

const createDefaultState = (): AuthState => ({
  accessToken: null,
  gigwanNanoId: null,
  gigwanName: null,
  loginId: null,
});

let snapshot: AuthSnapshot = {
  state: createDefaultState(),
  isReady: false,
  isAuthenticated: false,
};

let hasInitialized = false;

const notify = () => {
  listeners.forEach((listener) => listener());
};

const persistState = (state: AuthState) => {
  if (typeof window === 'undefined') return;

  if (state.accessToken) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

const syncAccessToken = (token: string | null) => {
  if (token) {
    setAccessToken(token);
  } else {
    clearAuthHeader();
  }
};

const applySnapshot = (next: AuthSnapshot) => {
  snapshot = next;
  syncAccessToken(snapshot.state.accessToken);
  if (snapshot.isReady) {
    persistState(snapshot.state);
  }
  notify();
};

const updateSnapshot = (updater: (prev: AuthSnapshot) => AuthSnapshot) => {
  const next = updater(snapshot);
  applySnapshot(next);
};

export const initializeAuthStore = () => {
  if (hasInitialized) return;
  hasInitialized = true;

  if (typeof window === 'undefined') {
    return;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : createDefaultState();

    const restoredState: AuthState = {
      ...createDefaultState(),
      ...(parsed ?? {}),
    };

    applySnapshot({
      state: restoredState,
      isReady: true,
      isAuthenticated: Boolean(restoredState.accessToken),
    });
  } catch (error) {
    console.error('Failed to restore auth state', error);
    window.localStorage.removeItem(STORAGE_KEY);
    applySnapshot({
      state: createDefaultState(),
      isReady: true,
      isAuthenticated: false,
    });
  }
};

export const subscribeAuthStore = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getAuthSnapshot = () => snapshot;

export const setAuthState = (next: AuthState) => {
  const merged: AuthState = { ...createDefaultState(), ...next };
  updateSnapshot((prev) => ({
    state: merged,
    isReady: true,
    isAuthenticated: Boolean(merged.accessToken),
  }));
};

export const updateAuthState = (partial: Partial<AuthState>) => {
  updateSnapshot((prev) => {
    const nextState: AuthState = { ...prev.state, ...partial };
    return {
      state: nextState,
      isReady: true,
      isAuthenticated: Boolean(nextState.accessToken),
    };
  });
};

export const clearAuthState = () => {
  updateSnapshot((prev) => ({
    state: createDefaultState(),
    isReady: true,
    isAuthenticated: false,
  }));
};
