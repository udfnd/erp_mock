'use client';

import { useParams } from 'next/navigation';

import { SayongjasLv } from '@/domain/sayongja/section';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanSayongjaListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');

  return <SayongjasLv gigwanNanoId={gigwanNanoId} />;
}
