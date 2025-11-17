import { createColumnHelper, type HeaderContext, type SortingState } from '@tanstack/react-table';

import type { SayongjaListItem } from '@/domain/sayongja/api';

export const columnHelper = createColumnHelper<SayongjaListItem>();

export const SORT_OPTIONS = [
  { label: '이름 오름차순', value: 'nameAsc' },
  { label: '이름 내림차순', value: 'nameDesc' },
  { label: '입사일 오름차순', value: 'employedAtAsc' },
  { label: '입사일 내림차순', value: 'employedAtDesc' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const IS_HWALSEONG_FILTER_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '활성', value: 'true' },
  { label: '비활성', value: 'false' },
];

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
    case 'nameAsc':
      return [{ id: 'name', desc: false }];
    case 'nameDesc':
      return [{ id: 'name', desc: true }];
    case 'employedAtAsc':
      return [{ id: 'employedAt', desc: false }];
    case 'employedAtDesc':
      return [{ id: 'employedAt', desc: true }];
    default:
      return [];
  }
};

export const getSortOptionFromState = (sorting: SortingState): string | undefined => {
  const current = sorting[0];
  if (!current) return undefined;

  if (current.id === 'name') {
    return current.desc ? 'nameDesc' : 'nameAsc';
  }

  if (current.id === 'employedAt') {
    return current.desc ? 'employedAtDesc' : 'employedAtAsc';
  }

  return undefined;
};

export const createSortableHeader = (label: string) => {
  const Header = (_: HeaderContext<SayongjaListItem, unknown>) => <span>{label}</span>;
  Header.displayName = `Header(${label})`;
  return Header;
};
