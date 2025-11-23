'use client';

import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { type SayongjaListItem, useGetSayongjasQuery } from '@/domain/sayongja/api';

import {
  EMPLOYMENT_CATEGORY_FILTER_OPTIONS,
  IS_HWALSEONG_FILTER_OPTIONS,
  JOJIK_FILTER_OPTIONS,
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
  WORK_TYPE_FILTER_OPTIONS,
  columnHelper,
  getSortOptionFromState,
  getSortStateFromOption,
} from './constants';

export type SayongjaListViewHookParams = {
  gigwanNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<SayongjaListItem>;

type SayongjaColumnDef = ColumnDef<SayongjaListItem, unknown>;

export type SayongjaFilters = {
  jojikNanoIds: string[];
  employmentCategoryNanoIds: string[];
  workTypeNanoIds: string[];
  isHwalseong: 'all' | 'hwalseong' | 'bihwalseong';
};

export type SayongjaListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onJojikFilterChange: (value: string[]) => void;
  onEmploymentCategoryFilterChange: (value: string[]) => void;
  onWorkTypeFilterChange: (value: string[]) => void;
  onIsHwalseongFilterChange: (value: SayongjaFilters['isHwalseong']) => void;
  onPageSizeChange: (size: number) => void;
  onSelectedSayongjasChange: (sayongjas: SayongjaListItem[]) => void;
  onStartCreate: () => void;
  onClearCreate: () => void;
};

export type SayongjaListSectionProps = {
  data: SayongjaListItem[];
  columns: SayongjaColumnDef[];
  state: ListSectionState;
  isListLoading: boolean;
  totalCount: number;
  totalPages: number;
  searchTerm: string;
  sortByOption?: string;
  filters: SayongjaFilters;
  pagination: ListSectionState['pagination'];
  isCreating: boolean;
  handlers: SayongjaListSectionHandlers;
};

