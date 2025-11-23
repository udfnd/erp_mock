'use client';

import { useMemo, useState } from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { useGetSayongjasQuery } from '@/domain/sayongja/api';
import type { GetSayongjasRequest, SayongjaListItem } from '@/domain/sayongja/api';
import { useJojiksQuery } from '@/domain/jojik/api';
import { useEmploymentCategoriesQuery, useWorkTypeCustomSangtaesQuery } from '@/domain/gigwan/api';

import {
  IS_HWALSEONG_FILTER_OPTIONS,
  SORT_OPTIONS,
  columnHelper,
  createSortableHeader,
  formatDate,
  getSortOptionFromState,
  getSortStateFromOption,
} from './constants';

export type SayongjaListViewHookParams = {
  gigwanNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<SayongjaListItem>;

export type SayongjaFilters = {
  jojikNanoIds: string[];
  employmentCategoryNanoIds: string[];
  workTypeNanoIds: string[];
  isHwalseong: string[];
};

export type SayongjaListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onJojikFilterChange: (value: string[]) => void;
  onEmploymentCategoryFilterChange: (value: string[]) => void;
  onWorkTypeFilterChange: (value: string[]) => void;
  onIsHwalseongFilterChange: (value: string[]) => void;
  onSelectedSayongjasChange: (sayongjas: SayongjaListItem[]) => void;
  onAddClick: () => void;
  onStopCreate: () => void;
};

export type SayongjaListSectionProps = {
  data: SayongjaListItem[];
  columns: ColumnDef<SayongjaListItem, unknown>[];
  state: ListSectionState;
  isListLoading: boolean;
  pagination: ListSectionState['pagination'];
  searchTerm: string;
  sortByOption?: string;
  filters: SayongjaFilters;
  totalCount: number;
  totalPages: number;
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
  filters: SayongjaFilters;
};

export type UseSayongjaListViewSectionsResult = {
  listSectionProps: SayongjaListSectionProps;
  settingsSectionProps: SayongjaSettingsSectionProps;
  sortOptions: typeof SORT_OPTIONS;
  isHwalseongFilterOptions: typeof IS_HWALSEONG_FILTER_OPTIONS;
  jojikFilterOptions: { label: string; value: string }[];
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
};

