'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

import { getAccessToken } from '@/api';
import { refreshAccessToken } from '@/api/auth';

const PUBLIC_PATH_PATTERNS = [
  /^\/td\/g(?:\/?$|\/[A-Za-z0-9_-]+\/login\/?$)/,
];

function AuthRedirector() {
  const pathname = usePathname();
  const router = useRouter();
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    if (!pathname) return;

    const isPublic = PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
    if (isPublic) {
      isRefreshingRef.current = false;
      return;
    }

    if (getAccessToken()) {
      isRefreshingRef.current = false;
      return;
    }

    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    let cancelled = false;

    const ensureAuthenticated = async () => {
      try {
        await refreshAccessToken();
        if (cancelled) return;
        if (!getAccessToken()) {
          router.replace('/td/g');
        }
      } catch (error) {
        if (!cancelled) {
          router.replace('/td/g');
        }
      } finally {
        if (!cancelled) {
          isRefreshingRef.current = false;
        }
      }
    };

    ensureAuthenticated();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthRedirector />
      {children}
    </>
  );
}
