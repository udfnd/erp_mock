'use client';

import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table,
  type TableOptions,
  useReactTable,
} from '@tanstack/react-table';

import { type ButtonProps, Checkbox } from '@/common/components';
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
  TableChart,
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

export function Template<TData>({
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
  const [isFiltersDropdownOpen, setIsFiltersDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(search?.value ?? '');
  const [hasSearched, setHasSearched] = useState(Boolean(search?.value?.trim()));
  const [lastSearchedValue, setLastSearchedValue] = useState(search?.value ?? '');
  const searchValue = search?.value ?? '';
  const searchOnChange = search?.onChange;
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const sortDropdownRef = useRef<HTMLDivElement | null>(null);
  const filtersDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearchInputValue(searchValue);
    setHasSearched(Boolean(searchValue.trim()));
    setLastSearchedValue(searchValue);
  }, [searchValue]);

  const blurSearchInput = () => {
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  };

  const handleSearchSubmit = () => {
    const trimmed = searchInputValue.trim();
    if (!trimmed || !searchOnChange) return;

    searchOnChange(trimmed);
    setHasSearched(true);
    setLastSearchedValue(trimmed);
    blurSearchInput();
  };

  const handleClearSearch = () => {
    setSearchInputValue('');
    setLastSearchedValue('');
    setHasSearched(false);
    searchOnChange?.('');
    blurSearchInput();
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleDimClick = () => {
    blurSearchInput();
  };

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
                  <button type="button" css={cssObj.addElementButton} {...primaryActionProps}>
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

  const getSortOptionIcon = (optionValue: string) => {
    if (!sort) return null;

    const isActive = optionValue === sort.value;
    if (!sort.options.some((option) => option.value === optionValue)) {
      return isActive ? <RadioCheckedDisabled /> : <RadioUncheckedDisabled />;
    }

    return isActive ? <RadioCheckedActive /> : <RadioUncheckedActive />;
  };

  const getFilterOptionIcon = (
    filter: ListViewTemplateToolbarFilter,
    optionValue: string,
  ) => {
    const isActive = optionValue === filter.value;
    if (!filter.options.some((option) => option.value === optionValue)) {
      return isActive ? <RadioCheckedDisabled /> : <RadioUncheckedDisabled />;
    }

    return isActive ? <RadioCheckedActive /> : <RadioUncheckedActive />;
  };

  useEffect(() => {
    if (!filters.length && isFiltersDropdownOpen) {
      setIsFiltersDropdownOpen(false);
    }
  }, [filters, isFiltersDropdownOpen]);

  useEffect(() => {
    if (!isSortDropdownOpen && !isFiltersDropdownOpen) {
      return undefined;
    }

    const handleDocumentClick = (event: globalThis.MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (
        isSortDropdownOpen &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(target)
      ) {
        setIsSortDropdownOpen(false);
      }

      if (
        isFiltersDropdownOpen &&
        filtersDropdownRef.current &&
        !filtersDropdownRef.current.contains(target)
      ) {
        setIsFiltersDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isSortDropdownOpen, isFiltersDropdownOpen]);

  const totalCount = totalCountProp ?? table.getPrePaginationRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const isManualPagination = Boolean(manualPagination);
  const totalPages = isManualPagination
    ? Math.max(1, pageCount ?? Math.ceil(totalCount / pageSize))
    : Math.max(1, table.getPageCount() || 1);
  const visibleColumnsLength = table.getVisibleFlatColumns().length || 1;

  const hasToolbar = Boolean(search || filters.length > 0 || sort || toolbarActionsNode);
  const activeFiltersCount = filters.filter((filter) => filter.value !== '').length;
  const filtersDisplayLabel =
    activeFiltersCount > 0 ? `필터 (${activeFiltersCount})` : '필터 선택';

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

  const hasRows = table.getRowModel().rows.length > 0;
  const hasAppliedSearch = hasSearched && Boolean(lastSearchedValue.trim());
  const shouldShowSearchAction = isSearchFocused;
  const isSearchButtonDisabled = searchInputValue.trim() === '';
  return (
    <section css={cssObj.container}>
      {hasToolbar && (
        <div css={cssObj.toolbar}>
          <div css={cssObj.toolbarTopRow}>
            {search && (
              <div
                css={cssObj.searchBox(isSearchFocused, shouldShowSearchAction)}
                onFocusCapture={() => setIsSearchFocused(true)}
                onBlurCapture={(event) => {
                  const relatedTarget = event.relatedTarget as Node | null;
                  if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
                    setIsSearchFocused(false);
                  }
                }}
              >
                {!isSearchFocused &&
                  (hasAppliedSearch ? (
                    <button
                      type="button"
                      css={cssObj.searchClearButton}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={handleClearSearch}
                      aria-label="검색어 지우기"
                    >
                      <Close />
                    </button>
                  ) : (
                    <Search css={cssObj.searchIcon} />
                  ))}
                <input
                  ref={searchInputRef}
                  css={cssObj.searchInput(!isSearchFocused)}
                  value={searchInputValue}
                  placeholder={search.placeholder ?? '검색어를 입력하세요'}
                  onChange={(event) => setSearchInputValue(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                {shouldShowSearchAction && (
                  <button
                    type="button"
                    css={cssObj.searchActionButton(isSearchButtonDisabled)}
                    disabled={isSearchButtonDisabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={handleSearchSubmit}
                    aria-label="검색"
                  >
                    <Search />
                  </button>
                )}
              </div>
            )}
            <div css={cssObj.toolbarControls}>
              {sort && (
                <div css={cssObj.filterDropdown} ref={sortDropdownRef}>
                  <button
                    type="button"
                    css={cssObj.filterTrigger(isSortDropdownOpen)}
                    onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                  >
                    <span>{sortDisplayLabel}</span>
                    <ArrowLgDown />
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
                          <span css={cssObj.filterOptionContent}>
                            {getSortOptionIcon('')}
                            <span>{sort.placeholder}</span>
                          </span>
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
                            <span css={cssObj.filterOptionContent}>
                              {getSortOptionIcon(option.value)}
                              <span>{option.label}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {filters.length > 0 && (
                <div css={cssObj.filterDropdown} ref={filtersDropdownRef}>
                  <button
                    type="button"
                    css={cssObj.filterTrigger(isFiltersDropdownOpen)}
                    onClick={() => setIsFiltersDropdownOpen((prev) => !prev)}
                  >
                    <span>{filtersDisplayLabel}</span>
                    <ArrowLgDown />
                  </button>

                  {isFiltersDropdownOpen && (
                    <div css={cssObj.filterMenu}>
                      {filters.map((filter, index) => {
                        const selectedOption = filter.options.find(
                          (option) => option.value === filter.value,
                        );
                        const groupLabel = filter.label ?? filter.placeholder ?? '필터';
                        const groupValue =
                          selectedOption?.label ?? (filter.value === '' ? filter.placeholder : '');

                        return (
                          <div key={filter.key} css={cssObj.filterGroup(index > 0)}>
                            <div css={cssObj.filterGroupHeader}>
                              <span>{groupLabel}</span>
                              {groupValue && <span css={cssObj.filterGroupValue}>{groupValue}</span>}
                            </div>

                            {filter.placeholder && (
                              <button
                                type="button"
                                css={[
                                  cssObj.filterOption,
                                  filter.value === '' && cssObj.filterOptionActive,
                                ]}
                                onClick={() => {
                                  filter.onChange('');
                                  setIsFiltersDropdownOpen(false);
                                }}
                              >
                                <span css={cssObj.filterOptionContent}>
                                  {getFilterOptionIcon(filter, '')}
                                  <span>{filter.placeholder}</span>
                                </span>
                              </button>
                            )}

                            {filter.options.map((option) => {
                              const isActive = option.value === filter.value;
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  css={[cssObj.filterOption, isActive && cssObj.filterOptionActive]}
                                  onClick={() => {
                                    filter.onChange(option.value);
                                    setIsFiltersDropdownOpen(false);
                                  }}
                                >
                                  <span css={cssObj.filterOptionContent}>
                                    {getFilterOptionIcon(filter, option.value)}
                                    <span>{option.label}</span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {toolbarActionsNode}
              <button type="button" css={cssObj.viewChangeButton}>
                <TableChart />
                리스트뷰
              </button>
            </div>
          </div>

        </div>
      )}

      {hasAppliedSearch && (
        <div css={cssObj.searchResultSummary}>
          ‘{lastSearchedValue}’ 검색 결과입니다 ({totalCount}개)
        </div>
      )}

      <div css={cssObj.tableContainer}>
        <div css={cssObj.tableWrapperContainer}>
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
                ) : hasRows ? (
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

          {isSearchFocused && (
            <button
              type="button"
              css={cssObj.tableDimmer}
              aria-label="검색창 닫기"
              onClick={handleDimClick}
            />
          )}
        </div>

        {hasRows && (
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
        )}
      </div>
    </section>
  );
}