export function useSayongjaListViewSections({
  gigwanNanoId,
  isAuthenticated,
}: SayongjaListViewHookParams): UseSayongjaListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<SayongjaListItem>({
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

  const [filters, setFilters] = useState<SayongjaFilters>({
    jojikNanoIds: ['all'],
    employmentCategoryNanoIds: ['all'],
    workTypeNanoIds: ['all'],
    isHwalseong: ['all'],
  });

  const { data: jojikListData } = useJojiksQuery(
    { gigwanNanoId, pageNumber: 1, pageSize: 100 },
    { enabled: isAuthenticated && Boolean(gigwanNanoId) },
  );
  const jojikFilterOptions = useMemo(
    () => [
      { label: '전체 조직', value: 'all' },
      ...(jojikListData?.jojiks.map((jojik) => ({ label: jojik.name, value: jojik.nanoId })) ?? []),
    ],
    [jojikListData?.jojiks],
  );

  const { data: employmentCategoriesData } = useEmploymentCategoriesQuery(gigwanNanoId, {
    enabled: isAuthenticated && Boolean(gigwanNanoId),
  });
  const employmentCategoryOptions = useMemo(
    () => [
      { label: '전체 재직 상태', value: 'all' },
      ...(employmentCategoriesData?.categories.flatMap((category) =>
        category.sangtaes.map((item) => ({
          label: item.name,
          value: item.nanoId,
        })),
      ) ?? []),
    ],
    [employmentCategoriesData?.categories],
  );

  const { data: workTypeData } = useWorkTypeCustomSangtaesQuery(gigwanNanoId, {
    enabled: isAuthenticated && Boolean(gigwanNanoId),
  });
  const workTypeOptions = useMemo(
    () => [
      { label: '전체 근무 형태', value: 'all' },
      ...(workTypeData?.sangtaes.map((item) => ({ label: item.name, value: item.nanoId })) ?? []),
    ],
    [workTypeData?.sangtaes],
  );

  const normalizeFilterValues = (values: string[]) => (values.length ? values : ['all']);

  const toFilterArray = (values: string[]) => {
    const filtered = values.filter((value) => value !== 'all' && value !== '');
    return filtered.length ? filtered : undefined;
  };

  const isHwalseongSelection = filters.isHwalseong.filter((value) => value !== 'all' && value !== '');
  const isHwalseongFilter =
    isHwalseongSelection.length === 1 ? isHwalseongSelection[0] === 'true' : undefined;

  const queryParams: GetSayongjasRequest = {
    gigwanNanoId,
    sayongjaNameSearch: searchTerm ? searchTerm : undefined,
    jojikFilters: toFilterArray(filters.jojikNanoIds),
    employmentCategorySangtaeFilters: toFilterArray(filters.employmentCategoryNanoIds),
    workTypeCustomSangtaeFilters: toFilterArray(filters.workTypeNanoIds),
    isHwalseongFilter,
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortByOption,
  };

  const {
    data: sayongjasData,
    isLoading: isListLoading,
    refetch,
  } = useGetSayongjasQuery(queryParams, {
    enabled: isAuthenticated && Boolean(gigwanNanoId),
  });

  const data = sayongjasData?.sayongjas ?? [];
  const totalCount =
    (sayongjasData?.paginationData?.totalItemCount as number | undefined) ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: createSortableHeader('이름'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('employedAt', {
        header: createSortableHeader('입사일'),
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor('isHwalseong', {
        header: '활성 여부',
        cell: (info) => (info.getValue() ? '활성' : '비활성'),
      }),
    ],
    [],
  ) as ColumnDef<SayongjaListItem, unknown>[];

  const [isCreating, setIsCreating] = useState(false);
  const [selectedSayongjas, setSelectedSayongjas] = useState<SayongjaListItem[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
  };

  const handleJojikFilterChange = (value: string[]) => {
    setFilters((prev) => ({ ...prev, jojikNanoIds: normalizeFilterValues(value) }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleEmploymentCategoryFilterChange = (value: string[]) => {
    setFilters((prev) => ({
      ...prev,
      employmentCategoryNanoIds: normalizeFilterValues(value),
    }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleWorkTypeFilterChange = (value: string[]) => {
    setFilters((prev) => ({ ...prev, workTypeNanoIds: normalizeFilterValues(value) }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleIsHwalseongFilterChange = (value: string[]) => {
    setFilters((prev) => ({ ...prev, isHwalseong: normalizeFilterValues(value) }));
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

  const listSectionProps: SayongjaListSectionProps = {
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
    isCreating,
    handlers: {
      onSearchChange: handleSearchChange,
      onSortChange: handleSortChange,
      onJojikFilterChange: handleJojikFilterChange,
      onEmploymentCategoryFilterChange: handleEmploymentCategoryFilterChange,
      onWorkTypeFilterChange: handleWorkTypeFilterChange,
      onIsHwalseongFilterChange: handleIsHwalseongFilterChange,
      onSelectedSayongjasChange: setSelectedSayongjas,
      onAddClick: handleAddClick,
      onStopCreate: stopCreate,
    },
  };

  const settingsSectionProps: SayongjaSettingsSectionProps = {
    gigwanNanoId,
    selectedSayongjas,
    isCreating,
    onStartCreate: startCreate,
    onExitCreate: stopCreate,
    onAfterMutation: handleAfterMutation,
    isAuthenticated,
    filters,
  };

  return {
    listSectionProps,
    settingsSectionProps,
    sortOptions: SORT_OPTIONS,
    isHwalseongFilterOptions: IS_HWALSEONG_FILTER_OPTIONS,
    jojikFilterOptions,
    employmentCategoryOptions,
    workTypeOptions,
  };
}