export type SayongjaSettingsSectionProps = {
  gigwanNanoId: string;
  selectedSayongjas: SayongjaListItem[];
  isCreating: boolean;
  onStartCreate: () => void;
  onExitCreate: () => void;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export type UseSayongjaListViewSectionsResult = {
  listSectionProps: SayongjaListSectionProps;
  settingsSectionProps: SayongjaSettingsSectionProps;
  sortOptions: typeof SORT_OPTIONS;
  pageSizeOptions: typeof PAGE_SIZE_OPTIONS;
  isHwalseongFilterOptions: typeof IS_HWALSEONG_FILTER_OPTIONS;
  jojikFilterOptions: typeof JOJIK_FILTER_OPTIONS;
  employmentCategoryOptions: typeof EMPLOYMENT_CATEGORY_FILTER_OPTIONS;
  workTypeOptions: typeof WORK_TYPE_FILTER_OPTIONS;
};

export function useSayongjaListViewSections({
  gigwanNanoId,
  isAuthenticated,
}: SayongjaListViewHookParams): UseSayongjaListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<SayongjaListItem>({
    initialSorting: getSortStateFromOption('employedAtDesc'),
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

  const sortByOption = getSortOptionFromState(sorting);

  const [isCreating, setIsCreating] = useState(false);
  const [selectedSayongjas, setSelectedSayongjas] = useState<SayongjaListItem[]>([]);

  const filters: SayongjaFilters = useMemo(() => {
    const isHwalseongFilter =
      (columnFilters.find((filter) => filter.id === 'isHwalseong')?.value as
        | SayongjaFilters['isHwalseong']
        | undefined) ?? 'all';
    const jojikNanoIds =
      (columnFilters.find((filter) => filter.id === 'jojikNanoIds')?.value as string[] | undefined) ??
      ['all'];
    const employmentCategoryNanoIds =
      (columnFilters.find((filter) => filter.id === 'employmentCategoryNanoIds')?.value as
        | string[]
        | undefined) ?? ['all'];
    const workTypeNanoIds =
      (columnFilters.find((filter) => filter.id === 'workTypeNanoIds')?.value as string[] | undefined) ??
      ['all'];

    return {
      isHwalseong: isHwalseongFilter,
      jojikNanoIds,
      employmentCategoryNanoIds,
      workTypeNanoIds,
    };
  }, [columnFilters]);

  const queryParams = {
    gigwanNanoId,
    sayongjaNameSearch: searchTerm ? searchTerm : undefined,
    jojikFilters: filters.jojikNanoIds.filter((value) => value !== 'all' && value !== ''),
    isHwalseongFilter:
      filters.isHwalseong === 'hwalseong'
        ? true
        : filters.isHwalseong === 'bihwalseong'
          ? false
          : undefined,
    workTypeCustomSangtaeFilters: filters.workTypeNanoIds.filter((value) => value !== 'all' && value !== ''),
    employmentCategorySangtaeFilters: filters.employmentCategoryNanoIds.filter(
      (value) => value !== 'all' && value !== '',
    ),
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortByOption,
  };

  const { data: sayongjasData, isLoading: isListLoading, refetch } = useGetSayongjasQuery(queryParams, {
    enabled: isAuthenticated && Boolean(gigwanNanoId),
  });

  const data = sayongjasData?.sayongjas ?? [];
  const totalCount =
    (sayongjasData?.paginationData?.totalItemCount as number | undefined) ?? data.length;
  const totalPages =
    (sayongjasData?.paginationData?.totalPageCount as number | undefined) ??
    Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '사용자 이름',
        cell: (info) => info.getValue(),
        meta: { maxWidth: 160 },
      }),
      columnHelper.accessor('employedAt', {
        header: '입사일',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('isHwalseong', {
        header: '활성 여부',
        cell: (info) => (info.getValue() ? '활성' : '비활성'),
      }),
    ],
    [],
  ) as SayongjaColumnDef[];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
  };

  const handleJojikFilterChange = (value: string[]) => {
    setColumnFilters((prev) => {
      const others = prev.filter((filter) => filter.id !== 'jojikNanoIds');
      if (!value.length || value.includes('all')) {
        return others;
      }
      return [...others, { id: 'jojikNanoIds', value }];
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleEmploymentCategoryFilterChange = (value: string[]) => {
    setColumnFilters((prev) => {
      const others = prev.filter((filter) => filter.id !== 'employmentCategoryNanoIds');
      if (!value.length || value.includes('all')) {
        return others;
      }
      return [...others, { id: 'employmentCategoryNanoIds', value }];
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleWorkTypeFilterChange = (value: string[]) => {
    setColumnFilters((prev) => {
      const others = prev.filter((filter) => filter.id !== 'workTypeNanoIds');
      if (!value.length || value.includes('all')) {
        return others;
      }
      return [...others, { id: 'workTypeNanoIds', value }];
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleIsHwalseongFilterChange = (value: SayongjaFilters['isHwalseong']) => {
    setColumnFilters((prev) => {
      const others = prev.filter((filter) => filter.id !== 'isHwalseong');
      if (value === 'all') {
        return others;
      }
      return [...others, { id: 'isHwalseong', value }];
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination({ pageIndex: 0, pageSize: size });
  };

  const clearSelection = () => {
    setRowSelection({});
  };

  const startCreate = () => {
    clearSelection();
    setIsCreating(true);
  };

  const clearCreate = () => {
    setIsCreating(false);
  };

  const handleAfterMutation = async () => {
    await refetch();
    setRowSelection({});
    setSelectedSayongjas([]);
    setIsCreating(false);
  };

  const handleSelectedSayongjasChange = (items: SayongjaListItem[]) => {
    setSelectedSayongjas(items);
    if (items.length !== 1) {
      setIsCreating(false);
    }
  };

  const listSectionProps: SayongjaListSectionProps = {
    data,
    columns,
    state: listViewState,
    isListLoading,
    totalCount,
    totalPages,
    searchTerm,
    sortByOption,
    filters,
    pagination,
    isCreating,
    handlers: {
      onSearchChange: handleSearchChange,
      onSortChange: handleSortChange,
      onJojikFilterChange: handleJojikFilterChange,
      onEmploymentCategoryFilterChange: handleEmploymentCategoryFilterChange,
      onWorkTypeFilterChange: handleWorkTypeFilterChange,
      onIsHwalseongFilterChange: handleIsHwalseongFilterChange,
      onPageSizeChange: handlePageSizeChange,
      onSelectedSayongjasChange: handleSelectedSayongjasChange,
      onStartCreate: startCreate,
      onClearCreate: clearCreate,
    },
  };

  const settingsSectionProps: SayongjaSettingsSectionProps = {
    gigwanNanoId,
    selectedSayongjas,
    isCreating,
    onStartCreate: startCreate,
    onExitCreate: clearCreate,
    onAfterMutation: handleAfterMutation,
    isAuthenticated,
  };

  return {
    listSectionProps,
    settingsSectionProps,
    sortOptions: SORT_OPTIONS,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    isHwalseongFilterOptions: IS_HWALSEONG_FILTER_OPTIONS,
    jojikFilterOptions: JOJIK_FILTER_OPTIONS,
    employmentCategoryOptions: EMPLOYMENT_CATEGORY_FILTER_OPTIONS,
    workTypeOptions: WORK_TYPE_FILTER_OPTIONS,
  };
}
