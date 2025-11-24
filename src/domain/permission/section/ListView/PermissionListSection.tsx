'use client';

import { useMemo, useState } from 'react';
import type { Row } from '@tanstack/react-table';

import { ListSection, type ListViewFilter, type ListViewSortProps } from '@/common/lv/component';
import { ToolbarLayout } from '@/common/lv/layout';
import type { Permission } from '@/domain/permission/api';

import type {
  PermissionFilters,
  PermissionListSectionProps,
} from './usePermissionListViewSections';
import { cssObj } from './styles';

const DEFAULT_FILTERS: PermissionFilters = {
  permissionTypeNanoIds: ['all'],
};

type PermissionListSectionComponentProps = PermissionListSectionProps & {
  sortOptions: { label: string; value: string }[];
  permissionTypeOptions: { label: string; value: string }[];
};

export function PermissionListSection({
  data,
  columns,
  state,
  isListLoading,
  searchTerm,
  sortByOption,
  filters,
  totalCount,
  totalPages,
  handlers,
  sortOptions,
  permissionTypeOptions,
  isAddUserEnabled,
}: PermissionListSectionComponentProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const effectiveFilters = filters ?? DEFAULT_FILTERS;
  const sortValue = sortByOption;

  const toolbarFilters: ListViewFilter[] = useMemo(
    () => [
      {
        key: 'permissionType',
        label: '권한 시스템',
        value: effectiveFilters.permissionTypeNanoIds,
        defaultValue: DEFAULT_FILTERS.permissionTypeNanoIds,
        options: permissionTypeOptions,
        onChange: handlers.onPermissionTypeFilterChange,
      },
    ],
    [
      effectiveFilters.permissionTypeNanoIds,
      handlers.onPermissionTypeFilterChange,
      permissionTypeOptions,
    ],
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
    }),
    [],
  );

  const handleSelectedRowsChange = (rows: Row<Permission>[]) => {
    handlers.onSelectedPermissionsChange(rows.map((row) => row.original));
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
          placeholder: '권한 이름으로 검색',
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
        primaryAction={{
          label: '사용자 추가',
          onClick: handlers.onAddUsersClick,
          disabled: !isAddUserEnabled,
        }}
        manualPagination
        manualSorting
        pageCount={totalPages}
        isLoading={isListLoading}
        loadingMessage="권한 데이터를 불러오는 중입니다..."
        emptyMessage="조건에 맞는 권한이 없습니다. 검색어나 필터를 조정해 보세요."
        isDimmed={isSearchFocused}
        rowEventHandlers={rowEventHandlers}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDimmerClick={handleDimmerClick}
      />
    </section>
  );
}
