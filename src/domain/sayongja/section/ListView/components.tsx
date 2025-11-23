'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ColumnDef, Row, Table } from '@tanstack/react-table';
import type React from 'react';

import { Button } from '@/common/components';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  ArrowLgDown,
  ArrowMdLeftDouble,
  ArrowMdLeftSingle,
  ArrowMdRightDouble,
  ArrowMdRightSingle,
  Close,
  Plus,
  RadioCheckedActive,
  RadioCheckedDisabled,
  RadioUncheckedActive,
  RadioUncheckedDisabled,
  Search,
} from '@/common/icons';
import type { ListViewState } from '@/common/lv';
import { cssObj as lvCss } from '@/common/lv/style';

export type ListViewSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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
  pageSizeOptions: number[];
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalCount: number;
  primaryAction?: ListViewPrimaryActionProps;
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
  rowEventHandlers?: {
    selectOnClick?: boolean;
    shouldIgnoreRowClick?: (event: React.MouseEvent<HTMLElement>) => boolean;
    onClick?: (args: { row: Row<TData>; event: React.MouseEvent<HTMLTableRowElement>; table: Table<TData> }) => void;
  };
  onSelectedRowsChange?: (rows: Row<TData>[]) => void;
};

export type ListViewPaginationProps = {
  table: Table<unknown>;
};

const DEFAULT_IGNORE_SELECTOR = 'button, a, label, input, select, textarea';

