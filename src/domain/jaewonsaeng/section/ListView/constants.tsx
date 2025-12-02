import { createColumnHelper, type HeaderContext, type SortingState } from '@tanstack/react-table';

import type { JaewonsaengListItem } from '@/domain/jaewonsaeng/api';

export const columnHelper = createColumnHelper<JaewonsaengListItem>();

export const SORT_OPTIONS = [
  { label: '이름 오름차순', value: 'nameAsc' },
  { label: '이름 내림차순', value: 'nameDesc' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const getSortStateFromOption = (option: string | undefined): SortingState => {
  switch (option) {
    case 'nameAsc':
      return [{ id: 'name', desc: false }];
    case 'nameDesc':
      return [{ id: 'name', desc: true }];
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

  return undefined;
};

export const createSortableHeader = (label: string) => {
  const Header = (_: HeaderContext<JaewonsaengListItem, unknown>) => <span>{label}</span>;
  Header.displayName = `Header(${label})`;
  return Header;
};
