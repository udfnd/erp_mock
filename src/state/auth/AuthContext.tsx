'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { clearAuthHeader, setAccessToken } from '@/api';

type AuthState = {
  accessToken: string | null;
  gigwanNanoId: string | null;
  gigwanName: string | null;
  loginId: string | null;
};

const DEFAULT_AUTH_STATE: AuthState = {
  accessToken: null,
  gigwanNanoId: null,
  gigwanName: null,
  loginId: null,
};

const STORAGE_KEY = 'erp-auth-state';

type AuthContextValue = {
  state: AuthState;
  isReady: boolean;
  isAuthenticated: boolean;
  setAuthState: (next: AuthState) => void;
  updateAuthState: (partial: Partial<AuthState>) => void;
  clearAuthState: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(DEFAULT_AUTH_STATE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthState;
        setState({ ...DEFAULT_AUTH_STATE, ...parsed });
        if (parsed.accessToken) {
          setAccessToken(parsed.accessToken);
        }
      }
    } catch (error) {
      console.error('Failed to restore auth state', error);
      window.localStorage.removeItem(STORAGE_KEY);
      clearAuthHeader();
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    setAccessToken(state.accessToken);

    if (typeof window === 'undefined') return;

    if (state.accessToken) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [state, isReady]);

  const setAuthState = useCallback((next: AuthState) => {
    setState({ ...DEFAULT_AUTH_STATE, ...next });
  }, []);

  const updateAuthState = useCallback((partial: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearAuthState = useCallback(() => {
    setState(DEFAULT_AUTH_STATE);
    clearAuthHeader();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      isReady,
      isAuthenticated: Boolean(state.accessToken),
      setAuthState,
      updateAuthState,
      clearAuthState,
    }),
    [state, isReady, setAuthState, updateAuthState, clearAuthState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

