'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getAccessToken } from '@/api';

export const useRequireAuth = (redirectTo: string = '/td/g') => {
  const router = useRouter();

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);
};
