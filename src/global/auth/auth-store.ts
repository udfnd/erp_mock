'use client';

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

const listeners = new Set<() => void>();

let snapshot: AuthSnapshot = {
  state: createDefaultState(),
  isReady: false,
  isAuthenticated: false,
};

let hasInitialized = false;

const notify = () => listeners.forEach((listener) => listener());

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

const applySnapshot = (next: AuthSnapshot, { sync = true }: { sync?: boolean } = {}) => {
  snapshot = next;
  if (sync && next.isReady) runSideEffects(next.state);
  notify();
};

const withMeta = (state: AuthState, isReady: boolean): AuthSnapshot => ({
  state,
  isReady,
  isAuthenticated: Boolean(state.accessToken),
});

const updateSnapshot = (updater: (current: AuthSnapshot) => AuthSnapshot) => {
  applySnapshot(updater(snapshot));
};

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

export const initializeAuthStore = () => {
  if (hasInitialized) return;
  hasInitialized = true;

  subscribeAccessToken((token, source) => {
    if (source === 'store') return;
    updateSnapshot((prev) => withMeta({ ...prev.state, accessToken: token }, prev.isReady));
  });

  if (!isBrowser) return;

  const restored = readPersistedState();
  if (restored) {
    applySnapshot(withMeta(restored, true));
    return;
  }

  applySnapshot(withMeta(createDefaultState(), true));
};

export const subscribeAuthStore = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getAuthSnapshot = () => snapshot;

export const setAuthState = (next: AuthState) => {
  const merged: AuthState = { ...createDefaultState(), ...next };
  applySnapshot(withMeta(merged, true));
};

export const updateAuthState = (partial: Partial<AuthState>) => {
  updateSnapshot((prev) => {
    const nextState: AuthState = { ...prev.state, ...partial };
    return withMeta(nextState, true);
  });
};

export const clearAuthState = () => {
  clearAllTokens();
  applySnapshot(withMeta(createDefaultState(), true));
};
