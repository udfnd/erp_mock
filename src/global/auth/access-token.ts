'use client';

export type AccessTokenSource = 'api' | 'store';
type Token = string | null;
type Listener = (token: Token, source: AccessTokenSource) => void;

let currentToken: Token = null;
const listeners = new Set<Listener>();

export const getAccessToken = () => currentToken;

export const setAccessToken = (token: Token, source: AccessTokenSource = 'api') => {
  if (currentToken === token) return;
  currentToken = token;
  listeners.forEach((l) => {
    try {
      l(currentToken, source);
    } catch {
      // listener 오류는 삼킨다
    }
  });
};

export const subscribeAccessToken = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export type { Listener as AccessTokenListener };
