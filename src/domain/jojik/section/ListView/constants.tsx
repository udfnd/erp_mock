import { createColumnHelper, type HeaderContext, type SortingState } from '@tanstack/react-table';

import type { JojikListItem } from '@/domain/jojik/api/jojik.schema';

import { jojikListViewCss } from './styles';

export type CreatedAtFilterValue = 'all' | '7' | '30';

export const columnHelper = createColumnHelper<JojikListItem>();

export const CREATED_AT_FILTER_OPTIONS: { label: string; value: CreatedAtFilterValue }[] = [
  { label: '전체 기간', value: 'all' },
  { label: '최근 7일', value: '7' },
  { label: '최근 30일', value: '30' },
];

export const SORT_OPTIONS = [
  { label: '최근 생성 순', value: 'createdAt:desc' },
  { label: '오래된 순', value: 'createdAt:asc' },
  { label: '이름 오름차순', value: 'name:asc' },
  { label: '이름 내림차순', value: 'name:desc' },
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
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
};

export const getSortStateFromOption = (option: string | undefined): SortingState => {
  if (!option) {
    return [];
  }

  const [id, direction] = option.split(':');
  if (!id) {
    return [];
  }

  return [
    {
      id,
      desc: direction === 'desc',
    },
  ];
};

export const getSortOptionFromState = (sorting: SortingState): string | undefined => {
  const current = sorting[0];
  if (!current) {
    return undefined;
  }

  return `${current.id}:${current.desc ? 'desc' : 'asc'}`;
};

export const createSortableHeader = (label: string) => {
  const SortableHeader = ({ column }: HeaderContext<JojikListItem, unknown>) => (
    <button type="button" css={jojikListViewCss.sortButton} onClick={column.getToggleSortingHandler()}>
      {label}
      <span css={jojikListViewCss.sortIcon}>
        {column.getIsSorted() === 'asc' && '▲'}
        {column.getIsSorted() === 'desc' && '▼'}
        {!column.getIsSorted() && '⇅'}
      </span>
    </button>
  );

  SortableHeader.displayName = `SortableHeader(${label})`;

  return SortableHeader;
};
