'use client';

import { css } from '@emotion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useAuth, useIsAuthenticated, useActiveUserMeta } from '@/global/auth';

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

  const isReady = useAuth((s) => s.isReady);
  const isAuthenticated = useIsAuthenticated();
  const activeMeta = useActiveUserMeta();
  const gigwanNanoId = useMemo(() => activeMeta?.gigwanNanoId ?? null, [activeMeta]);

  useEffect(() => {
    if (!isReady) return;

    if (isAuthenticated) {
      if (gigwanNanoId) {
        router.replace(`/td/np/gis/${gigwanNanoId}/manage/home/dv`);
      } else {
        router.replace('/td/np/gis');
      }
    } else {
      router.replace('/td/g');
    }
  }, [isReady, isAuthenticated, gigwanNanoId, router]);

  return (
    <div css={container}>
      <p>페이지 이동 중입니다..</p>
    </div>
  );
}
