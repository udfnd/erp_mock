'use client';

import { useMemo, useState } from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { useGetPermissionTypesQuery } from '@/domain/system/api';
import { useGetPermissionsQuery } from '@/domain/permission/api';
import type { GetPermissionsRequest, Permission } from '@/domain/permission/api';

import {
  SORT_OPTIONS,
  columnHelper,
  getSortOptionFromState,
  getSortStateFromOption,
} from './constants';
import type { PermissionRightsidePanelsProps } from './PermissionRightsidePanels/statePanels';

export type PermissionListViewHookParams = {
  gigwanNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<Permission>;

export type PermissionFilters = {
  permissionTypeNanoIds: string[];
};

export type PermissionListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onPermissionTypeFilterChange: (value: string[]) => void;
  onSelectedPermissionsChange: (permissions: Permission[]) => void;
  onAddUsersClick: () => void;
};

export type PermissionListSectionProps = {
  data: Permission[];
  columns: ColumnDef<Permission, unknown>[];
  state: ListSectionState;
  isListLoading: boolean;
  pagination: ListSectionState['pagination'];
  searchTerm: string;
  sortByOption?: string;
  filters: PermissionFilters;
  totalCount: number;
  totalPages: number;
  handlers: PermissionListSectionHandlers;
  isAddUserEnabled: boolean;
};

export type UsePermissionListViewSectionsResult = {
  listSectionProps: PermissionListSectionProps;
  settingsSectionProps: PermissionRightsidePanelsProps;
  sortOptions: typeof SORT_OPTIONS;
  permissionTypeOptions: { label: string; value: string }[];
};

export function usePermissionListViewSections({
  gigwanNanoId,
  isAuthenticated,
}: PermissionListViewHookParams): UsePermissionListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<Permission>({
    initialSorting: getSortStateFromOption('nameAsc'),
    initialPagination: { pageIndex: 0, pageSize: 20 },
  });

  const setSortingWithReset: typeof baseState.setSorting = (updater) => {
    baseState.setSorting(updater);
    baseState.setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const listViewState: ListSectionState = {
    ...baseState,
    setSorting: setSortingWithReset,
  };

  const { sorting, pagination, setSorting, setPagination, setRowSelection } = listViewState;
  const sortByOption = getSortOptionFromState(sorting);

  const [filters, setFilters] = useState<PermissionFilters>({
    permissionTypeNanoIds: ['all'],
  });

  const { data: permissionTypesData } = useGetPermissionTypesQuery({ enabled: isAuthenticated });
  const permissionTypeOptions = useMemo(
    () => [
      { label: '전체 권한 시스템', value: 'all' },
      ...(permissionTypesData?.permissionTypes.map((item) => ({
        label: item.name,
        value: item.nanoId,
      })) ?? []),
    ],
    [permissionTypesData?.permissionTypes],
  );

  const permissionTypeFilters = filters.permissionTypeNanoIds.filter(
    (value) => value !== 'all' && value !== '',
  );

  const queryParams: GetPermissionsRequest = {
    gigwanNanoId,
    permissionNameSearch: searchTerm ? searchTerm : undefined,
    permissionTypeFilters: permissionTypeFilters.length ? permissionTypeFilters : undefined,
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortByOption,
  };

  const {
    data: permissionsData,
    isLoading: isListLoading,
    refetch,
  } = useGetPermissionsQuery(queryParams, {
    enabled: isAuthenticated && Boolean(gigwanNanoId),
  });

  const data = permissionsData?.permissions ?? [];
  const totalCount =
    (permissionsData?.paginationData?.totalItemCount as number | undefined) ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '권한 이름',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.type.name, {
        id: 'type',
        header: '시스템 타입',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.jojik?.name ?? '-', {
        id: 'jojik',
        header: '조직',
        cell: (info) => info.getValue(),
      }),
    ],
    [],
  ) as ColumnDef<Permission, unknown>[];

  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
  };

  const handlePermissionTypeFilterChange = (value: string[]) => {
    setFilters((prev) => ({ ...prev, permissionTypeNanoIds: value.length ? value : ['all'] }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleAfterMutation = async () => {
    await refetch();
    setRowSelection({});
    setSelectedPermissions([]);
  };

  const handleSelectedPermissionsChange = (items: Permission[]) => {
    setSelectedPermissions(items);
  };

  const listSectionProps: PermissionListSectionProps = {
    data,
    columns,
    state: listViewState,
    isListLoading,
    pagination: listViewState.pagination,
    searchTerm,
    sortByOption,
    filters,
    totalCount,
    totalPages,
    handlers: {
      onSearchChange: handleSearchChange,
      onSortChange: handleSortChange,
      onPermissionTypeFilterChange: handlePermissionTypeFilterChange,
      onSelectedPermissionsChange: handleSelectedPermissionsChange,
      onAddUsersClick: () => undefined,
    },
    isAddUserEnabled: selectedPermissions.length === 1,
  };

  const settingsSectionProps: PermissionRightsidePanelsProps = {
    gigwanNanoId,
    selectedPermissions,
    isAuthenticated,
    onAfterMutation: handleAfterMutation,
  };

  return {
    listSectionProps,
    settingsSectionProps,
    sortOptions: SORT_OPTIONS,
    permissionTypeOptions,
  };
}
