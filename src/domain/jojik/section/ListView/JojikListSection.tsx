'use client';

import { useMemo, type ReactNode } from 'react';
import type { Row } from '@tanstack/react-table';

import { Button } from '@/common/components';
import {
  ListViewTemplate,
  type ListViewTemplateRenderContext,
  type ListViewTemplateRowEventHandlers,
} from '@/common/list-view';
import type { JojikListItem } from '@/domain/jojik/api';
import type { JojikListSectionProps } from '@/domain/jojik/section';

import type { CreatedAtFilterValue } from './constants';

export type JojikListSectionComponentProps = JojikListSectionProps & {
  createdAtFilterOptions: { label: string; value: CreatedAtFilterValue }[];
  sortOptions: { label: string; value: string }[];
  pageSizeOptions: number[];
};

const CLEAR_SELECTION_THRESHOLD = 0;

function renderSelectionActions(
  handlers: JojikListSectionProps['handlers'],
): (context: ListViewTemplateRenderContext<JojikListItem>) => ReactNode {
  function SelectionActions({
    selectedRows,
  }: ListViewTemplateRenderContext<JojikListItem>): ReactNode {
    if (selectedRows.length <= CLEAR_SELECTION_THRESHOLD) {
      return null;
    }

    return (
      <Button styleType="text" variant="secondary" size="small" onClick={handlers.onClearSelection}>
        선택 해제 ({selectedRows.length})
      </Button>
    );
  }

  return SelectionActions;
}

function createRowEventHandlers(
  handlers: JojikListSectionProps['handlers'],
): ListViewTemplateRowEventHandlers<JojikListItem> {
  return {
    selectOnClick: true,
    onClick: () => {
      handlers.onStopCreate();
    },
  };
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
  currentCreatedFilter,
  handlers,
  sortOptions,
  createdAtFilterOptions,
  pageSizeOptions,
}: JojikListSectionComponentProps) {
  const toolbarActions = useMemo<
    (context: ListViewTemplateRenderContext<JojikListItem>) => ReactNode
  >(() => renderSelectionActions(handlers), [handlers]);

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
      loadingMessage="조직 데이터를 불러오는 중입니다..."
      emptyMessage="조건에 맞는 조직이 없습니다. 검색어나 필터를 조정해 보세요."
      search={{
        value: searchTerm,
        onChange: handlers.onSearchChange,
        placeholder: '조직 이름으로 검색',
      }}
      filters={[
        {
          key: 'createdAt',
          label: '생성일 필터',
          value: currentCreatedFilter,
          options: createdAtFilterOptions,
          onChange: (value) => handlers.onCreatedFilterChange(value as CreatedAtFilterValue),
        },
      ]}
      sort={{
        label: '정렬 기준',
        value: sortValue,
        options: sortOptions,
        onChange: handlers.onSortChange,
      }}
      toolbarActions={toolbarActions}
      primaryAction={{
        label: '새 조직 추가',
        onClick: handlers.onAddClick,
      }}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={handlers.onPageSizeChange}
      onSelectedRowsChange={(rows: Row<JojikListItem>[]) => {
        handlers.onSelectedJojiksChange(rows.map((row) => row.original));
      }}
      rowEventHandlers={rowEventHandlers}
    />
  );
}
