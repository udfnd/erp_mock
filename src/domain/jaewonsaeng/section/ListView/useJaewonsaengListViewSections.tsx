'use client';

import { useState } from 'react';

import { ListViewState, useListViewState } from '@/common/lv';
import { useGetJaewonsaengsQuery } from '@/domain/jaewonsaeng/api';
import type { GetJaewonsaengsRequest, JaewonsaengListItem } from '@/domain/jaewonsaeng/api';

import { getSortOptionFromState, getSortStateFromOption, SORT_OPTIONS } from './constants';

export type JaewonsaengListViewHookParams = {
  jojikNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<JaewonsaengListItem>;

export type JaewonsaengListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSelectedItemsChange: (items: JaewonsaengListItem[]) => void;
  onAddClick: () => void;
  onStopCreate: () => void;
};

export type JaewonsaengListSectionProps = {
  data: JaewonsaengListItem[];
  state: ListSectionState;
  isListLoading: boolean;
  pagination: ListSectionState['pagination'];
  searchTerm: string;
  sortByOption?: string;
  totalCount: number;
  totalPages: number;
  isCreating: boolean;
  handlers: JaewonsaengListSectionHandlers;
};

export type JaewonsaengRightsidePanelsSectionProps = {
  jojikNanoId: string;
  selectedJaewonsaengs: JaewonsaengListItem[];
  isCreating: boolean;
  onStartCreate: () => void;
  onExitCreate: () => void;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export type UseJaewonsaengListViewSectionsResult = {
  listSectionProps: JaewonsaengListSectionProps;
  settingsSectionProps: JaewonsaengRightsidePanelsSectionProps;
  sortOptions: typeof SORT_OPTIONS;
};

export function useJaewonsaengListViewSections({
  jojikNanoId,
  isAuthenticated,
}: JaewonsaengListViewHookParams): UseJaewonsaengListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<JaewonsaengListItem>({
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
  const sortByOption = getSortOptionFromState(sorting);

  const queryParams: GetJaewonsaengsRequest = {
    jojikNanoId,
    jaewonsaengNameSearch: searchTerm ? searchTerm : undefined,
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortByOption,
  };

  const {
    data: jaewonsaengData,
    isLoading: isListLoading,
    refetch,
  } = useGetJaewonsaengsQuery(queryParams, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  const data = jaewonsaengData?.jaewonsaengs ?? [];
  const totalCount =
    (jaewonsaengData?.paginationData?.totalItemCount as number | undefined) ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const [isCreating, setIsCreating] = useState(false);
  const [selectedJaewonsaengs, setSelectedJaewonsaengs] = useState<JaewonsaengListItem[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
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

  const listSectionProps: JaewonsaengListSectionProps = {
    data,
    state: listViewState,
    isListLoading,
    pagination: listViewState.pagination,
    searchTerm,
    sortByOption,
    totalCount,
    totalPages,
    isCreating,
    handlers: {
      onSearchChange: handleSearchChange,
      onSortChange: handleSortChange,
      onSelectedItemsChange: setSelectedJaewonsaengs,
      onAddClick: handleAddClick,
      onStopCreate: stopCreate,
    },
  };

  const settingsSectionProps: JaewonsaengRightsidePanelsSectionProps = {
    jojikNanoId,
    selectedJaewonsaengs,
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
