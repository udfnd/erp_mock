import { bindAxiosAuth, subscribeAccessToken } from './adapters';
import {
  useAuth as useAuthStore,
  useIsAuthenticated,
  useAccessToken,
  useActiveUserMeta,
  useUnauthorizedTick,
  authGetState,
  authSetState,
  type AuthHistoryEntry,
  type UserMeta,
} from './store';

export type { TokenSource } from './store';
export {
  bindAxiosAuth,
  subscribeAccessToken,
  useAuthStore,
  useIsAuthenticated,
  useAccessToken,
  useActiveUserMeta,
  useUnauthorizedTick,
  authGetState,
  authSetState,
};
export type { AuthHistoryEntry, UserMeta };

export type AuthUIState = {
  gigwanNanoId: string | null;
  gigwanName: string | null;
  sayongjaNanoId: string | null;
  sayongjaName: string | null;
  loginId: string | null;
};

export type AuthStatePatch = Partial<
  Pick<UserMeta, 'gigwanNanoId' | 'gigwanName' | 'sayongjaName' | 'loginId'>
>;

const setActiveUserId = (id: string | null): void => {
  useAuthStore.getState().setActiveUser(id);
};

const setAuthState = (patch: AuthStatePatch): void => {
  const st = useAuthStore.getState();
  const uid = st.activeUserId;
  if (!uid) return;
  const prev = st.users[uid];
  if (!prev) return;
  st.upsertUser({ ...prev, ...patch, sayongjaNanoId: uid });
};

const upsertUser = (meta: UserMeta): void => {
  useAuthStore.getState().upsertUser(meta);
};

const clearAll = (): void => {
  useAuthStore.getState().clearAll();
};

const setAccessTokenFor = (
  userId: string,
  token: string | null,
  source: 'api' | 'store' | 'refresh' | 'clear' = 'api',
): void => {
  useAuthStore.getState().setAccessTokenFor(userId, token, source);
};

export type UseAuthResult = {
  state: AuthUIState;
  activeUserId: string | null;
  accessToken: string | null;
  history: AuthHistoryEntry[];
  isReady: boolean;
  isAuthenticated: boolean;
  unauthorizedTick: number;
  setAuthState: (patch: AuthStatePatch) => void;
  setActiveUserId: (id: string | null) => void;
  upsertUser: (meta: UserMeta) => void;
  clearAll: () => void;
  setAccessTokenFor: (
    userId: string,
    token: string | null,
    source?: 'api' | 'store' | 'refresh' | 'clear',
  ) => void;
};

export const useAuth = (): UseAuthResult => {
  const activeUserId = useAuthStore((s) => s.activeUserId);
  const accessToken = useAuthStore((s) => s.getCurrentAccessToken());
  const history = useAuthStore((s) => s.history);
  const isReady = useAuthStore((s) => s.isReady);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const unauthorizedTick = useAuthStore((s) => s.unauthorizedTick);

  const gigwanNanoId = useAuthStore((s) => s.getActiveUserMeta()?.gigwanNanoId ?? null);
  const gigwanName = useAuthStore((s) => s.getActiveUserMeta()?.gigwanName ?? null);
  const sayongjaNanoId = useAuthStore((s) => s.getActiveUserMeta()?.sayongjaNanoId ?? null);
  const sayongjaName = useAuthStore((s) => s.getActiveUserMeta()?.sayongjaName ?? null);
  const loginId = useAuthStore((s) => s.getActiveUserMeta()?.loginId ?? null);

  return {
    state: {
      gigwanNanoId,
      gigwanName,
      sayongjaNanoId,
      sayongjaName,
      loginId,
    },
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
};
