'use client';

import { useMemo, useState } from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { useGetLinkIconsQuery } from '@/domain/system/api';
import { useGetOebuLinksQuery } from '@/domain/oebu-link/api';
import type { GetOebuLinksRequest, OebuLinkListItem } from '@/domain/oebu-link/api';

import {
  SORT_OPTIONS,
  columnHelper,
  formatDate,
  getSortOptionFromState,
  getSortStateFromOption,
} from './constants';

export type OebuLinkListViewHookParams = {
  jojikNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<OebuLinkListItem>;

export type OebuLinkListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onIconFilterChange: (values: string[]) => void;
  onSelectedLinksChange: (links: OebuLinkListItem[]) => void;
  onAddClick: () => void;
  onStopCreate: () => void;
};

export type OebuLinkListSectionProps = {
  data: OebuLinkListItem[];
  columns: ColumnDef<OebuLinkListItem, unknown>[];
  state: ListSectionState;
  isListLoading: boolean;
  pagination: ListSectionState['pagination'];
  searchTerm: string;
  sortByOption?: string;
  iconFilters: string[];
  totalCount: number;
  totalPages: number;
  isCreating: boolean;
  handlers: OebuLinkListSectionHandlers;
};

export type OebuLinkRightsidePanelsSectionProps = {
  jojikNanoId: string;
  selectedLinks: OebuLinkListItem[];
  isCreating: boolean;
  onStartCreate: () => void;
  onExitCreate: () => void;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
  iconOptions: { label: string; value: string }[];
};

export type UseOebuLinkListViewSectionsResult = {
  listSectionProps: OebuLinkListSectionProps;
  settingsSectionProps: OebuLinkRightsidePanelsSectionProps;
  sortOptions: typeof SORT_OPTIONS;
  iconFilterOptions: { label: string; value: string }[];
};

export function useOebuLinkListViewSections({
  jojikNanoId,
  isAuthenticated,
}: OebuLinkListViewHookParams): UseOebuLinkListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<OebuLinkListItem>({
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

  const [iconFilters, setIconFilters] = useState<string[]>([]);

  const { data: linkIconsData } = useGetLinkIconsQuery({ enabled: isAuthenticated });
  const iconFilterOptions = useMemo(
    () => [
      { label: '전체 아이콘', value: 'all' },
      ...(linkIconsData?.linkIcons.map((icon) => ({ label: icon.name, value: icon.nanoId })) ?? []),
    ],
    [linkIconsData?.linkIcons],
  );

  const queryParams: GetOebuLinksRequest = {
    jojikNanoId,
    nameSearch: searchTerm ? searchTerm : undefined,
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortByOption,
    iconFilters: iconFilters.length > 0 ? iconFilters.join(',') : undefined,
  };

  const {
    data: oebuLinksData,
    isLoading: isListLoading,
    refetch,
  } = useGetOebuLinksQuery(queryParams, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  const data = oebuLinksData?.oebuLinks ?? [];
  const totalCount =
    (oebuLinksData?.paginationData?.totalItemCount as number | undefined) ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '이름',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('titleName', {
        header: '표시 이름',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('linkUrl', {
        header: 'URL',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        header: '생성일',
        cell: (info) => formatDate(info.getValue()),
      }),
    ],
    [],
  ) as ColumnDef<OebuLinkListItem, unknown>[];

  const [isCreating, setIsCreating] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState<OebuLinkListItem[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
  };

  const handleIconFilterChange = (values: string[]) => {
    setIconFilters(values.filter((value) => value !== 'all'));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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

  const listSectionProps: OebuLinkListSectionProps = {
    data,
    columns,
    state: listViewState,
    isListLoading,
    pagination: listViewState.pagination,
    searchTerm,
    sortByOption,
    iconFilters,
    totalCount,
    totalPages,
    isCreating,
    handlers: {
      onSearchChange: handleSearchChange,
      onSortChange: handleSortChange,
      onIconFilterChange: handleIconFilterChange,
      onSelectedLinksChange: setSelectedLinks,
      onAddClick: handleAddClick,
      onStopCreate: stopCreate,
    },
  };

  const settingsSectionProps: OebuLinkRightsidePanelsSectionProps = {
    jojikNanoId,
    selectedLinks,
    isCreating,
    onStartCreate: startCreate,
    onExitCreate: stopCreate,
    onAfterMutation: handleAfterMutation,
    isAuthenticated,
    iconOptions: iconFilterOptions,
  };

  return {
    listSectionProps,
    settingsSectionProps,
    sortOptions: SORT_OPTIONS,
    iconFilterOptions,
  };
}
