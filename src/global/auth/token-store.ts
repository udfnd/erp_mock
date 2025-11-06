'use client';

export type TokenSource = 'api' | 'store' | 'refresh' | 'clear';
type Token = string | null;

let activeUserId: string | null = null;
let legacyAccessToken: Token = null;
const tokensByUser = new Map<string, string>();

type OnUnauthorized = () => void;
let onUnauthorized: OnUnauthorized | null = null;
let unauthorizedFired = false;

type TokenListener = (args: { userId: string | null; token: Token; source: TokenSource }) => void;
const listeners = new Set<TokenListener>();

export const subscribeToken = (fn: TokenListener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const emit = (userId: string | null, token: Token, source: TokenSource) => {
  for (const l of listeners) {
    try {
      l({ userId, token, source });
    } catch {}
  }
};

export const configureUnauthorizedHandler = (fn: OnUnauthorized | null) => {
  onUnauthorized = fn;
};

export const finalizeUnauthorized = (uid?: string | null) => {
  if (unauthorizedFired) return;
  unauthorizedFired = true;
  clearAllTokens();
  onUnauthorized?.();
};

export const getActiveUserId = () => activeUserId;

export const setActiveUserId = (userId: string | null) => {
  activeUserId = userId;
  if (userId) unauthorizedFired = false; // 사용자 전환 시 리셋
};

export const getLegacyAccessToken = () => legacyAccessToken;

export const setLegacyAccessToken = (token: Token, source: TokenSource = 'api') => {
  const changed = legacyAccessToken !== token;
  legacyAccessToken = token;
  if (changed) emit(null, token, source);
};

export const cacheAccessTokenFor = (userId: string, token: Token, source: TokenSource = 'api') => {
  if (token) tokensByUser.set(userId, token);
  else tokensByUser.delete(userId);
  if (activeUserId === userId) setLegacyAccessToken(token, source);
};

export const getAccessTokenFor = (userId: string): Token => tokensByUser.get(userId) ?? null;

export const clearAllTokens = () => {
  tokensByUser.clear();
  setLegacyAccessToken(null, 'clear');
  setActiveUserId(null);
};
