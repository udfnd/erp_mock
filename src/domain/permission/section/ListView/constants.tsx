import { createColumnHelper } from '@tanstack/react-table';

import type { Permission } from '@/domain/permission/api';

export const columnHelper = createColumnHelper<Permission>();

export const SORT_OPTIONS = [
  { label: '이름 오름차순', value: 'nameAsc' },
  { label: '이름 내림차순', value: 'nameDesc' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function getSortStateFromOption(option?: string) {
  switch (option) {
    case 'nameDesc':
      return [{ id: 'name', desc: true }];
    case 'nameAsc':
    default:
      return [{ id: 'name', desc: false }];
  }
}

export function getSortOptionFromState(
  sorting: { id: string; desc: boolean }[] | undefined,
): string | undefined {
  if (!sorting || sorting.length === 0) return undefined;
  const [first] = sorting;
  if (first.id === 'name') {
    return first.desc ? 'nameDesc' : 'nameAsc';
  }
  return undefined;
}
