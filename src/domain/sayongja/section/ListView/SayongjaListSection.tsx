'use client';

import { useEffect, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button, Checkbox, IconButton, Textfield } from '@/common/components';
import { ArrowMdLeftSingle, ArrowMdRightSingle, Plus, Search } from '@/common/icons';

import type { SayongjaListSectionProps, SayongjaFilters } from './useSayongjaListViewSections';
import type { SayongjaListItem } from '@/domain/sayongja/api';
import { cssObj } from './styles';

export type SayongjaListSectionComponentProps = SayongjaListSectionProps & {
  sortOptions: { label: string; value: string }[];
  pageSizeOptions: number[];
  jojikFilterOptions: { label: string; value: string }[];
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
  isHwalseongFilterOptions: { label: string; value: string }[];
};

const DEFAULT_FILTERS: SayongjaFilters = {
  jojikNanoIds: ['all'],
  employmentCategoryNanoIds: ['all'],
  workTypeNanoIds: ['all'],
  isHwalseong: ['all'],
};

export function SayongjaListSection({
  data,
  columns,
  state,
  isListLoading,
  pagination,
  searchTerm,
  sortByOption,
  filters,
  totalCount,
  totalPages,
  isCreating,
  handlers,
  sortOptions,
  pageSizeOptions,
  jojikFilterOptions,
  employmentCategoryOptions,
  workTypeOptions,
  isHwalseongFilterOptions,
}: SayongjaListSectionComponentProps) {
  const table = useReactTable<SayongjaListItem>({
    data,
    columns,
    state: {
      sorting: state.sorting,
      pagination: state.pagination,
      rowSelection: state.rowSelection,
    },
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: state.setSorting,
    onPaginationChange: state.setPagination,
    onRowSelectionChange: state.setRowSelection,
  });

  const currentPage = pagination.pageIndex + 1;
  const sortValue = sortByOption ?? sortOptions[0]?.value ?? '';
  const effectiveFilters = filters ?? DEFAULT_FILTERS;

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    if (selectedRows.length > 0) {
      handlers.onStopCreate();
    }
    handlers.onSelectedSayongjasChange(selectedRows.map((row) => row.original));
  }, [handlers, state.rowSelection, table]);

  const allSelected = useMemo(() => table.getIsAllRowsSelected(), [table, state.rowSelection]);
  const someSelected = useMemo(
    () => table.getIsSomeRowsSelected() && !allSelected,
    [allSelected, table, state.rowSelection],
  );

  const handleMultiSelectChange = (values: string[], onChange: (value: string[]) => void) => {
    onChange(values.length > 0 ? values : ['all']);
  };

  return (
    <section css={cssObj.listSection}>
      <div css={cssObj.listHeader}>
        <div css={cssObj.searchContainer}>
          <Search css={cssObj.searchIcon} />
          <Textfield
            css={cssObj.searchTextfield}
            placeholder="사용자 이름으로 검색"
            value={searchTerm}
            onChange={(event) => handlers.onSearchChange(event.target.value)}
          />
        </div>
        <div css={cssObj.toolbarGroup}>
          <select
            css={cssObj.toolbarSelect}
            value={sortValue}
            onChange={(event) => handlers.onSortChange(event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            css={cssObj.toolbarSelect}
            value={pagination.pageSize}
            onChange={(event) => handlers.onPageSizeChange(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}개씩 보기
              </option>
            ))}
          </select>
          <Button size="small" iconLeft={<Plus />} onClick={handlers.onAddClick} disabled={isCreating}>
            새 사용자 추가
          </Button>
        </div>
      </div>

      <div css={cssObj.toolbarGroup}>
        <select
          multiple
          css={cssObj.toolbarSelect}
          value={effectiveFilters.jojikNanoIds}
          onChange={(event) =>
            handleMultiSelectChange(
              Array.from(event.target.selectedOptions, (option) => option.value),
              handlers.onJojikFilterChange,
            )
          }
        >
          {jojikFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          multiple
          css={cssObj.toolbarSelect}
          value={effectiveFilters.employmentCategoryNanoIds}
          onChange={(event) =>
            handleMultiSelectChange(
              Array.from(event.target.selectedOptions, (option) => option.value),
              handlers.onEmploymentCategoryFilterChange,
            )
          }
        >
          {employmentCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          multiple
          css={cssObj.toolbarSelect}
          value={effectiveFilters.workTypeNanoIds}
          onChange={(event) =>
            handleMultiSelectChange(
              Array.from(event.target.selectedOptions, (option) => option.value),
              handlers.onWorkTypeFilterChange,
            )
          }
        >
          {workTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          multiple
          css={cssObj.toolbarSelect}
          value={effectiveFilters.isHwalseong}
          onChange={(event) =>
            handleMultiSelectChange(
              Array.from(event.target.selectedOptions, (option) => option.value),
              handlers.onIsHwalseongFilterChange,
            )
          }
        >
          {isHwalseongFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div css={cssObj.tableContainer}>
        <div css={cssObj.tableWrapper}>
          <table css={cssObj.table}>
            <thead>
              <tr css={cssObj.tableHeadRow}>
                <th css={[cssObj.tableHeaderCell, cssObj.checkboxCell]}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(event) => table.toggleAllRowsSelected(event.target.checked)}
                  />
                </th>
                {table.getFlatHeaders().map((header) => (
                  <th key={header.id} css={cssObj.tableHeaderCell}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isListLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} css={cssObj.loadingState}>
                    사용자 데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} css={cssObj.emptyState}>
                    조건에 맞는 사용자가 없습니다. 검색어나 필터를 조정해 보세요.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    css={[cssObj.tableRow, row.getIsSelected() && cssObj.tableRowSelected]}
                    onClick={() => {
                      handlers.onStopCreate();
                      row.toggleSelected();
                    }}
                  >
                    <td css={[cssObj.tableCell, cssObj.checkboxCell]}>
                      <Checkbox
                        checked={row.getIsSelected()}
                        onChange={(event) => {
                          event.stopPropagation();
                          row.toggleSelected();
                        }}
                      />
                    </td>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} css={cssObj.tableCell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div css={cssObj.tableFooter}>
          <span css={cssObj.paginationInfo}>
            총 {totalCount}명 · {currentPage}/{totalPages} 페이지
          </span>
          <div css={cssObj.paginationButtons}>
            <IconButton
              aria-label="이전 페이지"
              size="small"
              disabled={currentPage <= 1}
              onClick={() =>
                state.setPagination({ ...pagination, pageIndex: Math.max(0, pagination.pageIndex - 1) })
              }
            >
              <ArrowMdLeftSingle />
            </IconButton>
            <IconButton
              aria-label="다음 페이지"
              size="small"
              disabled={currentPage >= totalPages}
              onClick={() =>
                state.setPagination({ ...pagination, pageIndex: Math.min(totalPages - 1, pagination.pageIndex + 1) })
              }
            >
              <ArrowMdRightSingle />
            </IconButton>
          </div>
        </div>
      </div>
    </section>
  );
}
