'use client';

import { css } from '@emotion/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/global/auth';

const container = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
  flexDirection: 'column',
  gap: '8px',
  color: '#4E5670',
});

export default function HomePage() {
  const router = useRouter();
  const { isReady, isAuthenticated, state } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    if (isAuthenticated) {
      if (state.gigwanNanoId) {
        router.replace(`/td/np/gis/${state.gigwanNanoId}/manage/home/dv`);
      } else {
        router.replace('/td/np/gis');
      }
    } else {
      router.replace('/td/g');
    }
  }, [isAuthenticated, isReady, router, state.gigwanNanoId]);

  return (
    <div css={container}>
      <p>페이지 이동 중입니다..</p>
    </div>
  );
}
