'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/state/auth';

type UseAuthGuardOptions = {
  redirectTo?: string;
  disabled?: boolean;
};

export const useAuthGuard = (options?: UseAuthGuardOptions) => {
  const { redirectTo = '/td/g', disabled = false } = options ?? {};
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
