'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import { ListViewState, useListViewState } from '@/common/lv';
import { type JojikListItem, useJojiksQuery } from '@/domain/jojik/api';

import {
  CREATED_AT_FILTER_OPTIONS,
  SORT_OPTIONS,
  getSortOptionFromState,
  getSortStateFromOption,
  type CreatedAtFilterValue,
} from './constants';

export type JojikListViewHookParams = {
  gigwanNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<JojikListItem>;

export type JojikListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onCreatedFilterChange: (value: CreatedAtFilterValue) => void;
  onSelectedJojiksChange: (jojiks: JojikListItem[]) => void;
  onAddClick: () => void;
  onStopCreate: () => void;
};

export type JojikListSectionProps = {
  data: JojikListItem[];
  state: ListSectionState;
  isListLoading: boolean;
  totalCount: number;
  totalPages: number;
  searchTerm: string;
  sortByOption?: string;
  currentCreatedFilter: CreatedAtFilterValue;
  pagination: ListSectionState['pagination'];
  isCreating: boolean;
  handlers: JojikListSectionHandlers;
};

export type JojikSettingsSectionProps = {
  gigwanNanoId: string;
  selectedJojiks: JojikListItem[];
  isCreating: boolean;
  onStartCreate: () => void;
  onExitCreate: () => void;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export type JojikSettingsPanels = {
  noneSelected: ReactNode;
  oneSelected: ReactNode;
  multipleSelected: ReactNode;
};

export type UseJojikListViewSectionsResult = {
  listSectionProps: JojikListSectionProps;
  settingsSectionProps: JojikSettingsSectionProps;
  sortOptions: typeof SORT_OPTIONS;
  createdAtFilterOptions: typeof CREATED_AT_FILTER_OPTIONS;
};

export function useJojikListViewSections({
  gigwanNanoId,
  isAuthenticated,
}: JojikListViewHookParams): UseJojikListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<JojikListItem>({
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

  const {
    sorting,
    columnFilters,
    pagination,
    setSorting,
    setColumnFilters,
    setPagination,
    setRowSelection,
  } = listViewState;

  const [isCreating, setIsCreating] = useState(false);
  const [selectedJojiks, setSelectedJojiks] = useState<JojikListItem[]>([]);

  const sortByOption = getSortOptionFromState(sorting);

  const {
    data: jojiksData,
    isLoading: isListLoading,
    refetch,
  } = useJojiksQuery(
    {
      gigwanNanoId,
      jojikNameSearch: searchTerm ? searchTerm : undefined,
      sortByOption,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    },
    {
      enabled: isAuthenticated && Boolean(gigwanNanoId),
    },
  );

  const data = jojiksData?.jojiks ?? [];
  const totalCount =
    (jojiksData?.paginationData?.totalItemCount as number | undefined) ?? data.length;
  const totalPages =
    (jojiksData?.paginationData?.totalPageCount as number | undefined) ??
    Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const currentCreatedFilter =
    (columnFilters.find((filter) => filter.id === 'createdAt')?.value as
      | CreatedAtFilterValue
      | undefined) ?? 'all';

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleCreatedFilterChange = (value: CreatedAtFilterValue) => {
    setColumnFilters((prev) => {
      const others = prev.filter((filter) => filter.id !== 'createdAt');
      if (value === 'all') {
        return others;
      }
      return [...others, { id: 'createdAt', value }];
    });
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
  };

  const clearSelection = () => {
    setRowSelection({});
  };

  const startCreate = () => {
    clearSelection();
    setIsCreating(true);
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

  const listSectionProps: JojikListSectionProps = {
    data,
    state: listViewState,
    isListLoading,
    totalCount,
    totalPages,
    searchTerm,
    sortByOption,
    currentCreatedFilter,
    pagination: listViewState.pagination,
    isCreating,
    handlers: {
      onSearchChange: handleSearchChange,
      onSortChange: handleSortChange,
      onCreatedFilterChange: handleCreatedFilterChange,
      onSelectedJojiksChange: setSelectedJojiks,
      onAddClick: handleAddClick,
      onStopCreate: stopCreate,
    },
  };

  const settingsSectionProps: JojikSettingsSectionProps = {
    gigwanNanoId,
    selectedJojiks,
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
    createdAtFilterOptions: CREATED_AT_FILTER_OPTIONS,
  };
}
