'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useJojikQuery } from '@/api/jojik';
import { LOGIN_ROUTE } from '@/constants/routes';
import { useAuth } from '@/state/auth';

import * as styles from './page.style.css';

type PageParams = {
  jo?: string | string[];
};

export default function JojikHomePage() {
  const params = useParams<PageParams>();
  const router = useRouter();
  const jojikNanoId = Array.isArray(params?.jo) ? (params?.jo[0] ?? '') : (params?.jo ?? '');

  const { isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace(LOGIN_ROUTE);
    }
  }, [isAuthenticated, isReady, router]);

  const { data: jojik } = useJojikQuery(jojikNanoId, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <h1 className={styles.title}>다시 오신 것을 환영합니다</h1>
        <p className={styles.subtitle}>{jojik ? jojik.name : ''}의 새로운 소식을 확인해 보세요.</p>
      </section>
    </div>
  );
}
