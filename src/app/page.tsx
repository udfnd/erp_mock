'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/state/auth/AuthContext';

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
      router.replace(`/td/np/gis/${gigwanNanoId}/manage/home/dv`);
    } else {
      router.replace('/enter-code');
    }
  }, [isReady, isAuthenticated, gigwanNanoId, router]);

  return <div className={styles.redirectPlaceholder}>이동 중...</div>;
}
