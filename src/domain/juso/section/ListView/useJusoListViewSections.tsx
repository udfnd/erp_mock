'use client';

import { useMemo, useState } from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { type JusoListItem, useGetJusosQuery } from '@/domain/juso/api';

import {
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
  columnHelper,
  formatDate,
  getSortOptionFromState,
  getSortStateFromOption,
} from './constants';

export type JusoListViewHookParams = {
  jojikNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<JusoListItem>;

type JusoColumnDef = ColumnDef<JusoListItem, unknown>;

export type JusoListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onSelectedJusosChange: (jusos: JusoListItem[]) => void;
  onAddClick: () => void;
  onStopCreate: () => void;
};

export type JusoListSectionProps = {
  data: JusoListItem[];
  columns: JusoColumnDef[];
  state: ListSectionState;
  isListLoading: boolean;
  totalCount: number;
  totalPages: number;
  searchTerm: string;
  sortByOption?: string;
  pagination: ListSectionState['pagination'];
  isCreating: boolean;
  handlers: JusoListSectionHandlers;
};

export type JusoRightsidePanelsProps = {
  jojikNanoId: string;
  selectedJusos: JusoListItem[];
  isCreating: boolean;
  onStartCreate: () => void;
  onExitCreate: () => void;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export type UseJusoListViewSectionsResult = {
  listSectionProps: JusoListSectionProps;
  settingsSectionProps: JusoRightsidePanelsProps;
  sortOptions: typeof SORT_OPTIONS;
  pageSizeOptions: typeof PAGE_SIZE_OPTIONS;
};

export function useJusoListViewSections({
  jojikNanoId,
  isAuthenticated,
}: JusoListViewHookParams): UseJusoListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<JusoListItem>({
    initialSorting: [],
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

  const [isCreating, setIsCreating] = useState(false);
  const [selectedJusos, setSelectedJusos] = useState<JusoListItem[]>([]);

  const sortByOption = getSortOptionFromState(sorting);

  const {
    data: jusosData,
    isLoading: isListLoading,
    refetch,
  } = useGetJusosQuery(
    {
      jojikNanoId,
      jusoNameSearch: searchTerm ? searchTerm : undefined,
      sortByOption,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    },
    { enabled: isAuthenticated && Boolean(jojikNanoId) },
  );

  const data = jusosData?.jusos ?? [];
  const totalCount = jusosData?.paginationData?.totalItemCount ?? data.length;
  const totalPages = Math.max(
    1,
    Math.ceil(
      (jusosData?.paginationData?.totalItemCount ?? data.length) / Math.max(pagination.pageSize, 1),
    ),
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('jusoName', {
        header: () => <span>주소 이름</span>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('juso', {
        header: () => <span>주소</span>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        header: () => <span>생성일</span>,
        cell: (info) => formatDate(info.getValue()),
      }),
    ],
    [],
  ) as JusoColumnDef[];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination({ pageIndex: 0, pageSize: size });
  };

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

  const handleAddClick = () => {
    startCreate();
  };

  const handleAfterMutation = async () => {
    await refetch();
    setIsCreating(false);
    clearSelection();
  };

  const listSectionProps: JusoListSectionProps = {
    data,
    columns,
    state: listViewState,
    isListLoading,
    totalCount,
    totalPages,
    searchTerm,
    sortByOption,
    pagination: listViewState.pagination,
    isCreating,
    handlers: {
      onSearchChange: handleSearchChange,
      onSortChange: handleSortChange,
      onPageSizeChange: handlePageSizeChange,
      onSelectedJusosChange: setSelectedJusos,
      onAddClick: handleAddClick,
      onStopCreate: stopCreate,
    },
  };

  const settingsSectionProps: JusoRightsidePanelsProps = {
    jojikNanoId,
    selectedJusos,
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
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  };
}
