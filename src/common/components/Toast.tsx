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

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const autoHideTimers = useRef<Map<string, number>>(new Map());
  const exitTimers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    setIsMounted(true);

    return () => {
      autoHideTimers.current.forEach((timerId) => window.clearTimeout(timerId));
      exitTimers.current.forEach((timerId) => window.clearTimeout(timerId));
      autoHideTimers.current.clear();
      exitTimers.current.clear();
    };
  }, []);

  const clearTimers = useCallback((id: string) => {
    const autoHideTimer = autoHideTimers.current.get(id);
    if (autoHideTimer) {
      window.clearTimeout(autoHideTimer);
      autoHideTimers.current.delete(id);
    }

    const exitTimer = exitTimers.current.get(id);
    if (exitTimer) {
      window.clearTimeout(exitTimer);
      exitTimers.current.delete(id);
    }
  }, []);

  const removeToast = useCallback(
    (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      clearTimers(id);
    },
    [clearTimers],
  );

  const initiateExit = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id && !toast.isLeaving ? { ...toast, isLeaving: true } : toast,
        ),
      );

      if (exitTimers.current.has(id)) {
        return;
      }

      const timerId = window.setTimeout(() => {
        removeToast(id);
      }, EXIT_DURATION);
      exitTimers.current.set(id, timerId);
    },
    [removeToast],
  );

  const scheduleAutoHide = useCallback(
    (id: string) => {
      const timerId = window.setTimeout(() => {
        initiateExit(id);
      }, AUTO_HIDE_DURATION);

      autoHideTimers.current.set(id, timerId);
    },
    [initiateExit],
  );

  const showToast = useCallback(
    ({ message, variant = 'info' }: ToastOptions) => {
      if (!message.trim()) {
        return;
      }

      const id = generateId();

      setToasts((prev) => {
        const trimmed = prev.length >= 3 ? prev.slice(1) : prev;

        if (prev.length >= 3) {
          const removedToast = prev[0];
          clearTimers(removedToast.id);
        }

        return [...trimmed, { id, message, variant, isLeaving: false }];
      });

      scheduleAutoHide(id);
    },
    [clearTimers, scheduleAutoHide],
  );

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {isMounted &&
        createPortal(
          <div css={toastContainerStyle} role="region" aria-live="polite" aria-atomic="true">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                role="alert"
                css={[toastWrapperStyle, toast.isLeaving && toastLeavingStyle]}
              >
                <div css={[accentBarStyle, { backgroundColor: toastAccentColors[toast.variant] }]} />
                <div css={toastInnerStyle}>
                  <p css={messageStyle}>{toast.message}</p>
                  <div css={actionRowStyle}>
                    <button type="button" css={confirmButtonStyle} onClick={() => initiateExit(toast.id)}>
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

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export type { ToastVariant };
