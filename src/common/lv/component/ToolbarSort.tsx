'use client';

import { SortDropdown } from './SortDropdown';
import type { ListViewSortProps } from './types';

type Props = {
  sort: ListViewSortProps;
};

export function ToolbarSort({ sort }: Props) {
  return <SortDropdown sort={sort} />;
}
