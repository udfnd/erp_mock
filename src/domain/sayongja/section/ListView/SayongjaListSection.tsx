'use client';

import { useMemo, useState } from 'react';
import type { Row } from '@tanstack/react-table';

import {
  ListSection,
  ToolbarSection,
  type ListViewFilter,
  type ListViewSortProps,
} from './components';
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
  const sortValue = sortByOption ?? sortOptions[0]?.value ?? '';
  const effectiveFilters = filters ?? DEFAULT_FILTERS;
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const toolbarFilters: ListViewFilter[] = useMemo(
    () => [
      {
        key: 'jojik',
        label: '권한을 가지는 조직',
        value: effectiveFilters.jojikNanoIds,
        defaultValue: DEFAULT_FILTERS.jojikNanoIds,
        options: jojikFilterOptions,
        onChange: handlers.onJojikFilterChange,
      },
      {
        key: 'employment',
        label: '재직 상태',
        value: effectiveFilters.employmentCategoryNanoIds,
        defaultValue: DEFAULT_FILTERS.employmentCategoryNanoIds,
        options: employmentCategoryOptions,
        onChange: handlers.onEmploymentCategoryFilterChange,
      },
      {
        key: 'workType',
        label: '근무 형태',
        value: effectiveFilters.workTypeNanoIds,
        defaultValue: DEFAULT_FILTERS.workTypeNanoIds,
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
    ],
    [
      effectiveFilters.employmentCategoryNanoIds,
      effectiveFilters.isHwalseong,
      effectiveFilters.jojikNanoIds,
      effectiveFilters.workTypeNanoIds,
      employmentCategoryOptions,
      handlers.onEmploymentCategoryFilterChange,
      handlers.onIsHwalseongFilterChange,
      handlers.onJojikFilterChange,
      handlers.onWorkTypeFilterChange,
      isHwalseongFilterOptions,
      jojikFilterOptions,
      workTypeOptions,
    ],
  );

  const sortProps: ListViewSortProps = useMemo(
    () => ({
      label: '정렬 기준',
      value: sortValue,
      options: sortOptions,
      onChange: handlers.onSortChange,
    }),
    [handlers.onSortChange, sortOptions, sortValue],
  );

  const rowEventHandlers = useMemo(
    () => ({
      selectOnClick: true,
      onClick: () => {
        handlers.onStopCreate();
      },
    }),
    [handlers],
  );

  const handleSelectedRowsChange = (rows: Row<SayongjaListItem>[]) => {
    if (rows.length > 0) {
      handlers.onStopCreate();
    }
    handlers.onSelectedSayongjasChange(rows.map((row) => row.original));
  };

  const handleDimmerClick = () => {
    setIsSearchFocused(false);
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <section css={cssObj.listSection}>
      <ToolbarSection
        search={{ value: searchTerm, onChange: handlers.onSearchChange, placeholder: '사용자 이름으로 검색' }}
        filters={toolbarFilters}
        sort={sortProps}
        pageSizeOptions={pageSizeOptions}
        pageSize={pagination.pageSize}
        onPageSizeChange={handlers.onPageSizeChange}
        totalCount={totalCount}
        primaryAction={{ label: '새 사용자 추가', onClick: handlers.onAddClick, disabled: isCreating }}
        onSearchFocusChange={setIsSearchFocused}
      />
      <ListSection
        data={data}
        columns={columns}
        state={state}
        manualPagination
        manualSorting
        pageCount={totalPages}
        isLoading={isListLoading}
        loadingMessage="사용자 데이터를 불러오는 중입니다..."
        emptyMessage="조건에 맞는 사용자가 없습니다. 검색어나 필터를 조정해 보세요."
        isDimmed={isSearchFocused}
        rowEventHandlers={rowEventHandlers}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDimmerClick={handleDimmerClick}
      />
    </section>
  );
}
