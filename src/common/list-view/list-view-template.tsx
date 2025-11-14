'use client';

import { useEffect, useMemo } from 'react';
import {
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type Table,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { MouseEvent, ReactNode } from 'react';

import { Button, type ButtonProps } from '@/common/components';
import { Search } from '@/common/icons';

import { listViewTemplateCss } from './styles';
import type { ListViewState } from './useListViewState';

const DEFAULT_ROW_CLICK_IGNORE_SELECTOR = 'button, a, label, input, select, textarea';

// 템플릿 내부에서 직접 관리하는 필드를 제외한 나머지 TableOptions를 한 번에 받기 위함
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
  columns: ColumnDef<TData, any>[];
  state: ListViewState<TData>;
  search?: ListViewTemplateSearch;
  filters?: ListViewTemplateToolbarFilter[];
  sort?: ListViewTemplateToolbarSort;
  toolbarActions?:
    | ReactNode
    | ((context: ListViewTemplateRenderContext<TData>) => ReactNode);
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
  title,
  description,
  data,
  columns,
  state,
  search,
  filters = [],
  sort,
  toolbarActions,
  primaryAction,
  pageSizeOptions = [],
  onPageSizeChange,
  totalCount: totalCountProp,
  isLoading = false,
  loadingMessage = '데이터를 불러오는 중입니다...',
  emptyMessage = '표시할 데이터가 없습니다.',
  onSelectedRowsChange,
  rowEventHandlers,
  ...tableOptions
}: ListViewTemplateProps<TData>) {
  const {
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    ...restTableOptions
  } = tableOptions;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      rowSelection: state.rowSelection,
      pagination: state.pagination,
    },
    onSortingChange: state.setSorting as OnChangeFn<any>,
    onColumnFiltersChange: state.setColumnFilters as OnChangeFn<any>,
    onRowSelectionChange: state.setRowSelection as OnChangeFn<any>,
    onPaginationChange: state.setPagination as OnChangeFn<any>,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    ...restTableOptions,
  });

  const rowSelectionState = table.getState().rowSelection;
  const selectedRows = useMemo(() => table.getSelectedRowModel().flatRows, [
    table,
    rowSelectionState,
  ]);

  useEffect(() => {
    if (onSelectedRowsChange) {
      onSelectedRowsChange(selectedRows);
    }
  }, [onSelectedRowsChange, selectedRows]);

  const toolbarActionsNode = useMemo(() => {
    if (typeof toolbarActions === 'function') {
      return toolbarActions({ table, selectedRows });
    }
    return toolbarActions;
  }, [selectedRows, table, toolbarActions]);

  const totalCount = totalCountProp ?? table.getPrePaginationRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize || 1;
  const isManualPagination = Boolean(manualPagination);
  const totalPages = isManualPagination
    ? Math.max(1, pageCount ?? Math.ceil(totalCount / pageSize))
    : Math.max(1, table.getPageCount() || 1);
  const visibleColumnsLength = table.getVisibleFlatColumns().length || 1;

  const hasToolbar = Boolean(
    search || filters.length > 0 || sort || toolbarActionsNode,
  );

  const shouldIgnoreRowClick =
    rowEventHandlers?.shouldIgnoreRowClick ??
    ((event: MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement | null;
      return Boolean(target?.closest(DEFAULT_ROW_CLICK_IGNORE_SELECTOR));
    });

  let primaryActionLabel: ReactNode | undefined;
  let primaryActionProps: Omit<ListViewTemplatePrimaryAction, 'label'> | undefined;
  if (primaryAction) {
    const { label, ...rest } = primaryAction;
    primaryActionLabel = label;
    primaryActionProps = rest;
  }

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
      return;
    }

    table.setPageSize(size);
  };

  return (
    <section css={listViewTemplateCss.container}>
      {(title || description || primaryAction) && (
        <header css={listViewTemplateCss.header}>
          <div css={listViewTemplateCss.headerContent}>
            {title && <h1 css={listViewTemplateCss.title}>{title}</h1>}
            {description && (
              <p css={listViewTemplateCss.description}>{description}</p>
            )}
          </div>
          {primaryActionProps && (
            <Button
              styleType="solid"
              variant="primary"
              size="medium"
              {...primaryActionProps}
            >
              {primaryActionLabel}
            </Button>
          )}
        </header>
      )}

      {hasToolbar && (
        <div css={listViewTemplateCss.toolbar}>
          {search && (
            <div css={listViewTemplateCss.searchBox}>
              <Search css={listViewTemplateCss.searchIcon} />
              <input
                css={listViewTemplateCss.searchInput}
                value={search.value}
                placeholder={search.placeholder ?? '검색어를 입력하세요'}
                onChange={(event) => search.onChange(event.target.value)}
              />
            </div>
          )}
          <div css={listViewTemplateCss.toolbarControls}>
            {filters.map((filter) => (
              <label key={filter.key} css={listViewTemplateCss.selectLabel}>
                {filter.label && <span>{filter.label}</span>}
                <select
                  css={listViewTemplateCss.select}
                  value={filter.value}
                  onChange={(event) => filter.onChange(event.target.value)}
                >
                  {filter.placeholder && (
                    <option value="">{filter.placeholder}</option>
                  )}
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            {sort && (
              <label css={listViewTemplateCss.selectLabel}>
                {sort.label && <span>{sort.label}</span>}
                <select
                  css={listViewTemplateCss.select}
                  value={sort.value}
                  onChange={(event) => sort.onChange(event.target.value)}
                >
                  {sort.placeholder && (
                    <option value="">{sort.placeholder}</option>
                  )}
                  {sort.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {toolbarActionsNode}
          </div>
        </div>
      )}

      <div css={listViewTemplateCss.tableContainer}>
        <div css={listViewTemplateCss.tableWrapper}>
          <table css={listViewTemplateCss.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} css={listViewTemplateCss.tableHeadRow}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      css={listViewTemplateCss.tableHeaderCell}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={visibleColumnsLength}
                    css={listViewTemplateCss.stateCell}
                  >
                    {loadingMessage}
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    css={[
                      listViewTemplateCss.tableRow,
                      row.getIsSelected() && listViewTemplateCss.tableRowSelected,
                    ]}
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
                      <td key={cell.id} css={listViewTemplateCss.tableCell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={visibleColumnsLength}
                    css={listViewTemplateCss.stateCell}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer css={listViewTemplateCss.footer}>
          <div css={listViewTemplateCss.paginationInfo}>
            총 {totalCount}개 · {pageIndex + 1} / {totalPages} 페이지
          </div>
          <div css={listViewTemplateCss.footerControls}>
            {pageSizeOptions.length > 0 && (
              <label css={listViewTemplateCss.selectLabel}>
                페이지당
                <select
                  css={listViewTemplateCss.pageSizeSelect}
                  value={pageSize}
                  onChange={(event) => handlePageSizeChange(Number(event.target.value))}
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}개
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div css={listViewTemplateCss.paginationControls}>
              <Button
                styleType="text"
                variant="secondary"
                size="small"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.setPageIndex(0)}
              >
                처음
              </Button>
              <Button
                styleType="text"
                variant="secondary"
                size="small"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                이전
              </Button>
              <Button
                styleType="text"
                variant="secondary"
                size="small"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                다음
              </Button>
              <Button
                styleType="text"
                variant="secondary"
                size="small"
                disabled={!table.getCanNextPage()}
                onClick={() => table.setPageIndex(totalPages - 1)}
              >
                마지막
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