export function SearchSection({ search, totalCount }: Pick<ListViewToolbarProps, 'search' | 'totalCount'>) {
  const [isFocused, setIsFocused] = useState(false);
  const [lastSearch, setLastSearch] = useState('');
  const hasAppliedSearch = Boolean(lastSearch);

  useEffect(() => {
    setLastSearch(search.value);
  }, [search.value]);

  return (
    <div css={lvCss.toolbar}>
      <div css={lvCss.toolbarTopRow}>
        <div css={lvCss.searchBox(isFocused, false)}>
          {search.value && (
            <button
              type="button"
              css={lvCss.searchClearButton}
              aria-label="검색어 지우기"
              onClick={() => search.onChange('')}
            >
              <Close width={16} height={16} />
            </button>
          )}
          <Search css={lvCss.searchIcon} />
          <input
            css={lvCss.searchInput(true)}
            value={search.value}
            placeholder={search.placeholder}
            onChange={(event) => search.onChange(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
      {hasAppliedSearch && (
        <div css={lvCss.searchResultSummary}>
          ‘{lastSearch}’ 검색 결과입니다 ({totalCount}개)
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ filter }: { filter: ListViewFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggleOption = (value: string) => {
    const nextValue = filter.value.includes(value)
      ? filter.value.filter((item) => item !== value)
      : [...filter.value, value];

    const resolvedValue = nextValue.length > 0 ? nextValue : filter.defaultValue ?? [];
    filter.onChange(resolvedValue);
  };

  const isActive = useMemo(() => {
    const nonDefault = filter.value.filter((value) => !(filter.defaultValue ?? []).includes(value));
    return nonDefault.length > 0;
  }, [filter.defaultValue, filter.value]);

  return (
    <div css={lvCss.filterDropdown} ref={dropdownRef}>
      <button
        type="button"
        css={lvCss.filterTrigger(isOpen, isActive)}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{filter.label ?? '필터'}</span>
        <ArrowLgDown css={lvCss.filterTriggerCaret} />
      </button>
      {isOpen && (
        <div css={lvCss.filterMenu}>
          <div css={lvCss.filterGroup(false)}>
            <div css={lvCss.filterGroupHeader}>
              <span>{filter.label}</span>
              <span css={lvCss.filterGroupValue}>
                {filter.value
                  .map((value) => filter.options.find((option) => option.value === value)?.label ?? value)
                  .join(', ')}
              </span>
            </div>
            {filter.options.map((option) => {
              const isOptionActive = filter.value.includes(option.value);
              const isDisabled = !filter.options.some((opt) => opt.value === option.value);
              const icon = isDisabled
                ? isOptionActive
                  ? <RadioCheckedDisabled />
                  : <RadioUncheckedDisabled />
                : isOptionActive
                  ? <RadioCheckedActive />
                  : <RadioUncheckedActive />;

              return (
                <button
                  key={option.value}
                  type="button"
                  css={[lvCss.filterOption, isOptionActive && lvCss.filterOptionActive]}
                  onClick={() => handleToggleOption(option.value)}
                >
                  <span css={lvCss.filterOptionContent}>
                    {icon}
                    <span>{option.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SortDropdown({ sort }: { sort: ListViewSortProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = sort.options.find((option) => option.value === sort.value);
  const displayLabel = selectedOption?.label ?? sort.placeholder ?? '정렬 기준';

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getSortOptionIcon = (optionValue: string) => {
    const isActive = optionValue === sort.value;
    if (!sort.options.some((option) => option.value === optionValue)) {
      return isActive ? <RadioCheckedDisabled /> : <RadioUncheckedDisabled />;
    }
    return isActive ? <RadioCheckedActive /> : <RadioUncheckedActive />;
  };

  return (
    <div css={lvCss.filterDropdown} ref={dropdownRef}>
      <button
        type="button"
        css={lvCss.filterTrigger(isOpen, Boolean(sort.value))}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{displayLabel}</span>
        <ArrowLgDown css={lvCss.filterTriggerCaret} />
      </button>
      {isOpen && (
        <div css={lvCss.filterMenu}>
          <div css={lvCss.filterGroup(false)}>
            {sort.options.map((option) => (
              <button
                key={option.value}
                type="button"
                css={[lvCss.filterOption, option.value === sort.value && lvCss.filterOptionActive]}
                onClick={() => {
                  sort.onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span css={lvCss.filterOptionContent}>
                  {getSortOptionIcon(option.value)}
                  <span>{option.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ToolbarSection({
  search,
  filters,
  sort,
  pageSizeOptions,
  pageSize,
  onPageSizeChange,
  totalCount,
  primaryAction,
}: ListViewToolbarProps) {
  return (
    <div css={lvCss.toolbar}>
      <div css={lvCss.toolbarTopRow}>
        <div css={lvCss.searchBox(true, false)}>
          {search.value && (
            <button
              type="button"
              css={lvCss.searchClearButton}
              aria-label="검색어 지우기"
              onClick={() => search.onChange('')}
            >
              <Close width={16} height={16} />
            </button>
          )}
          <Search css={lvCss.searchIcon} />
          <input
            css={lvCss.searchInput(true)}
            value={search.value}
            placeholder={search.placeholder}
            onChange={(event) => search.onChange(event.target.value)}
          />
        </div>
        <div css={lvCss.toolbarControls}>
          {primaryAction ? (
            <Button size="small" iconLeft={<Plus />} disabled={primaryAction.disabled} onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          ) : null}
          <SortDropdown sort={sort} />
          {filters.map((filter) => (
            <FilterDropdown key={filter.key} filter={filter} />
          ))}
          <label css={lvCss.selectLabel}>
            페이지 크기
            <select
              css={lvCss.select}
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}개씩 보기
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div css={lvCss.searchResultSummary}>총 {totalCount}명</div>
    </div>
  );
}

export function ListSection<TData>({
  data,
  columns,
  state,
  manualPagination,
  manualSorting,
  pageCount,
  isLoading,
  loadingMessage,
  emptyMessage,
  rowEventHandlers,
  onSelectedRowsChange,
}: ListViewTableProps<TData>) {
  const effectiveColumns = useMemo(() => columns, [columns]);
  const table = useReactTable({
    data,
    columns: effectiveColumns,
    state: {
      sorting: state.sorting,
      pagination: state.pagination,
      rowSelection: state.rowSelection,
    },
    manualPagination,
    manualSorting,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: state.setSorting,
    onPaginationChange: state.setPagination,
    onRowSelectionChange: state.setRowSelection,
  });

  const selectedRows = table.getSelectedRowModel().flatRows;

  useEffect(() => {
    onSelectedRowsChange?.(selectedRows as Row<TData>[]);
  }, [onSelectedRowsChange, selectedRows]);

  const visibleColumnsLength = table.getVisibleLeafColumns().length;
  const hasRows = table.getRowModel().rows.length > 0;

  const shouldIgnoreRowClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    if (!rowEventHandlers?.selectOnClick || !target) {
      return false;
    }
    return Boolean(target.closest(DEFAULT_IGNORE_SELECTOR));
  };

  return (
    <div css={lvCss.tableContainer}>
      <div css={lvCss.tableWrapperContainer}>
        <div css={lvCss.tableWrapper}>
          <table css={lvCss.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} css={lvCss.tableHeadRow}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan} css={lvCss.tableHeaderCell}>
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
                  <td colSpan={visibleColumnsLength} css={lvCss.stateCell}>
                    {loadingMessage}
                  </td>
                </tr>
              ) : hasRows ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    css={[lvCss.tableRow, row.getIsSelected() && lvCss.tableRowSelected]}
                    onClick={(event) => {
                      if (shouldIgnoreRowClick(event)) {
                        return;
                      }

                      if (rowEventHandlers?.selectOnClick) {
                        row.toggleSelected();
                      }

                      rowEventHandlers?.onClick?.({ row: row as Row<TData>, event, table });
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} css={lvCss.tableCell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumnsLength} css={lvCss.stateCell}>
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {hasRows && <PaginationSection table={table} />}
    </div>
  );
}

export function PaginationSection({ table }: ListViewPaginationProps) {
  const pagination = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalPages = Math.max(pageCount, 1);
  const currentPage = Math.min(Math.max(1, pagination.pageIndex + 1), totalPages);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  const handleGoToPage = (page: number) => {
    const nextIndex = Math.min(Math.max(page - 1, 0), totalPages - 1);
    table.setPageIndex(nextIndex);
  };

  const hasRightMore = pageNumbers[pageNumbers.length - 1] < totalPages;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const canUseDoubleArrows = totalPages > 5;

  return (
    <footer css={lvCss.footer}>
      <div css={lvCss.paginationControls}>
        <button
          type="button"
          css={lvCss.paginationArrowButton}
          disabled={!canUseDoubleArrows || !canGoPrev}
          onClick={() => handleGoToPage(1)}
        >
          <ArrowMdLeftDouble />
        </button>
        <button
          type="button"
          css={lvCss.paginationArrowButton}
          disabled={!canGoPrev}
          onClick={() => handleGoToPage(currentPage - 1)}
        >
          <ArrowMdLeftSingle />
        </button>

        <div css={lvCss.paginationPageList}>
          {pageNumbers.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                css={[lvCss.paginationPageButton, isActive && lvCss.paginationPageButtonActive]}
                onClick={() => handleGoToPage(page)}
              >
                {page}
              </button>
            );
          })}

          {hasRightMore && (
            <button
              type="button"
              css={lvCss.paginationMoreButton}
              onClick={() => handleGoToPage(currentPage + pageNumbers.length)}
            >
              …
            </button>
          )}
        </div>
        <button
          type="button"
          css={lvCss.paginationArrowButton}
          disabled={!canGoNext}
          onClick={() => handleGoToPage(currentPage + 1)}
        >
          <ArrowMdRightSingle />
        </button>
        <button
          type="button"
          css={lvCss.paginationArrowButton}
          disabled={!canUseDoubleArrows || !canGoNext}
          onClick={() => handleGoToPage(totalPages)}
        >
          <ArrowMdRightDouble />
        </button>
      </div>
    </footer>
  );
}

