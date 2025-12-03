'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import {
  useGetJaewonSincheongsQuery,
  type GetJaewonSincheongsRequest,
  type JaewonSincheongListItem,
} from '@/domain/jaewon-sincheong/api';

import { SORT_OPTIONS, columnHelper, formatDateTime, getSortOptionFromState, getSortStateFromOption } from './constants';

export type HadaRequestListViewHookParams = {
  jojikNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<JaewonSincheongListItem>;

export type HadaRequestListSectionHandlers = {
  onSortChange: (value: string) => void;
  onSelectedChange: (requests: JaewonSincheongListItem[]) => void;
  onAddClick: () => void;
  onStopCreate: () => void;
};

export type HadaRequestListSectionProps = {
  data: JaewonSincheongListItem[];
  columns: ColumnDef<JaewonSincheongListItem, unknown>[];
  state: ListSectionState;
  isListLoading: boolean;
  pagination: ListSectionState['pagination'];
  sortByOption?: string;
  totalCount: number;
  totalPages: number;
  isCreating: boolean;
  handlers: HadaRequestListSectionHandlers;
};

export type HadaRequestRightsidePanelsProps = {
  jojikNanoId: string;
  selectedRequests: JaewonSincheongListItem[];
  isCreating: boolean;
  onStartCreate: () => void;
  onExitCreate: () => void;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export type UseHadaRequestListViewSectionsResult = {
  listSectionProps: HadaRequestListSectionProps;
  settingsSectionProps: HadaRequestRightsidePanelsProps;
  sortOptions: typeof SORT_OPTIONS;
};

export function useHadaRequestListViewSections({
  jojikNanoId,
  isAuthenticated,
}: HadaRequestListViewHookParams): UseHadaRequestListViewSectionsResult {
  const baseState = useListViewState<JaewonSincheongListItem>({
    initialSorting: getSortStateFromOption('createdAtDesc'),
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

  const [isCreating, setIsCreating] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState<JaewonSincheongListItem[]>([]);

  const queryParams: GetJaewonSincheongsRequest = {
    jojikNanoId,
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortByOption,
  };

  const {
    data: requestData,
    isLoading: isListLoading,
    refetch,
  } = useGetJaewonSincheongsQuery(queryParams, { enabled: isAuthenticated && Boolean(jojikNanoId) });

  const data = requestData?.jaewonSincheongs ?? [];
  const totalCount = (requestData?.paginationData?.totalItemCount as number | undefined) ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: '이름', cell: (info) => info.getValue() }),
      columnHelper.accessor('hadaProfileName', { header: '신청 하다 프로필', cell: (info) => info.getValue() }),
      columnHelper.accessor('createdAt', { header: '신청 시간', cell: (info) => formatDateTime(info.getValue()) }),
      columnHelper.accessor('jaewonSincheongSangtaeName', { header: '신청 상태', cell: (info) => info.getValue() }),
      columnHelper.display({
        id: 'actionBy',
        header: '신청 승인/취소 사용자',
        cell: ({ row }) => row.original.surakByName ?? row.original.ballyeoByName ?? '-',
      }),
      columnHelper.display({
        id: 'actionAt',
        header: '신청 승인/취소 일시',
        cell: ({ row }) => formatDateTime(row.original.surakAt ?? row.original.ballyeoAt),
      }),
    ],
    [],
  ) as ColumnDef<JaewonSincheongListItem, unknown>[];

  const clearSelection = () => {
    setRowSelection({});
  };

  const startCreate = () => {
    setIsCreating(true);
    clearSelection();
  };

  const stopCreate = () => {
    setIsCreating(false);
  };

  const handleAfterMutation = async () => {
    await refetch();
    setIsCreating(false);
    clearSelection();
  };

  const listSectionProps: HadaRequestListSectionProps = {
    data,
    columns,
    state: listViewState,
    isListLoading,
    pagination: listViewState.pagination,
    sortByOption,
    totalCount,
    totalPages,
    isCreating,
    handlers: {
      onSortChange: (value) => setSorting(getSortStateFromOption(value)),
      onSelectedChange: setSelectedRequests,
      onAddClick: startCreate,
      onStopCreate: stopCreate,
    },
  };

  const settingsSectionProps: HadaRequestRightsidePanelsProps = {
    jojikNanoId,
    selectedRequests,
    isCreating,
    onStartCreate: startCreate,
    onExitCreate: stopCreate,
    onAfterMutation: handleAfterMutation,
    isAuthenticated,
  };

  return {
    listSectionProps,
    settingsSectionProps,
    sortOptions: SORT_OPTIONS,
  };
}
