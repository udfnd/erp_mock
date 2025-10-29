import { ReactNode } from 'react';

import { Checkbox } from '@/components/Checkbox';

import * as styles from './listViewTable.css';

export type ListViewColumn<T> = {
  id: string;
  header: ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render: (row: T, rowIndex: number) => ReactNode;
};

export type ListViewTableProps<T> = {
  columns: Array<ListViewColumn<T>>;
  rows: T[];
  getRowId: (row: T) => string;
  selectedRowIds?: string[];
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRowIds: string[]) => void;
  disabledRowIds?: string[];
};

export function ListViewTable<T>({
  columns,
  rows,
  getRowId,
  selectedRowIds = [],
  onRowClick,
  onSelectionChange,
  disabledRowIds = [],
}: ListViewTableProps<T>) {
  const disabledSet = new Set(disabledRowIds);
  const selectedSet = new Set(selectedRowIds);

  const allSelectableRowIds = rows
    .map((row) => getRowId(row))
    .filter((id) => !disabledSet.has(id));

  const isAllSelected =
    allSelectableRowIds.length > 0 &&
    allSelectableRowIds.every((id) => selectedSet.has(id));

  const isIndeterminate =
    selectedSet.size > 0 && !isAllSelected && selectedSet.size < allSelectableRowIds.length;

  const handleToggleAll = () => {
    if (!onSelectionChange) return;
    if (isAllSelected) {
      const remaining = selectedRowIds.filter((id) => !allSelectableRowIds.includes(id));
      onSelectionChange(remaining);
    } else {
      const merged = Array.from(new Set([...selectedRowIds, ...allSelectableRowIds]));
      onSelectionChange(merged);
    }
  };

  const handleRowSelection = (row: T) => {
    if (!onSelectionChange) return;
    const rowId = getRowId(row);
    if (disabledSet.has(rowId)) return;

    const isSelected = selectedSet.has(rowId);
    if (isSelected) {
      onSelectionChange(selectedRowIds.filter((id) => id !== rowId));
    } else {
      onSelectionChange([...selectedRowIds, rowId]);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {onSelectionChange ? (
              <th className={styles.checkboxHeader}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleToggleAll}
                  ariaLabel="전체 선택"
                />
              </th>
            ) : null}
            {columns.map((column) => (
              <th
                key={column.id}
                className={styles.headerCell[column.align ?? 'left']}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className={styles.emptyRow}>
              <td
                className={styles.emptyCell}
                colSpan={columns.length + (onSelectionChange ? 1 : 0)}
              >
                표시할 조직이 없습니다.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const rowId = getRowId(row);
              const isSelected = selectedSet.has(rowId);
              const isDisabled = disabledSet.has(rowId);
              return (
                <tr
                  key={rowId}
                  className={styles.row({ selected: isSelected, disabled: isDisabled })}
                  onClick={() => {
                    if (disabledSet.has(rowId)) return;
                    onRowClick?.(row);
                    handleRowSelection(row);
                  }}
                >
                  {onSelectionChange ? (
                    <td
                      className={styles.checkboxCell}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleRowSelection(row)}
                        ariaLabel={`${columnHeaderText(columns[0]?.header)} 선택`}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={styles.cell[column.align ?? 'left']}
                      style={column.width ? { width: column.width } : undefined}
                    >
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function columnHeaderText(header?: ReactNode): string {
  if (typeof header === 'string') return header;
  if (typeof header === 'number') return String(header);
  return '항목';
}
