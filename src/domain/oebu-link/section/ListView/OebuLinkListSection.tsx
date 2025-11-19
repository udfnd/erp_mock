'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Row } from '@tanstack/react-table';

import { Template, type ListViewTemplateRowEventHandlers } from '@/common/lv';
import type { OebuLinkListItem } from '@/domain/oebu-link/api';

import type { OebuLinkListSectionProps } from './useOebuLinkListViewSections';
import { oebuLinkListViewCss } from './styles';

export type OebuLinkListSectionComponentProps = OebuLinkListSectionProps & {
  sortOptions: { label: string; value: string }[];
  pageSizeOptions: number[];
  iconFilterOptions: { label: string; value: string }[];
};

function createRowEventHandlers(
  handlers: OebuLinkListSectionProps['handlers'],
): ListViewTemplateRowEventHandlers<OebuLinkListItem> {
  return {
    selectOnClick: true,
    onClick: () => {
      handlers.onStopCreate();
    },
  };
}

function IconFilterChips({
  iconFilterOptions,
  iconFilters,
  onChange,
}: {
  iconFilterOptions: { label: string; value: string }[];
  iconFilters: string[];
  onChange: (values: string[]) => void;
}) {
  const [localSelection, setLocalSelection] = useState<string[]>(iconFilters);

  useEffect(() => {
    setLocalSelection(iconFilters);
  }, [iconFilters]);

  const toggle = (value: string) => {
    setLocalSelection((prev) => {
      if (value === 'all') {
        onChange([]);
        return [];
      }

      const next = prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value];
      onChange(next);
      return next;
    });
  };

  return (
    <div css={oebuLinkListViewCss.iconFilterRow}>
      {iconFilterOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={localSelection.includes(option.value) ? 'active' : ''}
          css={oebuLinkListViewCss.chip}
          onClick={() => toggle(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

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
      loadingMessage="외부 링크 데이터를 불러오는 중입니다..."
      emptyMessage="조건에 맞는 외부 링크가 없습니다. 검색어나 필터를 조정해 보세요."
      search={{
        value: searchTerm,
        onChange: handlers.onSearchChange,
        placeholder: '외부 링크 이름 검색',
      }}
      sort={{
        label: '정렬 기준',
        value: sortValue,
        options: sortOptions,
        onChange: handlers.onSortChange,
      }}
      primaryAction={{
        label: '새 외부 링크 추가',
        onClick: handlers.onAddClick,
      }}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={handlers.onPageSizeChange}
      onSelectedRowsChange={(rows: Row<OebuLinkListItem>[]) => {
        if (rows.length > 0) {
          handlers.onStopCreate();
        }
        handlers.onSelectedLinksChange(rows.map((row) => row.original));
      }}
      rowEventHandlers={rowEventHandlers}
      toolbarActions={
        iconFilterOptions.length > 0
          ? () => (
              <IconFilterChips
                iconFilterOptions={iconFilterOptions}
                iconFilters={iconFilters}
                onChange={handlers.onIconFilterChange}
              />
            )
          : undefined
      }
    />
  );
}
