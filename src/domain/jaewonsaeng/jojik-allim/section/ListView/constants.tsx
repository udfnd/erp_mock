import { createColumnHelper, type HeaderContext, type SortingState } from '@tanstack/react-table';

import type { JojikAllimListItem } from '../../api';

export const columnHelper = createColumnHelper<JojikAllimListItem>();

export const SORT_OPTIONS = [
  { label: '알림 생성 시간 오름차순', value: 'createdAtAsc' },
  { label: '알림 생성 시간 내림차순', value: 'createdAtDesc' },
];

export const formatDate = (value: string | null) => {
  if (!value) return '-';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const hour = String(parsed.getHours()).padStart(2, '0');
  const minute = String(parsed.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hour}:${minute}`;
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
  const Header = (_: HeaderContext<JojikAllimListItem, unknown>) => <span>{label}</span>;
  Header.displayName = `Header(${label})`;
  return Header;
};

export const getBalsinSootan = (item: JojikAllimListItem): string => {
  const methods: string[] = [];
  if (item.hadaBalsinSangtae) methods.push('HADA');
  if (item.smsBalsinSangtae) methods.push('SMS');
  if (item.kakaoBalsinSangtae) methods.push('카카오톡');
  if (item.emailBalsinSangtae) methods.push('이메일');
  return methods.length > 0 ? methods.join(', ') : '-';
};
