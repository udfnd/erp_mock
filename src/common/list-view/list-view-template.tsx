'use client';

import { useEffect, useState } from 'react';
import {
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type Table,
  type TableOptions,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { MouseEvent, ReactNode } from 'react';

import { Checkbox, type ButtonProps } from '@/common/components';
import {
  ArrowMdLeftDouble,
  ArrowMdLeftSingle,
  ArrowMdRightDouble,
  ArrowMdRightSingle,
  Plus,
  Search,
} from '@/common/icons';

import { cssObj } from './style';
import type { ListViewState } from './useListViewState';
import { color } from '@/style';

const DEFAULT_ROW_CLICK_IGNORE_SELECTOR = 'button, a, label, input, select, textarea';

export type ListViewTableOptions<TData> = Omit<
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

export type ListViewTemplateToolbarFilter = {
  key: string;
  label?: string;
  value: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

export type ListViewTemplateToolbarSort = {
  label?: string;
  value: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

export type ListViewTemplateSearch = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export type ListViewTemplatePrimaryAction = {
  label: ReactNode;
} & Omit<ButtonProps, 'children'>;

export type ListViewTemplateRenderContext<TData> = {
  table: Table<TData>;
  selectedRows: Row<TData>[];
};

export type ListViewTemplateRowEventHandlers<TData> = {
  selectOnClick?: boolean;
  shouldIgnoreRowClick?: (event: MouseEvent<HTMLElement>) => boolean;
  onClick?: (args: {
    row: Row<TData>;
    event: MouseEvent<HTMLTableRowElement>;
    table: Table<TData>;
  }) => void;
};

export type ListViewTemplateProps<TData> = {
  title?: string;
  description?: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  state: ListViewState<TData>;
  search?: ListViewTemplateSearch;
  filters?: ListViewTemplateToolbarFilter[];
  sort?: ListViewTemplateToolbarSort;
  toolbarActions?: ReactNode | ((context: ListViewTemplateRenderContext<TData>) => ReactNode);
  primaryAction?: ListViewTemplatePrimaryAction;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  totalCount?: number;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  onSelectedRowsChange?: (rows: Row<TData>[]) => void;
  rowEventHandlers?: ListViewTemplateRowEventHandlers<TData>;
} & ListViewTableOptions<TData>;

export function ListViewTemplate<TData>({
  data,
  columns,
  state,
  search,
  filters = [],
  sort,
  toolbarActions,
  primaryAction,
  onPageSizeChange: _onPageSizeChange,
  totalCount: totalCountProp,
  isLoading = false,
  loadingMessage = '데이터를 불러오는 중입니다...',
  emptyMessage = '표시할 데이터가 없습니다.',
  onSelectedRowsChange,
  rowEventHandlers,
  ...tableOptions
}: ListViewTemplateProps<TData>) {
  const { manualPagination, manualSorting, manualFiltering, pageCount, ...restTableOptions } =
    tableOptions;

  const [paginationViewMode, setPaginationViewMode] = useState<'segment' | 'centered'>('segment');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  let primaryActionLabel: ReactNode | undefined;
  let primaryActionProps: Omit<ListViewTemplatePrimaryAction, 'label'> | undefined;
  if (primaryAction) {
    const { label, ...rest } = primaryAction;
    primaryActionLabel = label;
    primaryActionProps = rest;
  }

  const selectionColumn: ColumnDef<TData> | null =
    (tableOptions.enableRowSelection ?? false)
      ? {
          id: '__row_selection__',
          header: ({ table }) => (
            <div css={cssObj.selectionCell}>
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={
                  table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
                }
                onChange={table.getToggleAllPageRowsSelectedHandler()}
                ariaLabel="전체 행 선택"
              />
            </div>
          ),
          cell: ({ row }) => (
            <div css={cssObj.selectionCell}>
              <Checkbox
                checked={row.getIsSelected()}
                indeterminate={row.getIsSomeSelected()}
                disabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
                ariaLabel="행 선택"
              />
            </div>
          ),
          enableSorting: false,
          enableColumnFilter: false,
          enableHiding: false,
        }
      : null;

  const effectiveColumns: ColumnDef<TData>[] = [
    ...(selectionColumn ? [selectionColumn] : []),
    ...columns,
    ...(primaryActionProps
      ? [
          {
            id: '__primary_action__',
            header: () =>
              primaryActionProps ? (
                <div css={cssObj.headerActionCell}>
                  <button css={cssObj.addElementButton} {...primaryActionProps}>
                    <>
                      {primaryActionLabel}
                      <Plus width={16} height={16} color={`${color.white}`} />
                    </>
                  </button>
                </div>
              ) : null,
            cell: () => null,
            enableSorting: false,
            enableColumnFilter: false,
          } as ColumnDef<TData>,
        ]
      : []),
  ];

  const table = useReactTable({
    data,
    columns: effectiveColumns,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      rowSelection: state.rowSelection,
      pagination: state.pagination,
    },
    onSortingChange: state.setSorting as OnChangeFn<SortingState>,
    onColumnFiltersChange: state.setColumnFilters as OnChangeFn<ColumnFiltersState>,
    onRowSelectionChange: state.setRowSelection as OnChangeFn<RowSelectionState>,
    onPaginationChange: state.setPagination as OnChangeFn<PaginationState>,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: false,
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    ...restTableOptions,
  });

  const pageSize = table.getState().pagination.pageSize || 10;

  const selectedRows = table.getSelectedRowModel().flatRows;

  useEffect(() => {
    if (onSelectedRowsChange) {
      onSelectedRowsChange(selectedRows);
    }
  }, [onSelectedRowsChange, selectedRows]);

  const toolbarActionsNode =
    typeof toolbarActions === 'function' ? toolbarActions({ table, selectedRows }) : toolbarActions;

  const sortSelectedOption = sort
    ? sort.options.find((option) => option.value === sort.value)
    : undefined;

  const sortDisplayLabel = sortSelectedOption?.label ?? sort?.placeholder ?? '정렬 기준';

  const totalCount = totalCountProp ?? table.getPrePaginationRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const isManualPagination = Boolean(manualPagination);
  const totalPages = isManualPagination
    ? Math.max(1, pageCount ?? Math.ceil(totalCount / pageSize))
    : Math.max(1, table.getPageCount() || 1);
  const visibleColumnsLength = table.getVisibleFlatColumns().length || 1;

  const hasToolbar = Boolean(search || filters.length > 0 || sort || toolbarActionsNode);

  const shouldIgnoreRowClick =
    rowEventHandlers?.shouldIgnoreRowClick ??
    ((event: MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement | null;
      return Boolean(target?.closest(DEFAULT_ROW_CLICK_IGNORE_SELECTOR));
    });

  const currentPage = pageIndex + 1;
  const blockSize = 10;
  const hasMultiBlocks = totalPages > blockSize;

  const clampPage = (page: number) => {
    if (!Number.isFinite(page)) return 1;
    if (page < 1) return 1;
    if (page > totalPages) return totalPages;
    return page;
  };

  const handleGoToPage = (page: number, viewMode: 'segment' | 'centered' = 'segment') => {
    const next = clampPage(page);
    setPaginationViewMode(viewMode);
    table.setPageIndex(next - 1);
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const canUseDoubleArrows = hasMultiBlocks;

  const getPageRange = () => {
    if (totalPages <= blockSize) {
      return { start: 1, end: totalPages };
    }

    if (paginationViewMode === 'centered') {
      let start = currentPage - 4;
      let end = currentPage + 5;

      if (start < 1) {
        const diff = 1 - start;
        start = 1;
        end = Math.min(totalPages, end + diff);
      }

      if (end > totalPages) {
        const diff = end - totalPages;
        end = totalPages;
        start = Math.max(1, start - diff);
      }

      if (end - start + 1 > blockSize) {
        end = start + blockSize - 1;
      }

      return { start, end };
    }

    const blockIndex = Math.floor((currentPage - 1) / blockSize);
    const start = blockIndex * blockSize + 1;
    const end = Math.min(start + blockSize - 1, totalPages);
    return { start, end };
  };

  const { start: blockStartPage, end: blockEndPage } = getPageRange();

  const pageNumbers: number[] = [];
  for (let p = blockStartPage; p <= blockEndPage; p += 1) {
    pageNumbers.push(p);
  }

  const hasRightMore = blockEndPage < totalPages;

  const handleClickMore = () => {
    const targetPage = clampPage(blockEndPage + 1);
    handleGoToPage(targetPage, 'centered');
  };

  return (
    <section css={cssObj.container}>
      {hasToolbar && (
        <div css={cssObj.toolbar}>
          <div css={cssObj.toolbarTopRow}>
            {search && (
              <div css={cssObj.searchBox}>
                <Search css={cssObj.searchIcon} />
                <input
                  css={cssObj.searchInput}
                  value={search.value}
                  placeholder={search.placeholder ?? '검색어를 입력하세요'}
                  onChange={(event) => search.onChange(event.target.value)}
                />
              </div>
            )}
            <div css={cssObj.toolbarControls}>
              {sort && (
                <div css={cssObj.filterDropdown}>
                  {/* 드롭다운 트리거 버튼 */}
                  <button
                    type="button"
                    css={cssObj.filterTrigger}
                    onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                  >
                    <span>{sortDisplayLabel}</span>
                    <span css={cssObj.filterTriggerCaret}>▾</span>
                  </button>

                  {isSortDropdownOpen && (
                    <div css={cssObj.filterMenu}>
                      {sort.placeholder && (
                        <button
                          type="button"
                          css={[
                            cssObj.filterOption,
                            sort.value === '' && cssObj.filterOptionActive,
                          ]}
                          onClick={() => {
                            sort.onChange('');
                            setIsSortDropdownOpen(false);
                          }}
                        >
                          {sort.placeholder}
                        </button>
                      )}

                      {sort.options.map((option) => {
                        const isActive = option.value === sort.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            css={[cssObj.filterOption, isActive && cssObj.filterOptionActive]}
                            onClick={() => {
                              sort.onChange(option.value);
                              setIsSortDropdownOpen(false);
                            }}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {toolbarActionsNode}
            </div>
          </div>

          {filters.length > 0 && (
            <div css={cssObj.filterRow}>
              {filters.map((filter) => (
                <label key={filter.key} css={cssObj.selectLabel}>
                  <select
                    css={cssObj.select}
                    value={filter.value}
                    onChange={(event) => filter.onChange(event.target.value)}
                  >
                    {filter.placeholder && <option value="">{filter.placeholder}</option>}
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div css={cssObj.tableContainer}>
        <div css={cssObj.tableWrapper}>
          <table css={cssObj.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} css={cssObj.tableHeadRow}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan} css={cssObj.tableHeaderCell}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={visibleColumnsLength} css={cssObj.stateCell}>
                    {loadingMessage}
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    css={[cssObj.tableRow, row.getIsSelected() && cssObj.tableRowSelected]}
                    onClick={(event) => {
                      if (shouldIgnoreRowClick(event)) {
                        return;
                      }

                      if (rowEventHandlers?.selectOnClick) {
                        row.toggleSelected();
                      }

                      rowEventHandlers?.onClick?.({ row, event, table });
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} css={cssObj.tableCell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumnsLength} css={cssObj.stateCell}>
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer css={cssObj.footer}>
          <div css={cssObj.paginationControls}>
            <button
              type="button"
              css={cssObj.paginationArrowButton}
              disabled={!canUseDoubleArrows || !canGoPrev}
              onClick={() => handleGoToPage(1, 'segment')}
            >
              <ArrowMdLeftDouble />
            </button>
            <button
              type="button"
              css={cssObj.paginationArrowButton}
              disabled={!canGoPrev}
              onClick={() => handleGoToPage(currentPage - 1, 'segment')}
            >
              <ArrowMdLeftSingle />
            </button>

            <div css={cssObj.paginationPageList}>
              {pageNumbers.map((page) => {
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    type="button"
                    css={[
                      cssObj.paginationPageButton,
                      isActive && cssObj.paginationPageButtonActive,
                    ]}
                    onClick={() => handleGoToPage(page, 'segment')}
                  >
                    {page}
                  </button>
                );
              })}

              {hasRightMore && (
                <button type="button" css={cssObj.paginationMoreButton} onClick={handleClickMore}>
                  …
                </button>
              )}
            </div>
            <button
              type="button"
              css={cssObj.paginationArrowButton}
              disabled={!canGoNext}
              onClick={() => handleGoToPage(currentPage + 1, 'segment')}
            >
              <ArrowMdRightSingle />
            </button>
            <button
              type="button"
              css={cssObj.paginationArrowButton}
              disabled={!canUseDoubleArrows || !canGoNext}
              onClick={() => handleGoToPage(totalPages, 'segment')}
            >
              <ArrowMdRightDouble />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
