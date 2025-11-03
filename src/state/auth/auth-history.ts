'use client';

import { useCallback, useState } from 'react';

import type { AuthState } from './auth-store';

type StoredAuthHistoryEntry = {
  authState: AuthState;
  sayongjaNanoId: string;
  sayongjaName: string;
  gigwanName: string | null;
  lastUsedAt: number;
};

const HISTORY_STORAGE_KEY = 'erp-auth-history';
const HISTORY_LIMIT = 5;

const createEmptyHistory = (): StoredAuthHistoryEntry[] => [];

const isValidEntry = (value: unknown): value is StoredAuthHistoryEntry => {
  if (!value || typeof value !== 'object') return false;
  const entry = value as StoredAuthHistoryEntry;
  return (
    typeof entry.sayongjaNanoId === 'string' &&
    typeof entry.sayongjaName === 'string' &&
    typeof entry.lastUsedAt === 'number' &&
    typeof entry.authState === 'object' &&
    entry.authState !== null
  );
};

const readHistoryFromStorage = (): StoredAuthHistoryEntry[] => {
  if (typeof window === 'undefined') return createEmptyHistory();

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return createEmptyHistory();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return createEmptyHistory();

    return parsed.filter(isValidEntry).slice(0, HISTORY_LIMIT);
  } catch (error) {
    console.error('Failed to read auth history', error);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
    return createEmptyHistory();
  }
};

const writeHistoryToStorage = (history: StoredAuthHistoryEntry[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
  } catch (error) {
    console.error('Failed to persist auth history', error);
  }
};

export type AuthHistoryEntry = StoredAuthHistoryEntry;

export const upsertAuthHistoryEntry = (entry: AuthHistoryEntry) => {
  if (typeof window === 'undefined') return;

  const history = readHistoryFromStorage();
  const filtered = history.filter((item) => item.sayongjaNanoId !== entry.sayongjaNanoId);
  const next = [{ ...entry, lastUsedAt: Date.now() }, ...filtered].slice(0, HISTORY_LIMIT);
  writeHistoryToStorage(next);
};

export const removeAuthHistoryEntry = (sayongjaNanoId: string) => {
  if (typeof window === 'undefined') return;
  const history = readHistoryFromStorage();
  const next = history.filter((item) => item.sayongjaNanoId !== sayongjaNanoId);
  writeHistoryToStorage(next);
};

export const useAuthHistory = () => {
  const [history, setHistory] = useState<AuthHistoryEntry[]>(() => readHistoryFromStorage());

  const refresh = useCallback(() => {
    setHistory(readHistoryFromStorage());
  }, []);

  const remove = useCallback((sayongjaNanoId: string) => {
    removeAuthHistoryEntry(sayongjaNanoId);
    refresh();
  }, [refresh]);

  return { history, refresh, remove } as const;
};

