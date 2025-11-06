'use client';

import { useParams } from 'next/navigation';

import { useJojikQuery } from '@/domain/jojik/api';
import { useAuth } from '@/global/auth';

import * as styles from './style';

type PageParams = {
  jo?: string | string[];
};

export default function JojikHomePage() {
  const params = useParams<PageParams>();
  const jojikNanoId = Array.isArray(params?.jo) ? (params?.jo[0] ?? '') : (params?.jo ?? '');

  const { isAuthenticated } = useAuth();

  const { data: jojik } = useJojikQuery(jojikNanoId, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  return (
    <div css={styles.page}>
      <section css={styles.header}>
        <h1 css={styles.title}>다시 오신 것을 환영합니다</h1>
        <p css={styles.subtitle}>{jojik ? jojik.name : ''}의 새로운 소식을 확인해 보세요.</p>
      </section>
    </div>
  );
}
