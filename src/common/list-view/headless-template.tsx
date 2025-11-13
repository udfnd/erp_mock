// headless-template.tsx
'use client';

import { useCallback, useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table,
  type TableOptions,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 };

export type ListViewHeadlessState<TData> = {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
};

export type UseListViewHeadlessStateOptions = {
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialRowSelection?: RowSelectionState;
  initialPagination?: PaginationState;
};

export function useListViewHeadlessState<TData>(
  options: UseListViewHeadlessStateOptions = {},
): ListViewHeadlessState<TData> {
  const [sortingState, setSortingState] = useState<SortingState>(options.initialSorting ?? []);
  const [columnFiltersState, setColumnFiltersState] = useState<ColumnFiltersState>(
    options.initialColumnFilters ?? [],
  );
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>(
    options.initialRowSelection ?? {},
  );
  const [paginationState, setPaginationState] = useState<PaginationState>(
    options.initialPagination ?? DEFAULT_PAGINATION,
  );

  const setSorting = useCallback<OnChangeFn<SortingState>>((updater) => {
    setSortingState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const setColumnFilters = useCallback<OnChangeFn<ColumnFiltersState>>((updater) => {
    setColumnFiltersState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const setRowSelection = useCallback<OnChangeFn<RowSelectionState>>((updater) => {
    setRowSelectionState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const setPagination = useCallback<OnChangeFn<PaginationState>>((updater) => {
    setPaginationState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  return {
    sorting: sortingState,
    setSorting,
    columnFilters: columnFiltersState,
    setColumnFilters,
    rowSelection: rowSelectionState,
    setRowSelection,
    pagination: paginationState,
    setPagination,
  };
}

// 템플릿 내부에서 직접 관리하는 필드를 제외한 나머지 TableOptions를 한 번에 받기 위함
type ListViewTableOptions<TData> = Omit<
  TableOptions<TData>,
  | 'data'
  | 'columns'
  | 'state'
  | 'getCoreRowModel'
  | 'getFilteredRowModel'
  | 'getSortedRowModel'
  | 'getPaginationRowModel'
  | 'onSortingChange'
  | 'onColumnFiltersChange'
  | 'onRowSelectionChange'
  | 'onPaginationChange'
>;

export type ListViewHeadlessRenderProps<TData> = {
  table: Table<TData>;
  headlessState: ListViewHeadlessState<TData>;
  selectedFlatRows: Row<TData>[];
};

export type ListViewHeadlessTemplateProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  state: ListViewHeadlessState<TData>;
  children: (context: ListViewHeadlessRenderProps<TData>) => ReactNode;
} & ListViewTableOptions<TData>;

export function ListViewHeadlessTemplate<TData>({
                                                  data,
                                                  columns,
                                                  state,
                                                  children,
                                                  ...tableOptions
                                                }: ListViewHeadlessTemplateProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      rowSelection: state.rowSelection,
      pagination: state.pagination,
    },
    onSortingChange: state.setSorting,
    onColumnFiltersChange: state.setColumnFilters,
    onRowSelectionChange: state.setRowSelection,
    onPaginationChange: state.setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...tableOptions,
  });

  return children({
    table,
    headlessState: state,
    selectedFlatRows: table.getSelectedRowModel().flatRows,
  });
}
