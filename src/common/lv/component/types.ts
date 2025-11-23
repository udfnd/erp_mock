'use client';

import type { ColumnDef, Row, Table } from '@tanstack/react-table';
import type React from 'react';

import type { ListViewState } from '@/common/lv';

export type ListViewSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocusChange?: (focused: boolean) => void;
};

export type ListViewFilter = {
  key: string;
  label?: string;
  value: string[];
  defaultValue?: string[];
  options: { label: string; value: string }[];
  onChange: (value: string[]) => void;
};

export type ListViewSortProps = {
  label?: string;
  value: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

export type ListViewPrimaryActionProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export type ListViewToolbarProps = {
  search: ListViewSearchProps;
  filters: ListViewFilter[];
  sort: ListViewSortProps;
  totalCount: number;
  primaryAction?: ListViewPrimaryActionProps;
  onSearchFocusChange?: (focused: boolean) => void;
};

export type ListViewTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  state: ListViewState<TData>;
  manualPagination?: boolean;
  manualSorting?: boolean;
  pageCount: number;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  isDimmed?: boolean;
  rowEventHandlers?: {
    selectOnClick?: boolean;
    shouldIgnoreRowClick?: (event: React.MouseEvent<HTMLElement>) => boolean;
    onClick?: (args: { row: Row<TData>; event: React.MouseEvent<HTMLTableRowElement>; table: Table<TData> }) => void;
  };
  onSelectedRowsChange?: (rows: Row<TData>[]) => void;
  onDimmerClick?: () => void;
};

export type ListViewPaginationProps = {
  table: Table<unknown>;
};
