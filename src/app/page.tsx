'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LOGIN_ROUTE, createGigwanHomeRoute } from '@/constants/routes';
import { useAuth } from '@/state/auth';

import * as styles from './page.style.css';

export default function Page() {
  const router = useRouter();
  const {
    isReady,
    isAuthenticated,
    state: { gigwanNanoId },
  } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    if (isAuthenticated && gigwanNanoId) {
      router.replace(createGigwanHomeRoute(gigwanNanoId));
    } else {
      router.replace(LOGIN_ROUTE);
    }
  }, [isReady, isAuthenticated, gigwanNanoId, router]);

  return <div className={styles.redirectPlaceholder}>이동 중...</div>;
}
