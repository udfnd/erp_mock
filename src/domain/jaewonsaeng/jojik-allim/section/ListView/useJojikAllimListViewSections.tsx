'use client';

import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { useGetJojikAllimsQuery } from '../../api';
import type { GetJojikAllimsRequest, JojikAllimListItem } from '../../api';

import {
  SORT_OPTIONS,
  columnHelper,
  createSortableHeader,
  formatDate,
  getSortOptionFromState,
  getSortStateFromOption,
  getBalsinSootan,
} from './constants';

export type JojikAllimListViewHookParams = {
  jojikNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<JojikAllimListItem>;

export type JojikAllimListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSelectedJojikAllimsChange: (allims: JojikAllimListItem[]) => void;
  onStartCreate: (branch: 'jaewonsaeng' | 'bejaewonsaeng', type: 'normal' | 'template') => void;
};

export type JojikAllimListSectionProps = {
  data: JojikAllimListItem[];
  columns: ColumnDef<JojikAllimListItem, unknown>[];
  state: ListSectionState;
  isListLoading: boolean;
  pagination: ListSectionState['pagination'];
  searchTerm: string;
  sortByOption?: string;
  totalCount: number;
  totalPages: number;
  handlers: JojikAllimListSectionHandlers;
};

export type JojikAllimRightsidePanelsSectionProps = {
  jojikNanoId: string;
  selectedJojikAllims: JojikAllimListItem[];
  isCreating: boolean;
  createBranch: 'jaewonsaeng' | 'bejaewonsaeng' | null;
  createType: 'normal' | 'template' | null;
  onAfterMutation: () => Promise<unknown> | void;
  onExitCreate: () => void;
  isAuthenticated: boolean;
};

export type UseJojikAllimListViewSectionsResult = {
  listSectionProps: JojikAllimListSectionProps;
  settingsSectionProps: JojikAllimRightsidePanelsSectionProps;
  sortOptions: typeof SORT_OPTIONS;
};

export function useJojikAllimListViewSections({
  jojikNanoId,
  isAuthenticated,
}: JojikAllimListViewHookParams): UseJojikAllimListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createBranch, setCreateBranch] = useState<'jaewonsaeng' | 'bejaewonsaeng' | null>(null);
  const [createType, setCreateType] = useState<'normal' | 'template' | null>(null);

  const baseState = useListViewState<JojikAllimListItem>({
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

  const [selectedJojikAllims, setSelectedJojikAllims] = useState<JojikAllimListItem[]>([]);

  const queryParams: GetJojikAllimsRequest = {
    jojikNanoId,
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  };

  const {
    data: jojikAllimsData,
    isLoading: isListLoading,
    refetch,
  } = useGetJojikAllimsQuery(queryParams, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  const data = useMemo(() => jojikAllimsData?.allims ?? [], [jojikAllimsData?.allims]);
  const totalCount = jojikAllimsData?.paginationData?.totalItemCount ?? 0;
  const totalPages = jojikAllimsData?.paginationData?.totalPageCount ?? 1;

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: createSortableHeader('제목'),
        cell: (info) => info.getValue(),
        size: 150,
      }),
      columnHelper.accessor('jaewonsaengName', {
        header: '재원생 이름',
        cell: (info) => info.getValue() || '비재원생',
        enableSorting: false,
        size: 100,
      }),
      columnHelper.display({
        id: 'gwangye',
        header: '관계',
        cell: () => '-',
        enableSorting: false,
        size: 80,
      }),
      columnHelper.accessor('createdAt', {
        header: createSortableHeader('알림 생성 시간'),
        cell: (info) => formatDate(info.getValue()),
        size: 140,
      }),
      columnHelper.accessor('hadaViewedAt', {
        header: '알림 읽음 시간',
        cell: (info) => formatDate(info.getValue()),
        enableSorting: false,
        size: 140,
      }),
      columnHelper.accessor('createdByName', {
        header: '생성자',
        cell: (info) => info.getValue(),
        enableSorting: false,
        size: 100,
      }),
      columnHelper.display({
        id: 'balsinSootan',
        header: '발송 방식',
        cell: (info) => getBalsinSootan(info.row.original),
        enableSorting: false,
        size: 120,
      }),
      columnHelper.accessor('allimType', {
        header: '알림 종류',
        cell: (info) => info.getValue().name,
        enableSorting: false,
        size: 100,
      }),
    ],
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSelectedJojikAllimsChange = (allims: JojikAllimListItem[]) => {
    setSelectedJojikAllims(allims);
  };

  const handleStartCreate = (
    branch: 'jaewonsaeng' | 'bejaewonsaeng',
    type: 'normal' | 'template',
  ) => {
    setIsCreating(true);
    setCreateBranch(branch);
    setCreateType(type);
    setSelectedJojikAllims([]);
    setRowSelection({});
  };

  const handleExitCreate = () => {
    setIsCreating(false);
    setCreateBranch(null);
    setCreateType(null);
  };

  const handleAfterMutation = async () => {
    await refetch();
    setSelectedJojikAllims([]);
    setRowSelection({});
    handleExitCreate();
  };

  const listSectionProps: JojikAllimListSectionProps = {
    data,
    columns: columns as ColumnDef<JojikAllimListItem, unknown>[],
    state: listViewState,
    isListLoading,
    pagination,
    searchTerm,
    sortByOption,
    totalCount,
    totalPages,
    handlers: {
      onSearchChange: handleSearchChange,
      onSortChange: handleSortChange,
      onSelectedJojikAllimsChange: handleSelectedJojikAllimsChange,
      onStartCreate: handleStartCreate,
    },
  };

  const settingsSectionProps: JojikAllimRightsidePanelsSectionProps = {
    jojikNanoId,
    selectedJojikAllims,
    isCreating,
    createBranch,
    createType,
    onAfterMutation: handleAfterMutation,
    onExitCreate: handleExitCreate,
    isAuthenticated,
  };

  return {
    listSectionProps,
    settingsSectionProps,
    sortOptions: SORT_OPTIONS,
  };
}
