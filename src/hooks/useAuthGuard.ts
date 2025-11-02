'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LOGIN_ROUTE } from '@/constants/routes';
import { useAuth } from '@/state/auth';

type UseAuthGuardOptions = {
  redirectTo?: string;
  disabled?: boolean;
};

export const useAuthGuard = (options?: UseAuthGuardOptions) => {
  const { redirectTo = LOGIN_ROUTE, disabled = false } = options ?? {};
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (disabled) return;
    if (!auth.isReady) return;
    if (!auth.isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [auth.isAuthenticated, auth.isReady, disabled, redirectTo, router]);

  return auth;
};
