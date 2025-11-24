'use client';

import { useMemo, useState } from 'react';
import type { Row } from '@tanstack/react-table';

import { ListSection, type ListViewFilter, type ListViewSortProps } from '@/common/lv/component';
import { ToolbarLayout } from '@/common/lv/layout';
import type { OebuLinkListItem } from '@/domain/oebu-link/api';

import type { OebuLinkListSectionProps } from './useOebuLinkListViewSections';
import { cssObj } from './styles';

export type OebuLinkListSectionComponentProps = OebuLinkListSectionProps & {
  sortOptions: { label: string; value: string }[];
  pageSizeOptions: number[];
  iconFilterOptions: { label: string; value: string }[];
};

function createRowEventHandlers(
  handlers: OebuLinkListSectionProps['handlers'],
): NonNullable<Parameters<typeof ListSection<OebuLinkListItem>>[0]['rowEventHandlers']> {
  return {
    selectOnClick: true,
    onClick: () => {
      handlers.onStopCreate();
    },
  };
}

const DEFAULT_ICON_FILTERS = ['all'];

export function OebuLinkListSection({
  data,
  columns,
  state,
  isListLoading,
  pagination,
  searchTerm,
  sortByOption,
  iconFilters,
  totalCount,
  totalPages,
  isCreating,
  handlers,
  sortOptions,
  pageSizeOptions,
  iconFilterOptions,
}: OebuLinkListSectionComponentProps) {
  const rowEventHandlers = useMemo(() => createRowEventHandlers(handlers), [handlers]);
  const sortValue = sortByOption ?? sortOptions[0]?.value ?? '';
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const toolbarFilters = useMemo<ListViewFilter[]>(
    () => {
      const iconFilterValue = iconFilters.length ? iconFilters : DEFAULT_ICON_FILTERS;
      const pageSizeValue = pagination.pageSize ? [`${pagination.pageSize}`] : [];

      const iconFilter: ListViewFilter = {
        key: 'iconFilter',
        label: '아이콘',
        value: iconFilterValue,
        defaultValue: DEFAULT_ICON_FILTERS,
        options: iconFilterOptions,
        onChange: handlers.onIconFilterChange,
      };

      const pageSizeFilter: ListViewFilter = {
        key: 'pageSize',
        label: '페이지 크기',
        value: pageSizeValue,
        defaultValue: pageSizeOptions.length ? [`${pageSizeOptions[0]}`] : pageSizeValue,
        options: pageSizeOptions.map((size) => ({ label: `${size}개/페이지`, value: `${size}` })),
        onChange: (values) => {
          const parsed = Number(values.at(-1) ?? pagination.pageSize);
          const nextSize = Number.isFinite(parsed) ? parsed : pagination.pageSize;
          handlers.onPageSizeChange(nextSize);
        },
      };

      return [iconFilter, pageSizeFilter];
    },
    [handlers, iconFilterOptions, iconFilters, pageSizeOptions, pagination.pageSize],
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

  const handleSelectedRowsChange = (rows: Row<OebuLinkListItem>[]) => {
    if (rows.length > 0) {
      handlers.onStopCreate();
    }
    handlers.onSelectedLinksChange(rows.map((row) => row.original));
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
        search={{ value: searchTerm, onChange: handlers.onSearchChange, placeholder: '외부 링크 이름 검색' }}
        filters={toolbarFilters}
        sort={sortProps}
        totalCount={totalCount}
        onSearchFocusChange={setIsSearchFocused}
      />
      <ListSection
        data={data}
        columns={columns}
        state={state}
        primaryAction={{ label: '새 외부 링크 추가', onClick: handlers.onAddClick, disabled: isCreating }}
        manualPagination
        manualSorting
        pageCount={totalPages}
        isLoading={isListLoading}
        loadingMessage="외부 링크 데이터를 불러오는 중입니다..."
        emptyMessage="조건에 맞는 외부 링크가 없습니다. 검색어나 필터를 조정해 보세요."
        isDimmed={isSearchFocused}
        rowEventHandlers={rowEventHandlers}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDimmerClick={handleDimmerClick}
      />
    </section>
  );
}
