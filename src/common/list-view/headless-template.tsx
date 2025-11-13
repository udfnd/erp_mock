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
    options.initialPagination ?? { pageIndex: 0, pageSize: 10 },
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

export type ListViewHeadlessTemplateProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  state: ListViewHeadlessState<TData>;
  children: (context: ListViewHeadlessRenderProps<TData>) => ReactNode;
  manualPagination?: boolean;
  manualSorting?: boolean;
  pageCount?: number;
  getRowId?: TableOptions<TData>['getRowId'];
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  enableMultiRowSelection?: boolean;
  meta?: TableOptions<TData>['meta'];
  debugTable?: boolean;
  debugHeaders?: boolean;
  debugColumns?: boolean;
  autoResetPageIndex?: boolean;
  autoResetExpanded?: boolean;
};

export type ListViewHeadlessRenderProps<TData> = {
  table: Table<TData>;
  state: {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    rowSelection: RowSelectionState;
    pagination: PaginationState;
  };
  setState: {
    setSorting: OnChangeFn<SortingState>;
    setColumnFilters: OnChangeFn<ColumnFiltersState>;
    setRowSelection: OnChangeFn<RowSelectionState>;
    setPagination: OnChangeFn<PaginationState>;
  };
  selectedFlatRows: Row<TData>[];
};

export function ListViewHeadlessTemplate<TData>({
  data,
  columns,
  state,
  children,
  manualPagination,
  manualSorting,
  pageCount,
  getRowId,
  enableRowSelection,
  enableMultiRowSelection,
  meta,
  debugTable,
  debugHeaders,
  debugColumns,
  autoResetPageIndex,
  autoResetExpanded,
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
    manualPagination,
    manualSorting,
    pageCount,
    getRowId,
    enableRowSelection,
    enableMultiRowSelection,
    meta,
    debugTable,
    debugHeaders,
    debugColumns,
    autoResetPageIndex,
    autoResetExpanded,
  });

  return (
    <>
      {children({
        table,
        state: {
          sorting: state.sorting,
          columnFilters: state.columnFilters,
          rowSelection: state.rowSelection,
          pagination: state.pagination,
        },
        setState: {
          setSorting: state.setSorting,
          setColumnFilters: state.setColumnFilters,
          setRowSelection: state.setRowSelection,
          setPagination: state.setPagination,
        },
        selectedFlatRows: table.getSelectedRowModel().flatRows,
      })}
    </>
  );
}
