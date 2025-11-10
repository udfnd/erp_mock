'use client';

import { useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';

type Token = string | null;
export type TokenSource = 'api' | 'store' | 'refresh' | 'clear';

export type AuthHistoryEntry = {
  sayongjaNanoId: string;
  sayongjaName: string;
  gigwanName: string | null;
  gigwanNanoId: string | null;
  lastUsedAt: number;
};

export type UserMeta = {
  sayongjaNanoId: string;
  sayongjaName: string | null;
  gigwanName: string | null;
  gigwanNanoId: string | null;
  loginId: string | null;
};

type AuthState = {
  isReady: boolean;
  activeUserId: string | null;
  users: Record<string, UserMeta>;
  tokensByUser: Record<string, string>;
  history: AuthHistoryEntry[];
  unauthorizedTick: number;
  isAuthenticated(): boolean;
  getCurrentAccessToken(): Token;
  getActiveUserMeta(): UserMeta | null;
  setActiveUser(userId: string | null): void;
  upsertUser(meta: UserMeta): void;
  removeUser(userId: string): void;
  setAccessTokenFor(userId: string, token: Token, source?: TokenSource): void;
  clearAll(): void;
  upsertHistory(
    entry: Omit<AuthHistoryEntry, 'lastUsedAt'> & Partial<Pick<AuthHistoryEntry, 'lastUsedAt'>>,
  ): void;
  removeHistory(userId: string): void;
  handleUnauthorized(): void;
};

const safeStorage =
  typeof window === 'undefined' ? undefined : createJSONStorage(() => localStorage);

export const useAuth = create<AuthState>()(
  subscribeWithSelector(
    devtools(
      persist(
        (set, get) => ({
          isReady: true,
          activeUserId: null,
          users: {},
          tokensByUser: {},
          history: [],
          unauthorizedTick: 0,
          isAuthenticated() {
            const s = get();
            const uid = s.activeUserId;
            return Boolean(uid && s.tokensByUser[uid]);
          },
          getCurrentAccessToken() {
            const s = get();
            const uid = s.activeUserId;
            return uid ? (s.tokensByUser[uid] ?? null) : null;
          },
          getActiveUserMeta() {
            const s = get();
            const uid = s.activeUserId;
            return uid ? (s.users[uid] ?? null) : null;
          },
          setActiveUser(userId) {
            set({ activeUserId: userId });
          },
          upsertUser(meta) {
            set((s) => ({
              users: {
                ...s.users,
                [meta.sayongjaNanoId]: { ...meta },
              },
            }));
          },
          removeUser(userId) {
            set((s) => {
              const users = { ...s.users };
              const tokens = { ...s.tokensByUser };
              delete users[userId];
              delete tokens[userId];
              const activeUserId = s.activeUserId === userId ? null : s.activeUserId;
              return { users, tokensByUser: tokens, activeUserId };
            });
          },
          setAccessTokenFor(userId, token) {
            if (token) {
              set((s) => ({ tokensByUser: { ...s.tokensByUser, [userId]: token } }));
            } else {
              set((s) => {
                const next = { ...s.tokensByUser };
                delete next[userId];
                return { tokensByUser: next };
              });
            }
          },
          clearAll() {
            set({
              users: {},
              tokensByUser: {},
              activeUserId: null,
              history: [],
            });
          },
          upsertHistory(entry) {
            const now = Date.now();
            set((s) => {
              const filtered = s.history.filter((h) => h.sayongjaNanoId !== entry.sayongjaNanoId);
              const merged: AuthHistoryEntry = {
                sayongjaNanoId: entry.sayongjaNanoId,
                sayongjaName: entry.sayongjaName,
                gigwanName: entry.gigwanName ?? null,
                gigwanNanoId: entry.gigwanNanoId ?? null,
                lastUsedAt: entry.lastUsedAt ?? now,
              };
              const next = [merged, ...filtered]
                .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
                .slice(0, 20);
              return { history: next };
            });
          },
          removeHistory(userId) {
            set((s) => ({ history: s.history.filter((h) => h.sayongjaNanoId !== userId) }));
          },
          handleUnauthorized() {
            const uid = get().activeUserId;
            if (uid) {
              get().setAccessTokenFor(uid, null, 'clear');
            }
            set((s) => ({ unauthorizedTick: s.unauthorizedTick + 1 }));
          },
        }),
        {
          name: 'erp-auth',
          storage: safeStorage,
          version: 1,
          partialize: (s) => ({
            activeUserId: s.activeUserId,
            users: s.users,
            history: s.history,
          }),
        },
      ),
      { name: 'auth-store' },
    ),
  ),
);

export const useIsAuthenticated = () => useAuth((s) => s.isAuthenticated());
export const useAccessToken = () => useAuth((s) => s.getCurrentAccessToken());
export const useActiveUserMeta = () => useAuth((s) => s.getActiveUserMeta());
export const useUnauthorizedTick = () => useAuth((s) => s.unauthorizedTick);

export type AuthSessionUpdate = {
  accessToken: string;
  sayongjaNanoId: string;
  gigwanNanoId?: string | null;
  gigwanName?: string | null;
  loginId?: string | null;
  sayongjaName?: string | null;
  tokenSource?: TokenSource;
};

const resolveField = <T,>(value: T | undefined, fallback: T): T =>
  value === undefined ? fallback : value;

export const setAuthSession = ({
  accessToken,
  sayongjaNanoId,
  gigwanNanoId,
  gigwanName,
  loginId,
  sayongjaName,
  tokenSource = 'api',
}: AuthSessionUpdate) => {
  const store = useAuth.getState();
  const previous = store.users[sayongjaNanoId] ?? null;
  store.upsertUser({
    sayongjaNanoId,
    sayongjaName: resolveField(sayongjaName, previous?.sayongjaName ?? null),
    gigwanName: resolveField(gigwanName, previous?.gigwanName ?? null),
    gigwanNanoId: resolveField(gigwanNanoId, previous?.gigwanNanoId ?? null),
    loginId: resolveField(loginId, previous?.loginId ?? null),
  });
  store.setAccessTokenFor(sayongjaNanoId, accessToken, tokenSource);
  store.setActiveUser(sayongjaNanoId);
};

export const clearAuthSession = () => {
  useAuth.getState().clearAll();
};

export const useAuthSession = () => {
  const isReady = useAuth((s) => s.isReady);
  const isAuthenticated = useIsAuthenticated();
  const accessToken = useAccessToken();
  const activeMeta = useActiveUserMeta();

  const state = useMemo(
    () => ({
      accessToken,
      sayongjaNanoId: activeMeta?.sayongjaNanoId ?? null,
      gigwanNanoId: activeMeta?.gigwanNanoId ?? null,
      gigwanName: activeMeta?.gigwanName ?? null,
      loginId: activeMeta?.loginId ?? null,
    }),
    [accessToken, activeMeta],
  );

  const setAuthState = useCallback(
    (update: AuthSessionUpdate) => {
      setAuthSession(update);
    },
    [],
  );

  const clearAuthState = useCallback(() => {
    clearAuthSession();
  }, []);

  return {
    state,
    isReady,
    isAuthenticated,
    setAuthState,
    clearAuthState,
  };
};

export const useAuthHistory = () => {
  const history = useAuth((s) => s.history);

  const refresh = useCallback(() => {
    useAuth.setState((s) => ({ history: [...s.history] }));
  }, []);

  const remove = useCallback((userId: string) => {
    useAuth.getState().removeHistory(userId);
  }, []);

  return { history, refresh, remove };
};

export const upsertAuthHistoryEntry = (
  entry: Omit<AuthHistoryEntry, 'lastUsedAt'> &
    Partial<Pick<AuthHistoryEntry, 'lastUsedAt'>>,
) => {
  useAuth.getState().upsertHistory(entry);
};

export const authGetState = () => useAuth.getState();
export const authSetState = (
  updater: Partial<AuthState> | ((s: AuthState) => Partial<AuthState>),
) => useAuth.setState(updater);
