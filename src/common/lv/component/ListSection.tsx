'use client';

import { useEffect, useMemo } from 'react';
import type React from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cssObj as lvCss } from '@/common/lv/style';
import { Checkbox } from '@/common/components';
import { Plus } from '@/common/icons';
import { color } from '@/style';

import type { ListViewTableProps } from './types';
import { PaginationSection } from './PaginationSection';

const DEFAULT_IGNORE_SELECTOR = 'button, a, label, input, select, textarea';

export function ListSection<TData>({
  data,
  columns,
  state,
  primaryAction,
  manualPagination,
  manualSorting,
  pageCount,
  isLoading,
  loadingMessage,
  emptyMessage,
  isDimmed,
  rowEventHandlers,
  onSelectedRowsChange,
  onDimmerClick,
}: ListViewTableProps<TData>) {
  const selectionColumn: ColumnDef<TData> = useMemo(
    () => ({
      id: '__row_selection__',
      header: ({ table }) => (
        <div css={lvCss.selectionCell}>
          {(() => {
            const isAllRowsSelected = table.getIsAllRowsSelected();
            const isSomeRowsSelected =
              (table.getIsSomeRowsSelected?.() ?? table.getIsSomePageRowsSelected?.()) && !isAllRowsSelected;

            return (
              <Checkbox
                checked={isAllRowsSelected}
                indeterminate={Boolean(isSomeRowsSelected)}
                onChange={table.getToggleAllRowsSelectedHandler()}
                ariaLabel="전체 행 선택"
              />
            );
          })()}
        </div>
      ),
      cell: ({ row }) => (
        <div css={lvCss.selectionCell}>
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
    }),
    [],
  );

  const primaryActionColumn: ColumnDef<TData> | null = useMemo(
    () =>
      primaryAction
        ? {
            id: '__primary_action__',
            header: () => (
              <div css={lvCss.headerActionCell}>
                <button
                  type="button"
                  css={lvCss.addElementButton}
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                >
                  <>
                    {primaryAction.label}
                    <Plus width={16} height={16} color={`${color.white}`} />
                  </>
                </button>
              </div>
            ),
            cell: () => null,
            enableSorting: false,
            enableColumnFilter: false,
            enableHiding: false,
          }
        : null,
    [primaryAction],
  );

  const effectiveColumns = useMemo(
    () => [selectionColumn, ...columns, ...(primaryActionColumn ? [primaryActionColumn] : [])],
    [columns, primaryActionColumn, selectionColumn],
  );
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
    enableRowSelection: true,
  });

  const selectedRows = table.getSelectedRowModel().flatRows;

  useEffect(() => {
    onSelectedRowsChange?.(selectedRows);
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
        {isDimmed ? (
          <button type="button" css={lvCss.tableDimmer} onClick={onDimmerClick} aria-label="검색창 포커스 해제" />
        ) : null}
        <div css={lvCss.tableWrapper}>
          <table css={lvCss.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} css={lvCss.tableHeadRow}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan} css={lvCss.tableHeaderCell}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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

                      rowEventHandlers?.onClick?.({ row, event, table });
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
      {hasRows && <PaginationSection<TData> table={table} />}
    </div>
  );
}
