'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getGigwan } from '@/api/gigwan';
import HomeIcon from '@/components/icons/Home';
import { useRequireAuth } from '@/hooks/useRequireAuth';

import * as styles from './page.style.css';

export default function GigwanManageHomePage() {
  useRequireAuth();

  const params = useParams<{ gi: string }>();
  const gi = params?.gi;
  const [gigwanName, setGigwanName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!gi) return;

    let isMounted = true;
    const fetchGigwan = async () => {
      try {
        const gigwan = await getGigwan(gi);
        if (isMounted) {
          setGigwanName(gigwan.name);
        }
      } catch (err) {
        if (isMounted) {
          setError('기관 정보를 불러올 수 없습니다.');
        }
      }
    };

    fetchGigwan();

    return () => {
      isMounted = false;
    };
  }, [gi]);

  return (
    <section className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.iconWrapper}>
          <HomeIcon width={40} height={40} />
        </div>
        <div>
          <h1 className={styles.title}>{gigwanName ? `${gigwanName} 홈` : '기관 홈'}</h1>
          <p className={styles.subtitle}>기관 관리를 위한 대시보드를 준비하고 있습니다.</p>
        </div>
      </div>
      <p className={styles.content}>
        {error
          ? `${error} 새로고침 후 다시 시도해주세요.`
          : '환영합니다! 곧 더 많은 정보를 이곳에서 확인하실 수 있습니다.'}
      </p>
    </section>
  );
}
