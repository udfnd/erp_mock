'use client';

import { useParams } from 'next/navigation';

import { JojiksLv } from '@/domain/jojik/section';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanJojikListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');

  return <JojiksLv gigwanNanoId={gigwanNanoId} />;
}
