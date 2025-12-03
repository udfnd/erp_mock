import dayjs from 'dayjs';
import { createColumnHelper } from '@tanstack/react-table';

import type { JaewonSincheongListItem } from '@/domain/jaewon-sincheong/api';

export const SORT_OPTIONS = [
  { label: '최신 신청순', value: 'createdAtDesc' },
  { label: '오래된 신청순', value: 'createdAtAsc' },
  { label: '이름 오름차순', value: 'nameAsc' },
  { label: '이름 내림차순', value: 'nameDesc' },
];

export const columnHelper = createColumnHelper<JaewonSincheongListItem>();

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
    case 'nameDesc':
      return [{ id: 'name', desc: true }];
    case 'nameAsc':
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
  if (first.id === 'name') return first.desc ? 'nameDesc' : 'nameAsc';
  return undefined;
};
