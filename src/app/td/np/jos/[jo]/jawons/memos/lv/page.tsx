'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';

type PageParams = { jo?: string | string[] };

const extractJojikNanoId = (value: PageParams['jo']): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};

type PlaceholderProps = {
  jojikNanoId: string;
};

const PlaceholderPanel = ({ jojikNanoId }: PlaceholderProps) => (
  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <h2 style={{ margin: 0 }}>메모 기능이 준비 중입니다</h2>
    <p style={{ margin: 0, lineHeight: 1.5 }}>
      {jojikNanoId
        ? `조직 (${jojikNanoId}) 의 자원 메모 목록은 곧 제공될 예정입니다.`
        : '조직을 선택하면 메모 목록을 확인할 수 있습니다.'}
    </p>
  </div>
);

export default function NpJojikJawonMemoListViewPage() {
  const params = useParams<PageParams>();
  const jojikNanoId = extractJojikNanoId(params?.jo);

  const pageKey = useMemo(() => jojikNanoId || 'no-jo', [jojikNanoId]);

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={[]}
      NoneSelectedComponent={PlaceholderPanel}
      rightPanelProps={{ jojikNanoId }}
    >
      <p style={{ margin: 0 }}>메모 페이지 제작중</p>
    </ListViewLayout>
  );
}
