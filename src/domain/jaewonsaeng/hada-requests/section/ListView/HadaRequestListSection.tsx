'use client';

import { useMemo, useState } from 'react';
import type { Row } from '@tanstack/react-table';

import { ListSection, type ListViewSortProps } from '@/common/lv/component';
import { ToolbarLayout } from '@/common/lv/layout';

import { cssObj } from './styles';
import type { HadaRequestListSectionProps } from './useHadaRequestsListViewSections';
import type { JaewonSincheongListItem } from '@/domain/jaewon-sincheong/api';

export type HadaRequestListSectionComponentProps = HadaRequestListSectionProps & {
  sortOptions: { label: string; value: string }[];
};

export function HadaRequestListSection({
  data,
  state,
  isListLoading,
  sortByOption,
  totalCount,
  totalPages,
  isCreating,
  handlers,
  sortOptions,
  columns,
  searchTerm,
}: HadaRequestListSectionComponentProps) {
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

  const handleSelectedRowsChange = (rows: Row<JaewonSincheongListItem>[]) => {
    if (rows.length > 0) {
      handlers.onStopCreate();
    }
    handlers.onSelectedChange(rows.map((row) => row.original));
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
          placeholder: '이름으로 검색',
        }}
        filters={[]}
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
        loadingMessage="재원 신청 목록을 불러오는 중입니다..."
        emptyMessage="조건에 맞는 재원 신청이 없습니다."
        isDimmed={isSearchFocused}
        rowEventHandlers={rowEventHandlers}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDimmerClick={handleDimmerClick}
        primaryAction={{
          label: '신청 수동 등록',
          onClick: handlers.onAddClick,
          disabled: isCreating,
        }}
      />
    </section>
  );
}
