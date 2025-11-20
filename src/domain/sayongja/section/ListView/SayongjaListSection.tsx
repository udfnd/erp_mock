'use client';

import { useMemo } from 'react';
import type { Row } from '@tanstack/react-table';

import { Template, type ListViewTemplateRowEventHandlers } from '@/common/lv';
import type { SayongjaListSectionProps } from './useSayongjaListViewSections';
import type { SayongjaFilters } from './useSayongjaListViewSections';
import type { SayongjaListItem } from '@/domain/sayongja/api';

export type SayongjaListSectionComponentProps = SayongjaListSectionProps & {
  sortOptions: { label: string; value: string }[];
  pageSizeOptions: number[];
  jojikFilterOptions: { label: string; value: string }[];
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
  isHwalseongFilterOptions: { label: string; value: string }[];
};

function createRowEventHandlers(
  handlers: SayongjaListSectionProps['handlers'],
): ListViewTemplateRowEventHandlers<SayongjaListItem> {
  return {
    selectOnClick: true,
    onClick: () => {
      handlers.onStopCreate();
    },
  };
}

const DEFAULT_FILTERS: SayongjaFilters = {
  jojikNanoId: 'all',
  employmentCategoryNanoId: 'all',
  workTypeNanoId: 'all',
  isHwalseong: 'all',
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
  const rowEventHandlers = useMemo(() => createRowEventHandlers(handlers), [handlers]);

  const sortValue = sortByOption ?? sortOptions[0]?.value ?? '';
  const effectiveFilters = filters ?? DEFAULT_FILTERS;

  return (
    <Template
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
      loadingMessage="사용자 데이터를 불러오는 중입니다..."
      emptyMessage="조건에 맞는 사용자가 없습니다. 검색어나 필터를 조정해 보세요."
      search={{
        value: searchTerm,
        onChange: handlers.onSearchChange,
        placeholder: '사용자 이름으로 검색',
      }}
      filters={[
        {
          key: 'jojik',
          label: '권한을 가지는 조직',
          value: effectiveFilters.jojikNanoId,
          defaultValue: DEFAULT_FILTERS.jojikNanoId,
          options: jojikFilterOptions,
          onChange: handlers.onJojikFilterChange,
        },
        {
          key: 'employment',
          label: '재직 상태',
          value: effectiveFilters.employmentCategoryNanoId,
          defaultValue: DEFAULT_FILTERS.employmentCategoryNanoId,
          options: employmentCategoryOptions,
          onChange: handlers.onEmploymentCategoryFilterChange,
        },
        {
          key: 'workType',
          label: '근무 형태',
          value: effectiveFilters.workTypeNanoId,
          defaultValue: DEFAULT_FILTERS.workTypeNanoId,
          options: workTypeOptions,
          onChange: handlers.onWorkTypeFilterChange,
        },
        {
          key: 'isHwalseong',
          label: '활성 여부',
          value: effectiveFilters.isHwalseong,
          defaultValue: DEFAULT_FILTERS.isHwalseong,
          options: isHwalseongFilterOptions,
          onChange: handlers.onIsHwalseongFilterChange,
        },
      ]}
      sort={{
        label: '정렬 기준',
        value: sortValue,
        options: sortOptions,
        onChange: handlers.onSortChange,
      }}
      primaryAction={{
        label: '새 사용자 추가',
        onClick: handlers.onAddClick,
      }}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={handlers.onPageSizeChange}
      onSelectedRowsChange={(rows: Row<SayongjaListItem>[]) => {
        if (rows.length > 0) {
          handlers.onStopCreate();
        }
        handlers.onSelectedSayongjasChange(rows.map((row) => row.original));
      }}
      rowEventHandlers={rowEventHandlers}
    />
  );
}
