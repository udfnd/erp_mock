'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import ErpLayout from '@/components/layout/ErpLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ErpProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/td/g');
  const auth = useAuthGuard({ disabled: isAuthRoute });

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (!auth.isReady || !auth.isAuthenticated) {
    return null;
  }

  return <ErpLayout>{children}</ErpLayout>;
}
