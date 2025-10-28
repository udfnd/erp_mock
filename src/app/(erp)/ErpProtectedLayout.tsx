'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import ErpLayout from '@/components/layout/ErpLayout';
import { useAuth } from '@/state/auth/AuthContext';

export default function ErpProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace('/enter-code');
    }
  }, [isAuthenticated, isReady, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <ErpLayout>{children}</ErpLayout>;
}

