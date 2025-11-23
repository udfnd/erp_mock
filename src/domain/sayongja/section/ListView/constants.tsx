import { createColumnHelper, type SortingState } from '@tanstack/react-table';

import type { SayongjaListItem } from '@/domain/sayongja/api';

export const columnHelper = createColumnHelper<SayongjaListItem>();

export const SORT_OPTIONS = [
  { label: '최근 입사 순', value: 'employedAtDesc' },
  { label: '오래된 입사 순', value: 'employedAtAsc' },
  { label: '이름 오름차순', value: 'nameAsc' },
  { label: '이름 내림차순', value: 'nameDesc' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const IS_HWALSEONG_FILTER_OPTIONS = [
  { label: '전체 상태', value: 'all' },
  { label: '활성', value: 'hwalseong' },
  { label: '비활성', value: 'bihwalseong' },
];

export const JOJIK_FILTER_OPTIONS = [
  { label: '전체 조직', value: 'all' },
];

export const EMPLOYMENT_CATEGORY_FILTER_OPTIONS = [
  { label: '전체 고용 구분', value: 'all' },
];

export const WORK_TYPE_FILTER_OPTIONS = [
  { label: '전체 근무 형태', value: 'all' },
];

export const getSortStateFromOption = (option: string | undefined): SortingState => {
  switch (option) {
    case 'employedAtDesc':
      return [{ id: 'employedAt', desc: true }];
    case 'employedAtAsc':
      return [{ id: 'employedAt', desc: false }];
    case 'nameDesc':
      return [{ id: 'name', desc: true }];
    case 'nameAsc':
    default:
      return [{ id: 'name', desc: false }];
  }
};

export const getSortOptionFromState = (sorting: SortingState): string | undefined => {
  const current = sorting[0];
  if (!current) return undefined;

  if (current.id === 'employedAt') {
    return current.desc ? 'employedAtDesc' : 'employedAtAsc';
  }

  if (current.id === 'name') {
    return current.desc ? 'nameDesc' : 'nameAsc';
  }

  return undefined;
};
