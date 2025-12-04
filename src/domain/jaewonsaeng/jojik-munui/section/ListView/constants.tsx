import dayjs from 'dayjs';
import { createColumnHelper } from '@tanstack/react-table';

import type { JojikMunuiListItem } from '@/domain/jaewonsaeng/jojik-munui/api';

export const SORT_OPTIONS = [
  { label: '최신 문의순', value: 'createdAtDesc' },
  { label: '오래된 문의순', value: 'createdAtAsc' },
  { label: '재원생 이름 오름차순', value: 'jaewonsaengNameAsc' },
  { label: '재원생 이름 내림차순', value: 'jaewonsaengNameDesc' },
];

export const columnHelper = createColumnHelper<JojikMunuiListItem>();

export const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const parsed = dayjs(value);
  if (!parsed.isValid()) return value;
  return parsed.format('YYYY.MM.DD HH:mm');
};

export const getSortStateFromOption = (value?: string) => {
  switch (value) {
    case 'createdAtAsc':
      return [{ id: 'createdAt', desc: false }];
    case 'createdAtDesc':
      return [{ id: 'createdAt', desc: true }];
    case 'jaewonsaengNameDesc':
      return [{ id: 'jaewonsaengName', desc: true }];
    case 'jaewonsaengNameAsc':
    default:
      return value ? [{ id: value.replace(/(Asc|Desc)$/i, ''), desc: value.endsWith('Desc') }] : [];
  }
};

export const getSortOptionFromState = (
  sorting: { id: string; desc: boolean }[] | undefined,
): string | undefined => {
  if (!sorting?.length) return undefined;
  const [first] = sorting;
  if (first.id === 'createdAt') return first.desc ? 'createdAtDesc' : 'createdAtAsc';
  if (first.id === 'jaewonsaengName') return first.desc ? 'jaewonsaengNameDesc' : 'jaewonsaengNameAsc';
  return undefined;
};
