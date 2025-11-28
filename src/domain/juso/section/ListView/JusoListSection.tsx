'use client';

import { useMemo, useState } from 'react';
import type { Row } from '@tanstack/react-table';

import { ListSection, type ListViewSortProps } from '@/common/lv/component';
import { ToolbarLayout } from '@/common/lv/layout';
import type { JusoListItem } from '@/domain/juso/api';
import { cssObj } from './styles';
import type { JusoListSectionProps } from './useJusoListViewSections';

export type JusoListSectionComponentProps = JusoListSectionProps & {
  sortOptions: { label: string; value: string }[];
};

function createRowEventHandlers(
  handlers: JusoListSectionProps['handlers'],
): NonNullable<Parameters<typeof ListSection<JusoListItem>>[0]['rowEventHandlers']> {
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
  isCreating,
  handlers,
  sortOptions,
}: JusoListSectionComponentProps) {
  const rowEventHandlers = useMemo(() => createRowEventHandlers(handlers), [handlers]);
  const sortValue = sortByOption ?? '';
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

  const handleSelectedRowsChange = (rows: Row<JusoListItem>[]) => {
    if (rows.length > 0) {
      handlers.onStopCreate();
    }
    handlers.onSelectedJusosChange(rows.map((row) => row.original));
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
        search={{ value: searchTerm, onChange: handlers.onSearchChange, placeholder: '주소 이름으로 검색' }}
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
        loadingMessage="주소 데이터를 불러오는 중입니다..."
        emptyMessage="조건에 맞는 주소가 없습니다. 검색어나 정렬을 조정해 보세요."
        primaryAction={{ label: '새 주소 추가', onClick: handlers.onAddClick, disabled: isCreating }}
        isDimmed={isSearchFocused}
        rowEventHandlers={rowEventHandlers}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDimmerClick={handleDimmerClick}
      />
    </section>
  );
}
