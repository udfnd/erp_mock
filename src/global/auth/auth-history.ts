'use client';

import { useCallback, useState } from 'react';
import { switchUser } from '@/global/apiClient';

export type AuthHistoryEntry = {
  sayongjaNanoId: string;
  sayongjaName: string;
  gigwanName: string | null;
  lastUsedAt: number;
};

const HISTORY_STORAGE_KEY = 'erp-auth-history';

const createEmpty = (): AuthHistoryEntry[] => [];

const isValidEntry = (v: unknown): v is AuthHistoryEntry => {
  if (v === null || typeof v !== 'object') return false;
  const e = v as Record<string, unknown>;
  return typeof e.sayongjaNanoId === 'string';
};

const readAll = (): AuthHistoryEntry[] => {
  if (typeof window === 'undefined') return createEmpty();
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return createEmpty();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return createEmpty();
    return parsed.filter(isValidEntry);
  } catch {
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    return createEmpty();
  }
};

const writeAll = (list: AuthHistoryEntry[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list));
  } catch {}
};

export const upsertAuthHistoryEntry = (entry: AuthHistoryEntry) => {
  if (typeof window === 'undefined') return;
  const cur = readAll();
  const filtered = cur.filter((x) => x.sayongjaNanoId !== entry.sayongjaNanoId);
  const next = [{ ...entry, lastUsedAt: Date.now() }, ...filtered];
  writeAll(next);
};

export const removeAuthHistoryEntry = (sayongjaNanoId: string) => {
  if (typeof window === 'undefined') return;
  writeAll(readAll().filter((x) => x.sayongjaNanoId !== sayongjaNanoId));
};

export async function activateAuthHistoryEntry(
  entry: AuthHistoryEntry,
  onNeedLogin?: (id: string) => void,
) {
  await switchUser(entry.sayongjaNanoId, onNeedLogin);
  upsertAuthHistoryEntry(entry);
}

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
  const select = useCallback(
    async (entry: AuthHistoryEntry, onNeedLogin?: (id: string) => void) => {
      await activateAuthHistoryEntry(entry, onNeedLogin);
      refresh();
    },
    [refresh],
  );

  return { history, refresh, remove, select } as const;
};
