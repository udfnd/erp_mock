let accessToken: string | null = null;

type AccessTokenSource = 'api' | 'store';

type Listener = (token: typeof accessToken, source: AccessTokenSource) => void;

const listeners = new Set<Listener>();

export const getAccessToken = () => accessToken;

export const setAccessToken = (
  token: typeof accessToken,
  source: AccessTokenSource = 'api',
) => {
  if (accessToken === token) {
    return;
  }

  accessToken = token;

  listeners.forEach((listener) => {
    try {
      listener(accessToken, source);
    } catch (error) {
      console.error('accessToken listener failed', error);
    }
  });
};

export const subscribeAccessToken = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export type { AccessTokenSource };
