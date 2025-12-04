import { createColumnHelper, type HeaderContext, type SortingState } from '@tanstack/react-table';

import type { JojikMunuiListItem } from '../../api';

export const columnHelper = createColumnHelper<JojikMunuiListItem>();

export const SORT_OPTIONS = [
  { label: '제목 오름차순', value: 'titleAsc' },
  { label: '제목 내림차순', value: 'titleDesc' },
  { label: '문의 일시 오름차순', value: 'createdAtAsc' },
  { label: '문의 일시 내림차순', value: 'createdAtDesc' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const formatDate = (value: string | null) => {
  if (!value) return '-';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
};

export const getSortStateFromOption = (option: string | undefined): SortingState => {
  switch (option) {
    case 'titleAsc':
      return [{ id: 'title', desc: false }];
    case 'titleDesc':
      return [{ id: 'title', desc: true }];
    case 'createdAtAsc':
      return [{ id: 'createdAt', desc: false }];
    case 'createdAtDesc':
      return [{ id: 'createdAt', desc: true }];
    default:
      return [];
  }
};

export const getSortOptionFromState = (sorting: SortingState): string | undefined => {
  const current = sorting[0];
  if (!current) return undefined;

  if (current.id === 'title') {
    return current.desc ? 'titleDesc' : 'titleAsc';
  }

  if (current.id === 'createdAt') {
    return current.desc ? 'createdAtDesc' : 'createdAtAsc';
  }

  return undefined;
};

export const createSortableHeader = (label: string) => {
  const Header = (_: HeaderContext<JojikMunuiListItem, unknown>) => <span>{label}</span>;
  Header.displayName = `Header(${label})`;
  return Header;
};
