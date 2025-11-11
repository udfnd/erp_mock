'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useJojikQuery } from '@/domain/jojik/api';
import { useAuth } from '@/global/auth';
import { TertiaryNav } from '@/global/navigation';
import { getTertiaryNavItems } from '@/global/navigation/nav.data';

import { cssObj } from './style';

type PageParams = {
  jo?: string | string[];
};

const PLACEHOLDER = 'https://placehold.co/160x160.png';
const JOJIK_MANAGE_TERTIARY_ITEMS = getTertiaryNavItems('/td/np/jos', '/td/np/jos/[jo]/manage');

export default function JojikHomePage() {
  const params = useParams<PageParams>();
  const jojikNanoId = Array.isArray(params?.jo) ? (params?.jo[0] ?? '') : (params?.jo ?? '');

  const { isAuthenticated } = useAuth();

  const { data: jojik } = useJojikQuery(jojikNanoId, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  return (
    <>
      <TertiaryNav navItems={JOJIK_MANAGE_TERTIARY_ITEMS} />
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
          <p css={cssObj.subtitle}>{jojik ? jojik.name : ''}의 새로운 소식을 확인해 보세요.</p>
        </section>
      </div>
    </>
  );
}
