'use client';

import { useMemo } from 'react';
import type { Row } from '@tanstack/react-table';

import { ListViewTemplate, type ListViewTemplateRowEventHandlers } from '@/common/list-view';
import type { JusoListItem } from '@/domain/juso/api';
import type { JusoListSectionProps } from './useJusoListViewSections';

export type JusoListSectionComponentProps = JusoListSectionProps & {
  sortOptions: { label: string; value: string }[];
  pageSizeOptions: number[];
};

function createRowEventHandlers(
  handlers: JusoListSectionProps['handlers'],
): ListViewTemplateRowEventHandlers<JusoListItem> {
  return {
    selectOnClick: true,
    onClick: () => {
      handlers.onStopCreate();
    },
  };
}

export function JusoListSection({
  data,
  columns,
  state,
  isListLoading,
  totalCount,
  totalPages,
  searchTerm,
  sortByOption,
  handlers,
  sortOptions,
  pageSizeOptions,
}: JusoListSectionComponentProps) {
  const rowEventHandlers = useMemo(() => createRowEventHandlers(handlers), [handlers]);

  const sortValue = sortByOption ?? sortOptions[0]?.value ?? '';

  return (
    <ListViewTemplate
      data={data}
      columns={columns}
      state={state}
      manualPagination
      manualSorting
      pageCount={totalPages}
      enableRowSelection
      autoResetPageIndex={false}
      autoResetExpanded={false}
      isLoading={isListLoading}
      totalCount={totalCount}
      loadingMessage="주소 데이터를 불러오는 중입니다..."
      emptyMessage="조건에 맞는 주소가 없습니다. 검색어나 정렬을 조정해 보세요."
      search={{
        value: searchTerm,
        onChange: handlers.onSearchChange,
        placeholder: '주소 이름으로 검색',
      }}
      sort={{
        label: '정렬 기준',
        value: sortValue,
        options: sortOptions,
        onChange: handlers.onSortChange,
      }}
      primaryAction={{
        label: '새 주소 추가',
        onClick: handlers.onAddClick,
      }}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={handlers.onPageSizeChange}
      onSelectedRowsChange={(rows: Row<JusoListItem>[]) => {
        handlers.onStopCreate();
        handlers.onSelectedJusosChange(rows.map((row) => row.original));
      }}
      rowEventHandlers={rowEventHandlers}
    />
  );
}
