'use client';

import { useMemo, useState } from 'react';
import type { Row } from '@tanstack/react-table';

import { ListSection, type ListViewSortProps } from '@/common/lv/component';
import { ToolbarLayout } from '@/common/lv/layout';
import type { JojikMunuiListSectionProps } from './useJojikMunuiListViewSections';
import type { JojikMunuiListItem } from '../../api';
import { cssObj } from './styles';

export type JojikMunuiListSectionComponentProps = JojikMunuiListSectionProps & {
  sortOptions: { label: string; value: string }[];
};

export function JojikMunuiListSection({
  data,
  state,
  isListLoading,
  pagination,
  searchTerm,
  sortByOption,
  totalCount,
  totalPages,
  handlers,
  sortOptions,
  columns,
}: JojikMunuiListSectionComponentProps) {
  const sortValue = sortByOption;
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  const handleSelectedRowsChange = (rows: Row<JojikMunuiListItem>[]) => {
    if (rows.length > 0) {
      handlers.onStopCreate();
    }
    handlers.onSelectedJojikMunuisChange(rows.map((row) => row.original));
  };

  const handleDimmerClick = () => {
    setIsSearchFocused(false);
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <section css={cssObj.listSection}>
      <ToolbarLayout
        search={{
          value: searchTerm,
          onChange: handlers.onSearchChange,
          placeholder: '문의 제목으로 검색',
        }}
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
        loadingMessage="조직 문의 데이터를 불러오는 중입니다..."
        emptyMessage="조건에 맞는 문의가 없습니다. 검색어를 조정해 보세요."
        isDimmed={isSearchFocused}
        rowEventHandlers={rowEventHandlers}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDimmerClick={handleDimmerClick}
      />
    </section>
  );
}
