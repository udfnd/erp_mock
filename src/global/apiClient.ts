import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://staging.api.v3.teachita.com/api';

const SIGN_IN_PATTERN = /^\/?(?:api\/)?T\/dl\/sayongjas\/sign-in$/;
const REFRESH_PATTERN = /^\/?(?:api\/)?T\/dl\/sayongjas\/([^/]+)\/refresh-access$/;
const REFRESH_ENDPOINT_BASE = 'T/dl/sayongjas';
const REFRESH_ENDPOINT_SUFFIX = 'refresh-access';

const stripQueryAndSlash = (url?: string) => {
  if (!url) return '';
  const q = url.indexOf('?');
  const base = q >= 0 ? url.slice(0, q) : url;
  let pathname = base;
  try {
    pathname = new URL(base, 'http://stub').pathname;
  } catch {}
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};
const isSignIn = (url?: string) => SIGN_IN_PATTERN.test(stripQueryAndSlash(url));
const extractRefreshUserIdFromUrl = (url?: string): string | null => {
  const u = stripQueryAndSlash(url);
  const match = REFRESH_PATTERN.exec(u);
  return match ? match[1] : null;
};
const isRefresh = (url?: string) => {
  const u = stripQueryAndSlash(url);
  if (!u) return false;
  if (u === '/api/T/dl/sayongjas/refresh-access' || u === '/T/dl/sayongjas/refresh-access')
    return true;
  return REFRESH_PATTERN.test(u);
};

type NodeBuffer = { from(i: string, e: string): { toString(e: string): string } };
const getNodeBuffer = (): NodeBuffer | null => {
  const g = globalThis as unknown as { Buffer?: NodeBuffer };
  return g && typeof g.Buffer?.from === 'function' ? g.Buffer : null;
};
const b64Decode = (input: string): string => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  if (typeof atob === 'function') return atob(normalized);
  const B = getNodeBuffer();
  return B ? B.from(normalized, 'base64').toString('utf-8') : '';
};
const isTokenExpiring = (token: string, skewSec = 60): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return true;
    const payload = JSON.parse(b64Decode(parts[1])) as { exp?: number };
    const expMs = (payload.exp ?? 0) * 1000;
    return Date.now() >= expMs - skewSec * 1000;
  } catch {
    return true;
  }
};

const ensureAxiosHeaders = (h?: AxiosRequestHeaders): AxiosHeaders =>
  h instanceof AxiosHeaders ? h : AxiosHeaders.from(h ?? {});
const setAuthOn = (headers: AxiosRequestHeaders | undefined, token: string): AxiosHeaders => {
  const hx = ensureAxiosHeaders(headers);
  hx.set('Authorization', `Bearer ${token}`);
  return hx;
};
const deleteAuthOn = (headers: AxiosRequestHeaders | undefined): AxiosHeaders => {
  const hx = ensureAxiosHeaders(headers);
  hx.delete('Authorization');
  return hx;
};

let activeUserId: string | null = null;
const atByUser = new Map<string, string>(); // 유저별 accessToken 캐시

export const getActiveUserId = () => activeUserId;
export const setActiveUserId = (userId: string | null) => {
  activeUserId = userId;
};

let legacyAccessToken: string | null = null; // activeUserId 미지정 대비
export const setAccessToken = (token: string | null) => {
  legacyAccessToken = token;
};
export const getAccessToken = (): string | null => legacyAccessToken;

export const cacheAccessTokenFor = (userId: string, token: string | null) => {
  if (token) atByUser.set(userId, token);
  else atByUser.delete(userId);
  if (activeUserId === userId) setAccessToken(token);
};
export const getAccessTokenFor = (userId: string): string | null => atByUser.get(userId) ?? null;

