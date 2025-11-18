'use client';

import { useMemo } from 'react';
import type { Row } from '@tanstack/react-table';

import { ListViewTemplate, type ListViewTemplateRowEventHandlers } from '@/common/list-view';
import type { Permission } from '@/domain/permission/api';

import type { PermissionListSectionProps } from './usePermissionListViewSections';

function createRowEventHandlers(
  handlers: PermissionListSectionProps['handlers'],
): ListViewTemplateRowEventHandlers<Permission> {
  return {
    selectOnClick: true,
    onClick: () => {
      /* no-op, row selection is handled by ListViewTemplate */
    },
  };
}

export function PermissionListSection({
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
  handlers,
  sortOptions,
  pageSizeOptions,
  permissionTypeOptions,
  isAddUserEnabled,
  isAddUserPopupOpen,
  availableSayongjas,
  addUserSelection,
  onToggleSayongjaSelection,
  onApplyAddUsers,
}: PermissionListSectionProps & {
  sortOptions: { label: string; value: string }[];
  pageSizeOptions: number[];
  permissionTypeOptions: { label: string; value: string }[];
}) {
  const rowEventHandlers = useMemo(() => createRowEventHandlers(handlers), [handlers]);

  const effectiveFilters = filters ?? { permissionTypeNanoId: 'all' };
  const sortValue = sortByOption ?? sortOptions[0]?.value ?? '';

  return (
    <ListViewTemplate
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
      loadingMessage="권한 데이터를 불러오는 중입니다..."
      emptyMessage="조건에 맞는 권한이 없습니다. 검색어나 필터를 조정해 보세요."
      search={{
        value: searchTerm,
        onChange: handlers.onSearchChange,
        placeholder: '권한 이름으로 검색',
      }}
      filters={[
        {
          key: 'permissionType',
          label: '권한 시스템',
          value: effectiveFilters.permissionTypeNanoId,
          options: permissionTypeOptions,
          onChange: handlers.onPermissionTypeFilterChange,
        },
      ]}
      sort={{
        label: '정렬 기준',
        value: sortValue,
        options: sortOptions,
        onChange: handlers.onSortChange,
      }}
      primaryAction={{
        label: '사용자 추가',
        onClick: handlers.onAddUsersClick,
        disabled: !isAddUserEnabled,
      }}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={handlers.onPageSizeChange}
      onSelectedRowsChange={(rows: Row<Permission>[]) => {
        handlers.onSelectedPermissionsChange(rows.map((row) => row.original));
      }}
      rowEventHandlers={rowEventHandlers}
    />
  );
}
