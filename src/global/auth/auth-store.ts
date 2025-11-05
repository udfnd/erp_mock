'use client';

import { clearAuthHeader, cacheAccessTokenFor, setActiveUserId } from '@/global/apiClient';
import { setAccessToken as publishAccessToken, subscribeAccessToken } from './access-token';

export type AuthState = {
  accessToken: string | null;
  sayongjaNanoId: string | null; // 사용자 고유 ID(멀티세션 키)
  sayongjaName: string | null;
  gigwanNanoId: string | null;
  gigwanName: string | null;
  loginId: string | null; // 로그인 ID(표시용)
};

export type AuthSnapshot = {
  state: AuthState;
  isReady: boolean;
  isAuthenticated: boolean;
};

const STORAGE_KEY = 'erp-auth-state';

const createDefaultState = (): AuthState => ({
  accessToken: null,
  sayongjaNanoId: null,
  sayongjaName: null,
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
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((l) => l());
};

const persistState = (state: AuthState) => {
  if (typeof window === 'undefined') return;
  if (state.accessToken && state.sayongjaNanoId) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const syncToApiClient = (state: AuthState) => {
  // 멀티세션(계정별)로 apiClient에 반영
  if (state.accessToken && state.sayongjaNanoId) {
    cacheAccessTokenFor(state.sayongjaNanoId, state.accessToken);
    setActiveUserId(state.sayongjaNanoId);
  } else {
    // 활성 사용자 제거
    setActiveUserId(null);
    clearAuthHeader();
  }
  // UI 호환 채널로도 브로드캐스트
  publishAccessToken(state.accessToken, 'store');
};

const applySnapshot = (next: AuthSnapshot) => {
  snapshot = next;
  if (snapshot.isReady) {
    persistState(snapshot.state);
    syncToApiClient(snapshot.state);
  }
  notify();
};

const updateSnapshot = (updater: (prev: AuthSnapshot) => AuthSnapshot) => {
  applySnapshot(updater(snapshot));
};

export const initializeAuthStore = () => {
  if (hasInitialized) return;
  hasInitialized = true;

  // 외부(pub/sub)를 통해 토큰이 들어오는 경우(희소 케이스) 동기화
  subscribeAccessToken((token, source) => {
    if (source === 'store') return;
    updateSnapshot((prev) => {
      const nextState: AuthState = { ...prev.state, accessToken: token };
      return {
        state: nextState,
        isReady: prev.isReady,
        isAuthenticated: Boolean(token),
      };
    });
  });

  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<AuthState>) : undefined;
    const restored: AuthState = { ...createDefaultState(), ...(parsed ?? {}) };

    applySnapshot({
      state: restored,
      isReady: true,
      isAuthenticated: Boolean(restored.accessToken),
    });
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    applySnapshot({
      state: createDefaultState(),
      isReady: true,
      isAuthenticated: false,
    });
  }
};

export const subscribeAuthStore = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getAuthSnapshot = () => snapshot;

export const setAuthState = (next: AuthState) => {
  const merged: AuthState = { ...createDefaultState(), ...next };
  updateSnapshot(() => ({
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
  updateSnapshot(() => ({
    state: createDefaultState(),
    isReady: true,
    isAuthenticated: false,
  }));
};
