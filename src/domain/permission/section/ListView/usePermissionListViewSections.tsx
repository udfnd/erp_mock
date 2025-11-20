'use client';

import { useMemo, useState } from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { useGetPermissionTypesQuery } from '@/domain/system/api';
import {
  useBatchlinkPermissionSayongjaMutation,
  useGetPermissionsQuery,
  useGetPermissionSayongjasQuery,
} from '@/domain/permission/api';
import { useGetSayongjasQuery } from '@/domain/sayongja/api';
import type { GetPermissionsRequest, Permission } from '@/domain/permission/api';
import type { SayongjaListItem } from '@/domain/sayongja/api';

import {
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
  columnHelper,
  getSortOptionFromState,
  getSortStateFromOption,
} from './constants';

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
  onPageSizeChange: (size: number) => void;
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
  isAddUserPopupOpen: boolean;
  availableSayongjas: SayongjaListItem[];
  addUserSelection: Set<string>;
  onToggleSayongjaSelection: (nanoId: string) => void;
  onApplyAddUsers: () => Promise<void>;
};

export type PermissionSettingsSectionProps = {
  gigwanNanoId: string;
  selectedPermissions: Permission[];
  isAuthenticated: boolean;
  onAfterMutation: () => Promise<unknown> | void;
};

export type UsePermissionListViewSectionsResult = {
  listSectionProps: PermissionListSectionProps;
  settingsSectionProps: PermissionSettingsSectionProps;
  sortOptions: typeof SORT_OPTIONS;
  pageSizeOptions: typeof PAGE_SIZE_OPTIONS;
  permissionTypeOptions: { label: string; value: string }[];
};

export function usePermissionListViewSections({
  gigwanNanoId,
  isAuthenticated,
}: PermissionListViewHookParams): UsePermissionListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<Permission>({
    initialSorting: getSortStateFromOption('nameAsc'),
    initialPagination: { pageIndex: 0, pageSize: 10 },
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
  const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
  const [addUserSelection, setAddUserSelection] = useState<Set<string>>(new Set());

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

  const handlePageSizeChange = (size: number) => {
    setPagination({ pageIndex: 0, pageSize: size });
  };

  const handleAfterMutation = async () => {
    await refetch();
    setRowSelection({});
    setSelectedPermissions([]);
    setIsAddUserPopupOpen(false);
  };

  const handleSelectedPermissionsChange = (items: Permission[]) => {
    setSelectedPermissions(items);
    setAddUserSelection(new Set());
    if (items.length !== 1) {
      setIsAddUserPopupOpen(false);
    }
  };

  const clearAddUser = () => {
    setIsAddUserPopupOpen(false);
    setAddUserSelection(new Set());
  };

  const { data: sayongjasData } = useGetSayongjasQuery(
    {
      gigwanNanoId,
      pageNumber: 1,
      pageSize: 50,
    },
    {
      enabled: isAuthenticated && Boolean(gigwanNanoId) && isAddUserPopupOpen,
    },
  );
  const availableSayongjas = sayongjasData?.sayongjas ?? [];

  const selectedPermissionNanoId =
    selectedPermissions.length === 1 ? selectedPermissions[0].nanoId : '';
  const { refetch: refetchPermissionSayongjas } = useGetPermissionSayongjasQuery(
    selectedPermissionNanoId,
    {
      enabled: false,
    },
  );

  const batchlinkMutation = useBatchlinkPermissionSayongjaMutation(selectedPermissionNanoId);
  const handleApplyAddUsers = async () => {
    if (!selectedPermissionNanoId || addUserSelection.size === 0) return;
    await batchlinkMutation.mutateAsync({
      sayongjas: Array.from(addUserSelection).map((nanoId) => ({ nanoId })),
    });
    await refetchPermissionSayongjas();
    clearAddUser();
    await handleAfterMutation();
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
      onPageSizeChange: handlePageSizeChange,
      onSelectedPermissionsChange: handleSelectedPermissionsChange,
      onAddUsersClick: () => setIsAddUserPopupOpen((prev) => !prev),
    },
    isAddUserEnabled: selectedPermissions.length === 1,
    isAddUserPopupOpen,
    availableSayongjas,
    addUserSelection,
    onToggleSayongjaSelection: (nanoId: string) => {
      setAddUserSelection((prev) => {
        const next = new Set(prev);
        if (next.has(nanoId)) {
          next.delete(nanoId);
        } else {
          next.add(nanoId);
        }
        return next;
      });
    },
    onApplyAddUsers: handleApplyAddUsers,
  };

  const settingsSectionProps: PermissionSettingsSectionProps = {
    gigwanNanoId,
    selectedPermissions,
    isAuthenticated,
    onAfterMutation: handleAfterMutation,
  };

  return {
    listSectionProps,
    settingsSectionProps,
    sortOptions: SORT_OPTIONS,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    permissionTypeOptions,
  };
}
