'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useGigwanNameQuery } from '@/domain/gigwan/api';
import { useAuth } from '@/global/auth';

import { cssObj } from './style';

type PageParams = {
  gi?: string | string[];
};

const PLACEHOLDER = 'https://placehold.co/160x160.png';

export default function GigwanHomePage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');

  const { isAuthenticated } = useAuth();

  const { data: gigwan } = useGigwanNameQuery(gigwanNanoId, {
    enabled: isAuthenticated && Boolean(gigwanNanoId),
  });

  return (
    <div css={cssObj.page}>
      <section css={cssObj.header}>
        <Image
          src={PLACEHOLDER}
          alt={'Profile Photo'}
          width={160}
          height={160}
          css={cssObj.image}
        />
        <h1 css={cssObj.title}>다시 오신 것을 환영합니다</h1>
        <p css={cssObj.subtitle}>{gigwan ? gigwan.name : ''}의 새로운 소식을 확인해 보세요.</p>
      </section>
    </div>
  );
}
