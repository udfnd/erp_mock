'use client';

import { useMemo, useState } from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/list-view';
import { useGetMyJojiksQuery, useGetSayongjasQuery } from '@/domain/sayongja/api';
import type { GetSayongjasRequest, SayongjaDetail } from '@/domain/sayongja/api';
import { useEmploymentCategoriesQuery, useWorkTypeCustomSangtaesQuery } from '@/domain/gigwan/api';

import {
  IS_HWALSEONG_FILTER_OPTIONS,
  PAGE_SIZE_OPTIONS,
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

export type ListSectionState = ListViewState<SayongjaDetail>;

export type SayongjaFilters = {
  jojikNanoId: string;
  employmentCategoryNanoId: string;
  workTypeNanoId: string;
  isHwalseong: string;
};

export type SayongjaListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onJojikFilterChange: (value: string) => void;
  onEmploymentCategoryFilterChange: (value: string) => void;
  onWorkTypeFilterChange: (value: string) => void;
  onIsHwalseongFilterChange: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onSelectedSayongjasChange: (sayongjas: SayongjaDetail[]) => void;
  onAddClick: () => void;
  onStopCreate: () => void;
};

export type SayongjaListSectionProps = {
  data: SayongjaDetail[];
  columns: ColumnDef<SayongjaDetail, unknown>[];
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
  selectedSayongjas: SayongjaDetail[];
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
  pageSizeOptions: typeof PAGE_SIZE_OPTIONS;
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
  const baseState = useListViewState<SayongjaDetail>({
    initialSorting: [{ id: 'employedAt', desc: true }],
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

  const [filters, setFilters] = useState<SayongjaFilters>({
    jojikNanoId: 'all',
    employmentCategoryNanoId: 'all',
    workTypeNanoId: 'all',
    isHwalseong: 'all',
  });

  const { data: myJojiksData } = useGetMyJojiksQuery({ enabled: isAuthenticated });
  const jojikFilterOptions = useMemo(
    () => [
      { label: '전체 조직', value: 'all' },
      ...(myJojiksData?.jojiks.map((jojik) => ({ label: jojik.name, value: jojik.nanoId })) ?? []),
    ],
    [myJojiksData?.jojiks],
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

  const queryParams: GetSayongjasRequest = {
    gigwanNanoId,
    sayongjaNameSearch: searchTerm ? searchTerm : undefined,
    jojikFilters: filters.jojikNanoId !== 'all' ? [filters.jojikNanoId] : undefined,
    employmentCategorySangtaeFilters:
      filters.employmentCategoryNanoId !== 'all' ? [filters.employmentCategoryNanoId] : undefined,
    workTypeCustomSangtaeFilters:
      filters.workTypeNanoId !== 'all' ? [filters.workTypeNanoId] : undefined,
    isHwalseongFilter: filters.isHwalseong === 'all' ? undefined : filters.isHwalseong === 'true',
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortByOption,
  };

  const { data: sayongjasData, isLoading: isListLoading, refetch } = useGetSayongjasQuery(queryParams, {
    enabled: isAuthenticated && Boolean(gigwanNanoId),
  });

  const data = sayongjasData?.sayongjas ?? [];
  const totalCount = (sayongjasData?.paginationData?.totalItemCount as number | undefined) ?? data.length;
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
  ) as ColumnDef<SayongjaDetail, unknown>[];

  const [isCreating, setIsCreating] = useState(false);
  const [selectedSayongjas, setSelectedSayongjas] = useState<SayongjaDetail[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
  };

  const handleJojikFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, jojikNanoId: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleEmploymentCategoryFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, employmentCategoryNanoId: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleWorkTypeFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, workTypeNanoId: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleIsHwalseongFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, isHwalseong: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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
      onPageSizeChange: handlePageSizeChange,
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
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    isHwalseongFilterOptions: IS_HWALSEONG_FILTER_OPTIONS,
    jojikFilterOptions,
    employmentCategoryOptions,
    workTypeOptions,
  };
}
