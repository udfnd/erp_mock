'use client';

import { useParams } from 'next/navigation';

import { useGigwanNameQuery } from '@/domain/gigwan/api';
import { useAuth } from '@/global/auth';

import * as styles from './style';

type PageParams = {
  gi?: string | string[];
};

export default function GigwanHomePage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');

  const { isAuthenticated } = useAuth();

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
