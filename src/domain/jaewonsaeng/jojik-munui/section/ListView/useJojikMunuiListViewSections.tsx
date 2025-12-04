'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { useGetJojikMunuisQuery, type GetJojikMunuisRequest, type JojikMunuiListItem } from '@/domain/jaewonsaeng/jojik-munui/api';

import {
  SORT_OPTIONS,
  columnHelper,
  formatDateTime,
  getSortOptionFromState,
  getSortStateFromOption,
} from './constants';

export type JojikMunuiListViewHookParams = {
  jojikNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<JojikMunuiListItem>;

export type JojikMunuiListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSelectedChange: (munuis: JojikMunuiListItem[]) => void;
  onAddClick: () => void;
  onStopCreate: () => void;
};

export type JojikMunuiListSectionProps = {
  data: JojikMunuiListItem[];
  columns: ColumnDef<JojikMunuiListItem, unknown>[];
  state: ListSectionState;
  isListLoading: boolean;
  pagination: ListSectionState['pagination'];
  searchTerm: string;
  sortByOption?: string;
  totalCount: number;
  totalPages: number;
  isCreating: boolean;
  handlers: JojikMunuiListSectionHandlers;
};

export type JojikMunuiRightsidePanelsProps = {
  jojikNanoId: string;
  selectedMunuis: JojikMunuiListItem[];
  isCreating: boolean;
  onStartCreate: () => void;
  onExitCreate: () => void;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export type UseJojikMunuiListViewSectionsResult = {
  listSectionProps: JojikMunuiListSectionProps;
  settingsSectionProps: JojikMunuiRightsidePanelsProps;
  sortOptions: typeof SORT_OPTIONS;
};

export function useJojikMunuiListViewSections({
  jojikNanoId,
  isAuthenticated,
}: JojikMunuiListViewHookParams): UseJojikMunuiListViewSectionsResult {
  const baseState = useListViewState<JojikMunuiListItem>({
    initialSorting: getSortStateFromOption('createdAtDesc'),
    initialPagination: { pageIndex: 0, pageSize: 20 },
  });

  const [searchTerm, setSearchTerm] = useState('');

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
  const [selectedMunuis, setSelectedMunuis] = useState<JojikMunuiListItem[]>([]);

  const queryParams: GetJojikMunuisRequest = {
    jojikNanoId,
    titleSearch: searchTerm ? searchTerm : undefined,
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortByOption,
  };

  const {
    data: munuiData,
    isLoading: isListLoading,
    refetch,
  } = useGetJojikMunuisQuery(queryParams, { enabled: isAuthenticated && Boolean(jojikNanoId) });

  const data = munuiData?.jojikMunuis ?? [];
  const totalCount = (munuiData?.paginationData?.totalItemCount as number | undefined) ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', { header: '제목', cell: (info) => info.getValue() }),
      columnHelper.accessor('jaewonsaengName', { header: '재원생 이름', cell: (info) => info.getValue() }),
      columnHelper.accessor('gwangye', { header: '관계', cell: (info) => info.getValue() ?? '-' }),
      columnHelper.accessor('createdAt', { header: '문의 일시', cell: (info) => formatDateTime(info.getValue()) }),
      columnHelper.accessor('jojikMunuiSangtaeName', { header: '문의 상태', cell: (info) => info.getValue() }),
      columnHelper.display({
        id: 'dapbyeonBy',
        header: '답변자 이름',
        cell: ({ row }) => row.original.dapbyeon?.dapbyeonByName ?? '-',
      }),
      columnHelper.display({
        id: 'dapbyeonAt',
        header: '답변 일시',
        cell: ({ row }) => formatDateTime(row.original.dapbyeon?.dapbyeonAt),
      }),
      columnHelper.display({
        id: 'viewedAt',
        header: '답변 읽음',
        cell: ({ row }) => formatDateTime(row.original.dapbyeon?.viewedAt),
      }),
      columnHelper.display({
        id: 'linkedObject',
        header: '조직 객체',
        cell: ({ row }) => row.original.linkedJojikMunuiNanoId ?? row.original.linkedJojikAllimNanoId ?? '-',
      }),
    ],
    [],
  ) as ColumnDef<JojikMunuiListItem, unknown>[];

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

  const listSectionProps: JojikMunuiListSectionProps = {
    data,
    columns,
    state: listViewState,
    isListLoading,
    pagination: listViewState.pagination,
    searchTerm,
    sortByOption,
    totalCount,
    totalPages,
    isCreating,
    handlers: {
      onSearchChange: (value) => setSearchTerm(value),
      onSortChange: (value) => setSorting(getSortStateFromOption(value)),
      onSelectedChange: setSelectedMunuis,
      onAddClick: startCreate,
      onStopCreate: stopCreate,
    },
  };

  const settingsSectionProps: JojikMunuiRightsidePanelsProps = {
    jojikNanoId,
    selectedMunuis,
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
