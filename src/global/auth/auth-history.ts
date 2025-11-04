'use client';

import { useCallback, useState } from 'react';
import type { AuthState } from './auth-store';

export type AuthHistoryEntry = {
  authState: AuthState;
  sayongjaNanoId: string;
  sayongjaName: string;
  gigwanName: string | null;
  lastUsedAt: number;
};

const HISTORY_STORAGE_KEY = 'erp-auth-history';
const HISTORY_LIMIT = 5;

const createEmpty = (): AuthHistoryEntry[] => [];

const isValidEntry = (v: unknown): v is AuthHistoryEntry => {
  if (!v || typeof v !== 'object') return false;
  const e = v as AuthHistoryEntry;
  return (
    typeof e.sayongjaNanoId === 'string' &&
    typeof e.sayongjaName === 'string' &&
    typeof e.lastUsedAt === 'number' &&
    typeof e.authState === 'object' &&
    e.authState !== null
  );
};

const readAll = (): AuthHistoryEntry[] => {
  if (typeof window === 'undefined') return createEmpty();
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return createEmpty();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return createEmpty();
    return parsed.filter(isValidEntry).slice(0, HISTORY_LIMIT);
  } catch (err) {
    // 손상된 데이터는 제거
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    return createEmpty();
  }
};

const writeAll = (list: AuthHistoryEntry[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list.slice(0, HISTORY_LIMIT)));
  } catch {
    // quota 초과 등은 조용히 무시
  }
};

export const upsertAuthHistoryEntry = (entry: AuthHistoryEntry) => {
  if (typeof window === 'undefined') return;
  const cur = readAll();
  const filtered = cur.filter((x) => x.sayongjaNanoId !== entry.sayongjaNanoId);
  const next = [{ ...entry, lastUsedAt: Date.now() }, ...filtered].slice(0, HISTORY_LIMIT);
  writeAll(next);
};

export const removeAuthHistoryEntry = (sayongjaNanoId: string) => {
  if (typeof window === 'undefined') return;
  writeAll(readAll().filter((x) => x.sayongjaNanoId !== sayongjaNanoId));
};

export const useAuthHistory = () => {
  const [history, setHistory] = useState<AuthHistoryEntry[]>(() => readAll());

  const refresh = useCallback(() => setHistory(readAll()), []);
  const remove = useCallback(
    (sayongjaNanoId: string) => {
      removeAuthHistoryEntry(sayongjaNanoId);
      refresh();
    },
    [refresh],
  );

  return { history, refresh, remove } as const;
};
