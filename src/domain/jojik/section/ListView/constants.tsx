import { createColumnHelper, type HeaderContext, type SortingState } from '@tanstack/react-table';

import type { JojikListItem } from '@/domain/jojik/api/jojik.schema';

export type CreatedAtFilterValue = 'all' | '7' | '30';

export const columnHelper = createColumnHelper<JojikListItem>();

export const CREATED_AT_FILTER_OPTIONS: { label: string; value: CreatedAtFilterValue }[] = [
  { label: '전체 기간', value: 'all' },
  { label: '최근 7일', value: '7' },
  { label: '최근 30일', value: '30' },
];

export const SORT_OPTIONS = [
  { label: '최근 생성 순', value: 'createdAtDesc' },
  { label: '오래된 순', value: 'createdAtAsc' },
  { label: '이름 오름차순', value: 'nameAsc' },
  { label: '이름 내림차순', value: 'nameDesc' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const CREATED_AT_FILTER_NOW = Date.now();

export const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsed);
};

export const getSortStateFromOption = (option: string | undefined): SortingState => {
  switch (option) {
    case 'createdAtDesc':
      return [{ id: 'createdAt', desc: true }];
    case 'createdAtAsc':
      return [{ id: 'createdAt', desc: false }];
    case 'nameDesc':
      return [{ id: 'name', desc: true }];
    case 'nameAsc':
      return [{ id: 'name', desc: false }];
    default:
      return [];
  }
};

export const getSortOptionFromState = (sorting: SortingState): string | undefined => {
  const current = sorting[0];
  if (!current) {
    return undefined;
  }

  if (current.id === 'createdAt') {
    return current.desc ? 'createdAtDesc' : 'createdAtAsc';
  }

  if (current.id === 'name') {
    return current.desc ? 'nameDesc' : 'nameAsc';
  }

  return undefined;
};

export const createSortableHeader = (label: string) => {
  const Header = (_: HeaderContext<JojikListItem, unknown>) => <span>{label}</span>;

  Header.displayName = `Header(${label})`;

  return Header;
};
