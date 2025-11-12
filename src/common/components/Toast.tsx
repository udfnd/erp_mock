'use client';

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import {
  accentBarStyle,
  actionRowStyle,
  confirmButtonStyle,
  messageStyle,
  toastAccentColors,
  toastContainerStyle,
  toastInnerStyle,
  toastLeavingStyle,
  toastWrapperStyle,
  type ToastVariant,
} from './Toast.style';

type ToastInstance = {
  id: string;
  message: string;
  variant: ToastVariant;
  isLeaving: boolean;
};

export type ToastOptions = {
  message: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const generateId = () => `toast-${Math.random().toString(36).slice(2, 11)}`;

const EXIT_DURATION = 200;
const AUTO_HIDE_DURATION = 10000;

function useHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window !== 'undefined') {
        const id = requestAnimationFrame(cb);
        return () => cancelAnimationFrame(id);
      }
      return () => {};
    },
    () => true,
    () => false,
  );
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const hydrated = useHydrated(); // ✅ setState 없는 하이드레이션 플래그

  const autoHideTimers = useRef<Map<string, number>>(new Map());
  const exitTimers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    return () => {
      autoHideTimers.current.forEach((tid) => window.clearTimeout(tid));
      exitTimers.current.forEach((tid) => window.clearTimeout(tid));
      autoHideTimers.current.clear();
      exitTimers.current.clear();
    };
  }, []);

  const clearTimers = useCallback((id: string) => {
    const a = autoHideTimers.current.get(id);
    if (a) {
      window.clearTimeout(a);
      autoHideTimers.current.delete(id);
    }
    const e = exitTimers.current.get(id);
    if (e) {
      window.clearTimeout(e);
      exitTimers.current.delete(id);
    }
  }, []);

  const removeToast = useCallback(
    (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      clearTimers(id);
    },
    [clearTimers],
  );

  const initiateExit = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id && !t.isLeaving ? { ...t, isLeaving: true } : t)),
      );

      if (exitTimers.current.has(id)) return;

      const tid = window.setTimeout(() => {
        removeToast(id);
      }, EXIT_DURATION);
      exitTimers.current.set(id, tid);
    },
    [removeToast],
  );

  const scheduleAutoHide = useCallback(
    (id: string) => {
      const tid = window.setTimeout(() => initiateExit(id), AUTO_HIDE_DURATION);
      autoHideTimers.current.set(id, tid);
    },
    [initiateExit],
  );

  const showToast = useCallback(
    ({ message, variant = 'info' }: ToastOptions) => {
      if (!message.trim()) return;

      const id = generateId();

      setToasts((prev) => {
        const trimmed = prev.length >= 3 ? prev.slice(1) : prev;
        if (prev.length >= 3) {
          const removed = prev[0];
          clearTimers(removed.id);
        }
        return [...trimmed, { id, message, variant, isLeaving: false }];
      });

      scheduleAutoHide(id);
    },
    [clearTimers, scheduleAutoHide],
  );

  const contextValue = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {hydrated &&
        createPortal(
          <div css={toastContainerStyle} role="region" aria-live="polite" aria-atomic="true">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                role="alert"
                css={[toastWrapperStyle, toast.isLeaving && toastLeavingStyle]}
              >
                <div
                  css={[accentBarStyle, { backgroundColor: toastAccentColors[toast.variant] }]}
                />
                <div css={toastInnerStyle}>
                  <p css={messageStyle}>{toast.message}</p>
                  <div css={actionRowStyle}>
                    <button
                      type="button"
                      css={confirmButtonStyle}
                      onClick={() => initiateExit(toast.id)}
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
};

export type ToastAPI = {
  show: (message: string, variant?: ToastVariant) => void;
  info: (message: string) => void;
  neutral: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
};

export const useToast = (): ToastAPI => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      ctx.showToast({ message, variant });
    },
    [ctx],
  );

  return useMemo<ToastAPI>(
    () => ({
      show,
      info: (m: string) => show(m, 'info'),
      neutral: (m: string) => show(m, 'neutral'),
      warning: (m: string) => show(m, 'warning'),
      error: (m: string) => show(m, 'error'),
    }),
    [show],
  );
};

export type { ToastVariant };
