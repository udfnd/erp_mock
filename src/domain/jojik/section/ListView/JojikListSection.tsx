'use client';

import { useEffect, useMemo } from 'react';

import { flexRender, type Row, type Table } from '@tanstack/react-table';

import { Button } from '@/common/components';
import { Search } from '@/common/icons';
import { ListViewHeadlessTemplate } from '@/common/list-view';
import { type JojikListSectionProps } from '@/domain/jojik/section';
import type { JojikListItem } from '@/domain/jojik/api';

import { type CreatedAtFilterValue } from './constants';
import { jojikListViewCss } from './styles';

export type JojikListSectionComponentProps = JojikListSectionProps & {
  createdAtFilterOptions: { label: string; value: CreatedAtFilterValue }[];
  sortOptions: { label: string; value: string }[];
  pageSizeOptions: number[];
};

type ListContentProps = {
  table: Table<JojikListItem>;
  selectedFlatRows: Row<JojikListItem>[];
  isListLoading: boolean;
  totalCount: number;
  totalPages: number;
  searchTerm: string;
  sortByOption?: string;
  pagination: JojikListSectionProps['pagination'];
  handlers: JojikListSectionProps['handlers'];
  sortOptions: { label: string; value: string }[];
};

function ListContent({
  table,
  selectedFlatRows,
  isListLoading,
  totalCount,
  totalPages,
  searchTerm,
  sortByOption,
  handlers,
  sortOptions,
}: ListContentProps) {
  const selectedJojiks = useMemo(
    () => selectedFlatRows.map((row) => row.original),
    [selectedFlatRows],
  );
  const { onSelectedJojiksChange, ...listHandlers } = handlers;

  useEffect(() => {
    onSelectedJojiksChange(selectedJojiks);
  }, [onSelectedJojiksChange, selectedJojiks]);

  const visibleColumnsLength = table.getVisibleFlatColumns().length;

  return (
    <section css={jojikListViewCss.listSection}>
      <div css={jojikListViewCss.listHeader}>
        <div css={jojikListViewCss.searchContainer}>
          <Search css={jojikListViewCss.searchIcon} />
          <input
            css={jojikListViewCss.searchTextfield}
            placeholder="조직 이름으로 검색"
            value={searchTerm}
            onChange={() => listHandlers.onSearchChange}
          />
        </div>
        <div css={jojikListViewCss.toolbarGroup}>
          <label>
            <select
              css={jojikListViewCss.toolbarSelect}
              value={sortByOption ?? 'createdAt:desc'}
              onChange={(event) => listHandlers.onSortChange(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div css={jojikListViewCss.tableContainer}>
        <div css={jojikListViewCss.tableWrapper}>
          <Button variant="primary" size="medium" onClick={listHandlers.onAddClick}>
            새 조직 추가
          </Button>
          <table css={jojikListViewCss.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} css={jojikListViewCss.tableHeadRow}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      css={jojikListViewCss.tableHeaderCell}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isListLoading ? (
                <tr>
                  <td colSpan={visibleColumnsLength} css={jojikListViewCss.loadingState}>
                    조직 데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    css={[
                      jojikListViewCss.tableRow,
                      row.getIsSelected() && jojikListViewCss.tableRowSelected,
                    ]}
                    onClick={(event) => {
                      const target = event.target as HTMLElement | null;
                      if (target?.closest('label')) {
                        return;
                      }
                      listHandlers.onStopCreate();
                      row.toggleSelected();
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        css={[
                          jojikListViewCss.tableCell,
                          cell.column.id === 'selection' && jojikListViewCss.checkboxCell,
                        ]}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumnsLength} css={jojikListViewCss.emptyState}>
                    조건에 맞는 조직이 없습니다. 검색어나 필터를 조정해 보세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div css={jojikListViewCss.tableFooter}>
          <span css={jojikListViewCss.paginationInfo}>
            총 {totalCount}개 조직 · {table.getState().pagination.pageIndex + 1} / {totalPages}{' '}
            페이지
          </span>
          <div css={jojikListViewCss.paginationButtons}>
            <Button
              styleType="text"
              variant="secondary"
              size="small"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              처음
            </Button>
            <Button
              styleType="text"
              variant="secondary"
              size="small"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              이전
            </Button>
            <Button
              styleType="text"
              variant="secondary"
              size="small"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              다음
            </Button>
            <Button
              styleType="text"
              variant="secondary"
              size="small"
              onClick={() => table.setPageIndex(totalPages - 1)}
              disabled={!table.getCanNextPage()}
            >
              마지막
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JojikListSection({
  data,
  columns,
  state,
  isListLoading,
  totalCount,
  totalPages,
  searchTerm,
  sortByOption,
  pagination,
  handlers,
  sortOptions,
}: JojikListSectionComponentProps) {
  return (
    <ListViewHeadlessTemplate
      data={data}
      columns={columns}
      state={state}
      manualPagination
      manualSorting
      pageCount={totalPages}
      enableRowSelection
      autoResetPageIndex={false}
      autoResetExpanded={false}
    >
      {({ table, selectedFlatRows }) => (
        <ListContent
          table={table}
          selectedFlatRows={selectedFlatRows}
          isListLoading={isListLoading}
          totalCount={totalCount}
          totalPages={totalPages}
          searchTerm={searchTerm}
          sortByOption={sortByOption}
          pagination={pagination}
          handlers={handlers}
          sortOptions={sortOptions}
        />
      )}
    </ListViewHeadlessTemplate>
  );
}