type OnUnauthorized = () => void;
let onUnauthorized: OnUnauthorized | null = null;
export const configureUnauthorizedHandler = (handler: OnUnauthorized | null) => {
  onUnauthorized = handler;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
export default apiClient;

const refreshClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const url = config.url;
    if (!isSignIn(url) && !isRefresh(url)) {
      const uid = getActiveUserId();
      const token = uid ? atByUser.get(uid) : legacyAccessToken;
      if (token) {
        config.headers = setAuthOn(config.headers, token);
      } else if (config.headers) {
        config.headers = deleteAuthOn(config.headers);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

type AccessTokenPayload = { accessToken: string; nanoId?: string };
const hasAccessToken = (x: unknown): x is AccessTokenPayload =>
  typeof x === 'object' &&
  x !== null &&
  typeof (x as { accessToken?: unknown }).accessToken === 'string';
const getNanoId = (x: unknown): string | undefined => {
  const candidate = (x as { nanoId?: unknown })?.nanoId;
  return typeof candidate === 'string' ? candidate : undefined;
};

const finalizeUnauthorizedForUser = (uid: string) => {
  try {
    cacheAccessTokenFor(uid, null);
    if (activeUserId === uid) setAccessToken(null);
  } finally {
    if (onUnauthorized) {
      try {
        onUnauthorized();
      } catch {}
    }
  }
};

apiClient.interceptors.response.use(
  (response) => {
    const url = response.config?.url;
    const data = response.data as unknown;

    if (hasAccessToken(data)) {
      // 로그인 응답
      if (isSignIn(url)) {
        const responseNanoId = getNanoId(data);
        let userId = responseNanoId;
        if (!userId) {
          // 요청 바디에서 id 추론
          try {
            const raw = response.config?.data as unknown;
            const parsed = typeof raw === 'string' ? (JSON.parse(raw) as unknown) : raw;
            const cand =
              (parsed as Record<string, unknown> | undefined)?.['nanoId'] ??
              (parsed as Record<string, unknown> | undefined)?.['id'] ??
              (parsed as Record<string, unknown> | undefined)?.['userId'];
            if (typeof cand === 'string' && cand.length > 0) userId = cand;
          } catch {}
        }
        if (userId) {
          cacheAccessTokenFor(userId, data.accessToken);
          setActiveUserId(userId);
        } else {
          setAccessToken(data.accessToken);
        }
      }

      // 리프레시 응답
      if (isRefresh(url)) {
        const responseNanoId = getNanoId(data);
        const refreshUserId =
          responseNanoId ?? extractRefreshUserIdFromUrl(url) ?? activeUserId ?? undefined;
        if (refreshUserId) {
          cacheAccessTokenFor(refreshUserId, data.accessToken);
          setActiveUserId(refreshUserId);
        } else {
          setAccessToken(data.accessToken);
        }
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const url = original?.url;

    // 2차 401: 리프레시 후 재시도에도 또 401이면 즉시 종료
    const isSecond401AfterRetry =
      Boolean(original) && status === 401 && original?._retry && !isSignIn(url) && !isRefresh(url);
    if (isSecond401AfterRetry) {
      const uid2 = getActiveUserId();
      if (uid2) finalizeUnauthorizedForUser(uid2);
      return Promise.reject(error);
    }

    // 1차 401 자동 리프레시 진입 조건
    const eligible401 =
      Boolean(original) && status === 401 && !original?._retry && !isSignIn(url) && !isRefresh(url);
    if (!eligible401) return Promise.reject(error);

    const uid = getActiveUserId();
    if (!uid) return Promise.reject(error);

    return handle401ForUser(uid, original as InternalAxiosRequestConfig & { _retry?: boolean });
  },
);

// ---------- 동시성 제어 & 리프레시 ----------
const isRefreshingByUser = new Map<string, boolean>();
const queueByUser = new Map<
  string,
  Array<{ resolve: (t: string) => void; reject: (e: AxiosError) => void }>
>();

const pushQueue = (
  uid: string,
  item: { resolve: (t: string) => void; reject: (e: AxiosError) => void },
) => {
  const q = queueByUser.get(uid) ?? [];
  q.push(item);
  queueByUser.set(uid, q);
};
const drainQueue = (uid: string, err: AxiosError | null, token: string | null) => {
  const q = queueByUser.get(uid) ?? [];
  for (const { resolve, reject } of q) {
    if (err) reject(err);
    else resolve(token as string);
  }
  queueByUser.set(uid, []);
};

async function refreshAccessTokenFor(userId: string): Promise<string> {
  const endpoint = `${REFRESH_ENDPOINT_BASE}/${encodeURIComponent(userId)}/${REFRESH_ENDPOINT_SUFFIX}`;
  const { data } = await refreshClient.post(endpoint);
  if (!hasAccessToken(data)) throw new Error('No accessToken from refresh');
  const newAT = data.accessToken;
  cacheAccessTokenFor(userId, newAT);
  return newAT;
}

async function handle401ForUser(
  userId: string,
  original: InternalAxiosRequestConfig & { _retry?: boolean },
) {
  if (isRefreshingByUser.get(userId)) {
    // 이미 리프레시 중이면 큐에 합류 → 완료 후 새 토큰으로 재시도
    return new Promise<string>((resolve, reject) => pushQueue(userId, { resolve, reject })).then(
      (token) => {
        original.headers = setAuthOn(original.headers, token);
        return apiClient(original);
      },
    );
  }

  isRefreshingByUser.set(userId, true);
  original._retry = true;

  try {
    const newAT = await refreshAccessTokenFor(userId);
    original.headers = setAuthOn(original.headers, newAT);
    drainQueue(userId, null, newAT);
    return apiClient(original);
  } catch (e) {
    // 리프레시 실패 → 토큰 정리 + onUnauthorized 호출
    drainQueue(userId, e as AxiosError, null);
    finalizeUnauthorizedForUser(userId);
    return Promise.reject(e);
  } finally {
    isRefreshingByUser.set(userId, false);
  }
}

// ---------- 보조 유틸 ----------
export async function switchUser(userId: string, onNeedLogin?: (id: string) => void) {
  const cached = getAccessTokenFor(userId);
  if (cached && !isTokenExpiring(cached)) {
    setActiveUserId(userId);
    setAccessToken(cached);
    return;
  }
  try {
    const newAT = await refreshAccessTokenFor(userId);
    setActiveUserId(userId);
    setAccessToken(newAT);
  } catch {
    if (onNeedLogin) onNeedLogin(userId);
    else throw new Error('Refresh token not found for this user. Redirect to sign-in.');
  }
}

export async function hydrateAccessTokenFor(userId: string) {
  const cached = getAccessTokenFor(userId);
  if (cached && !isTokenExpiring(cached)) return;
  try {
    const newAT = await refreshAccessTokenFor(userId);
    if (activeUserId === userId) setAccessToken(newAT);
  } catch {}
}

export const clearAuthHeader = () => {
  legacyAccessToken = null;
};
