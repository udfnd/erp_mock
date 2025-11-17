import { createColumnHelper, type SortingState } from '@tanstack/react-table';

import type { JusoListItem } from '@/domain/juso/api';

export const columnHelper = createColumnHelper<JusoListItem>();

export const SORT_OPTIONS = [
  { label: '이름 오름차순', value: 'nameAsc' },
  { label: '이름 내림차순', value: 'nameDesc' },
  { label: '생성일 오름차순', value: 'createdAtAsc' },
  { label: '생성일 내림차순', value: 'createdAtDesc' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const formatDate = (value: string) => {
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
    case 'createdAtDesc':
      return [{ id: 'createdAt', desc: true }];
    case 'createdAtAsc':
      return [{ id: 'createdAt', desc: false }];
    case 'nameDesc':
      return [{ id: 'jusoName', desc: true }];
    case 'nameAsc':
      return [{ id: 'jusoName', desc: false }];
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

  if (current.id === 'jusoName') {
    return current.desc ? 'nameDesc' : 'nameAsc';
  }

  return undefined;
};
