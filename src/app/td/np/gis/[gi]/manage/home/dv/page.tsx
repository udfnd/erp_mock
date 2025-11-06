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
    <div css={styles.page}>
      <section css={styles.header}>
        <h1 css={styles.title}>다시 오신 것을 환영합니다</h1>
        <p css={styles.subtitle}>{gigwan ? gigwan.name : ''}의 새로운 소식을 확인해 보세요.</p>
      </section>
    </div>
  );
}
