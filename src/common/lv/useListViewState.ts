'use client';

import { useCallback, useState } from 'react';

import {
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 20 };

export type ListViewState<TData> = {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
};

export type UseListViewStateOptions = {
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialRowSelection?: RowSelectionState;
  initialPagination?: PaginationState;
};

export function useListViewState<TData>(
  options: UseListViewStateOptions = {},
): ListViewState<TData> {
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
