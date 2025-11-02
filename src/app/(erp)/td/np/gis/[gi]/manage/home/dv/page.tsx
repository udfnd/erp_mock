'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useGigwanNameQuery } from '@/api/gigwan';
import { LOGIN_ROUTE, createGigwanHomeRoute } from '@/constants/routes';
import { useAuth } from '@/state/auth';

import * as styles from './page.style.css';

type PageParams = {
  gi?: string | string[];
};

export default function GigwanHomePage() {
  const params = useParams<PageParams>();
  const router = useRouter();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');

  const { state, isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace(LOGIN_ROUTE);
      return;
    }
    if (state.gigwanNanoId && state.gigwanNanoId !== gigwanNanoId) {
      router.replace(createGigwanHomeRoute(state.gigwanNanoId));
    }
  }, [gigwanNanoId, isAuthenticated, isReady, router, state.gigwanNanoId]);

  const { data: gigwan } = useGigwanNameQuery(gigwanNanoId, {
    enabled: isAuthenticated && Boolean(gigwanNanoId),
  });

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <h1 className={styles.title}>다시 오신 것을 환영합니다</h1>
        <p className={styles.subtitle}>
          {gigwan ? gigwan.name : ''}의 새로운 소식을 확인해 보세요.
        </p>
      </section>
    </div>
  );
}
