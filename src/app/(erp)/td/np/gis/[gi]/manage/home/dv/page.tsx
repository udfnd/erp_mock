'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useGigwanQuery } from '@/api/gigwan';
import { Home as HomeIcon } from '@/components/icons';
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
      router.replace('/td/g');
      return;
    }
    if (state.gigwanNanoId && state.gigwanNanoId !== gigwanNanoId) {
      router.replace(`/td/np/gis/${state.gigwanNanoId}/manage/home/dv`);
    }
  }, [gigwanNanoId, isAuthenticated, isReady, router, state.gigwanNanoId]);

  const { data: gigwan } = useGigwanQuery(gigwanNanoId, {
    enabled: isAuthenticated && Boolean(gigwanNanoId),
  });

  const heroTitle = gigwan
    ? `${gigwan.name}에 오신 것을 환영합니다.`
    : '기관 정보를 불러오는 중입니다.';
  const heroDescription = gigwan
    ? `기관 코드 ${gigwanNanoId}에 로그인한 관리자 화면입니다.`
    : '잠시만 기다려 주세요.';

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <h1 className={styles.title}>기관 홈</h1>
        <p className={styles.subtitle}>환영합니다! 기관 운영을 위한 첫 페이지입니다.</p>
      </section>
      <section className={styles.hero}>
        <div className={styles.heroIcon}>
          <HomeIcon width={28} height={28} />
        </div>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>{heroTitle}</h2>
          <p className={styles.heroDescription}>{heroDescription}</p>
        </div>
      </section>
    </div>
  );
}
