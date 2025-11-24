'use client';

import { FiltersDropdown } from './FiltersDropdown';
import type { ListViewFilter } from './types';

type Props = {
  filters?: ListViewFilter[];
};

export function ToolbarFilters({ filters }: Props) {
  if (!filters?.length) return null;

  return <FiltersDropdown filters={filters} />;
}
