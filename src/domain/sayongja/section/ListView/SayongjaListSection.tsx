'use client';

import { useMemo } from 'react';
import type { Row } from '@tanstack/react-table';

import { Template, type ListViewTemplateRowEventHandlers } from '@/common/lv';
import type { SayongjaListItem } from '@/domain/sayongja/api';
import type { SayongjaListSectionProps } from './useSayongjaListViewSections';

export type SayongjaListSectionComponentProps = SayongjaListSectionProps & {
  sortOptions: { label: string; value: string }[];
  pageSizeOptions: number[];
  isHwalseongFilterOptions: { label: string; value: string }[];
  jojikFilterOptions: { label: string; value: string }[];
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
};

function createRowEventHandlers(
  handlers: SayongjaListSectionProps['handlers'],
): ListViewTemplateRowEventHandlers<SayongjaListItem> {
  return {
    selectOnClick: true,
    onClick: () => {
      handlers.onClearCreate();
    },
  };
}

export function SayongjaListSection({
  data,
  columns,
  state,
  isListLoading,
  totalCount,
  totalPages,
  searchTerm,
  sortByOption,
  filters,
  handlers,
  sortOptions,
  pageSizeOptions,
  isHwalseongFilterOptions,
  jojikFilterOptions,
  employmentCategoryOptions,
  workTypeOptions,
}: SayongjaListSectionComponentProps) {
  const rowEventHandlers = useMemo(() => createRowEventHandlers(handlers), [handlers]);

  const sortValue = sortByOption ?? sortOptions[0]?.value ?? '';
  const isHwalseongFilterValue = filters.isHwalseong === 'all' ? [] : [filters.isHwalseong];

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
      sort={{
        label: '정렬 기준',
        value: sortValue,
        options: sortOptions,
        onChange: handlers.onSortChange,
      }}
      filters={[
        {
          key: 'jojikFilters',
          label: '조직',
          value: filters.jojikNanoIds,
          defaultValue: ['all'],
          placeholder: '조직을 선택하세요',
          options: jojikFilterOptions,
          onChange: handlers.onJojikFilterChange,
        },
        {
          key: 'employmentCategoryFilters',
          label: '고용 구분',
          value: filters.employmentCategoryNanoIds,
          defaultValue: ['all'],
          placeholder: '고용 구분 선택',
          options: employmentCategoryOptions,
          onChange: handlers.onEmploymentCategoryFilterChange,
        },
        {
          key: 'workTypeFilters',
          label: '근무 형태',
          value: filters.workTypeNanoIds,
          defaultValue: ['all'],
          placeholder: '근무 형태 선택',
          options: workTypeOptions,
          onChange: handlers.onWorkTypeFilterChange,
        },
        {
          key: 'isHwalseong',
          label: '활성 여부',
          value: isHwalseongFilterValue,
          defaultValue: ['all'],
          placeholder: '활성 상태 선택',
          options: isHwalseongFilterOptions,
          onChange: (value) => handlers.onIsHwalseongFilterChange(value[0] ?? 'all'),
        },
      ]}
      primaryAction={{
        label: '사용자 추가',
        onClick: handlers.onStartCreate,
      }}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={handlers.onPageSizeChange}
      onSelectedRowsChange={(rows: Row<SayongjaListItem>[]) => {
        if (rows.length > 0) {
          handlers.onClearCreate();
        }
        handlers.onSelectedSayongjasChange(rows.map((row) => row.original));
      }}
      rowEventHandlers={rowEventHandlers}
    />
  );
}
