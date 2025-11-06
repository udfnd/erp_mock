'use client';

import {
  getActiveUserId,
  getLegacyAccessToken,
  getAccessTokenFor,
  cacheAccessTokenFor,
  setLegacyAccessToken,
  subscribeToken,
  type TokenSource,
} from '@/global/auth/token-store';

type Token = string | null;
export type AccessTokenSource = Extract<TokenSource, 'api' | 'store' | 'refresh' | 'clear'>;
export type AccessTokenListener = (token: Token, source: AccessTokenSource) => void;

export const getAccessToken = (): Token => {
  const uid = getActiveUserId();
  return uid ? getAccessTokenFor(uid) : getLegacyAccessToken();
};

export const setAccessToken = (token: Token, source: AccessTokenSource = 'api') => {
  const uid = getActiveUserId();
  if (uid) cacheAccessTokenFor(uid, token, source);
  else setLegacyAccessToken(token, source);
};

export const subscribeAccessToken = (listener: AccessTokenListener) => {
  return subscribeToken(({ token, source }) => {
    listener(token, source);
  });
};
