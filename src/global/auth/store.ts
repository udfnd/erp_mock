'use client';

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';

export type Token = string | null;
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
  sayongjaName: string;
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

export const useAuthStore = create<AuthState>()(
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
              users: { ...s.users, [meta.sayongjaNanoId]: { ...meta } },
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
            set({ users: {}, tokensByUser: {}, activeUserId: null, history: [] });
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
            if (uid) get().setAccessTokenFor(uid, null, 'clear');
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

export const authStore = {
  getState: () => useAuthStore.getState(),
  setState: (updater: Partial<AuthState> | ((s: AuthState) => AuthState | Partial<AuthState>)) =>
    useAuthStore.setState(updater, false),
};

export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated());
export const useAccessToken = () => useAuthStore((s) => s.getCurrentAccessToken());
export const useActiveUserMeta = () => useAuthStore((s) => s.getActiveUserMeta());
export const useUnauthorizedTick = () => useAuthStore((s) => s.unauthorizedTick);

export const setActiveUserId = (id: string | null) => useAuthStore.getState().setActiveUser(id);

export type AuthStatePatch = Partial<
  Pick<UserMeta, 'gigwanNanoId' | 'gigwanName' | 'sayongjaName' | 'loginId'>
>;

export const setAuthState = (patch: AuthStatePatch): void => {
  const st = useAuthStore.getState();
  const uid = st.activeUserId;
  if (!uid) return;
  const prev = st.users[uid];
  if (!prev) return;
  st.upsertUser({ ...prev, ...patch, sayongjaNanoId: uid });
};

export const upsertUser = (meta: UserMeta) => useAuthStore.getState().upsertUser(meta);
export const clearAll = () => useAuthStore.getState().clearAll();
export const setAccessTokenFor = (
  userId: string,
  token: string | null,
  source: TokenSource = 'api',
) => useAuthStore.getState().setAccessTokenFor(userId, token, source);
