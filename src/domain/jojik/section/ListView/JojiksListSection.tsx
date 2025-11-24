'use client';

import { useMemo, useState } from 'react';
import type { Row } from '@tanstack/react-table';

import {
  ListSection,
  ToolbarSection,
  type ListViewFilter,
  type ListViewSortProps,
} from '@/common/lv/component';
import { cssObj } from './styles';
import type { JojikListSectionProps } from './useJojikListViewSections';
import type { CreatedAtFilterValue } from './constants';
import type { JojikListItem } from '@/domain/jojik/api';

export type JojikListSectionComponentProps = JojikListSectionProps & {
  sortOptions: { label: string; value: string }[];
  createdAtFilterOptions: { label: string; value: CreatedAtFilterValue }[];
};

const DEFAULT_CREATED_FILTER = ['all'];

export function JojiksListSection({
  data,
  columns,
  state,
  isListLoading,
  totalCount,
  totalPages,
  searchTerm,
  sortByOption,
  currentCreatedFilter,
  isCreating,
  handlers,
  sortOptions,
  createdAtFilterOptions,
}: JojikListSectionComponentProps) {
  const sortValue = sortByOption;
  const createdFilterValue = currentCreatedFilter ?? 'all';
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const toolbarFilters: ListViewFilter[] = useMemo(
    () => [
      {
        key: 'createdAt',
        label: '생성일',
        value: [createdFilterValue],
        defaultValue: DEFAULT_CREATED_FILTER,
        options: createdAtFilterOptions,
        onChange: (value) =>
          handlers.onCreatedFilterChange((value[0] as typeof createdFilterValue) ?? 'all'),
      },
    ],
    [createdAtFilterOptions, createdFilterValue, handlers],
  );

  const sortProps: ListViewSortProps = useMemo(
    () => ({
      label: '정렬 기준',
      value: sortValue,
      placeholder: '정렬 기준',
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

  const handleSelectedRowsChange = (rows: Row<JojikListItem>[]) => {
    if (rows.length > 0) {
      handlers.onStopCreate();
    }
    handlers.onSelectedJojiksChange(rows.map((row) => row.original));
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
        search={{
          value: searchTerm,
          onChange: handlers.onSearchChange,
          placeholder: '조직 이름으로 검색',
        }}
        filters={toolbarFilters}
        sort={sortProps}
        totalCount={totalCount}
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
        loadingMessage="조직 데이터를 불러오는 중입니다..."
        emptyMessage="조건에 맞는 조직이 없습니다. 검색어나 필터를 조정해 보세요."
        primaryAction={{ label: '조직 추가', onClick: handlers.onAddClick, disabled: isCreating }}
        isDimmed={isSearchFocused}
        rowEventHandlers={rowEventHandlers}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDimmerClick={handleDimmerClick}
      />
    </section>
  );
}
