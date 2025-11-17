'use client';

import { useMemo } from 'react';
import type { Row } from '@tanstack/react-table';

import { Button, Checkbox, Textfield } from '@/common/components';
import { ListViewTemplate, type ListViewTemplateRowEventHandlers } from '@/common/list-view';
import type { Permission } from '@/domain/permission/api';

import type { PermissionListSectionProps } from './usePermissionListViewSections';
import { permissionListViewCss } from './styles';

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
    <div css={permissionListViewCss.addUserContainer}>
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

      {isAddUserPopupOpen ? (
        <div css={permissionListViewCss.addUserPopup}>
          <div css={permissionListViewCss.panelHeader}>
            <h3 css={permissionListViewCss.panelTitle}>사용자 추가</h3>
            <p css={permissionListViewCss.panelSubtitle}>기관 내 사용자를 선택하여 권한에 연결합니다.</p>
          </div>
          <div css={permissionListViewCss.panelSection}>
            <Textfield
              placeholder="검색은 아직 지원되지 않습니다"
              value=""
              readOnly
              singleLine
            />
            <div css={permissionListViewCss.listBox}>
              {availableSayongjas.map((user) => (
                <label key={user.nanoId} css={permissionListViewCss.listRow}>
                  <Checkbox
                    checked={addUserSelection.has(user.nanoId)}
                    onChange={() => onToggleSayongjaSelection(user.nanoId)}
                  />{' '}
                  {user.name}
                </label>
              ))}
              {availableSayongjas.length === 0 ? (
                <p css={permissionListViewCss.helperText}>불러올 수 있는 사용자가 없습니다.</p>
              ) : null}
            </div>
          </div>
          <div css={permissionListViewCss.popupActions}>
            <Button variant="secondary" onClick={() => handlers.onAddUsersClick()}>
              닫기
            </Button>
            <Button onClick={onApplyAddUsers} disabled={addUserSelection.size === 0}>
              추가
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
