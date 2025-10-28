'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
      router.replace(`/td/np/gis/${gigwanNanoId}/manage/home/dv`);
    } else {
      router.replace('/td/g');
    }
  }, [isReady, isAuthenticated, gigwanNanoId, router]);

  return <div className={styles.redirectPlaceholder}>이동 중...</div>;
}
