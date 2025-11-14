'use client';

import { useMemo, useState } from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/common/components';
import { ListViewState, useListViewState } from '@/common/list-view';
import { type JojikListItem, useJojiksQuery } from '@/domain/jojik/api';

import {
  CREATED_AT_FILTER_OPTIONS,
  CREATED_AT_FILTER_NOW,
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
  columnHelper,
  createSortableHeader,
  formatDate,
  getSortOptionFromState,
  getSortStateFromOption,
  type CreatedAtFilterValue,
} from './constants';
import { jojikListViewCss } from './styles';

export type JojikListViewHookParams = {
  gigwanNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<JojikListItem>;

export type JojikListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onCreatedFilterChange: (value: CreatedAtFilterValue) => void;
  onPageSizeChange: (size: number) => void;
  onSelectedJojiksChange: (jojiks: JojikListItem[]) => void;
  onAddClick: () => void;
  onStopCreate: () => void;
  onClearSelection: () => void;
};

export type JojikListSectionProps = {
  data: JojikListItem[];
  columns: ColumnDef<JojikListItem>[];
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
  onClearSelection: () => void;
  isAuthenticated: boolean;
};

export type UseJojikListViewSectionsResult = {
  listSectionProps: JojikListSectionProps;
  settingsSectionProps: JojikSettingsSectionProps;
  createdAtFilterOptions: typeof CREATED_AT_FILTER_OPTIONS;
  sortOptions: typeof SORT_OPTIONS;
  pageSizeOptions: typeof PAGE_SIZE_OPTIONS;
};

export function useJojikListViewSections({
  gigwanNanoId,
  isAuthenticated,
}: JojikListViewHookParams): UseJojikListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<JojikListItem>({
    initialSorting: [{ id: 'createdAt', desc: true }],
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
  const totalCount = (jojiksData?.totalCount as number | undefined) ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const columns = useMemo<ColumnDef<JojikListItem, any>[]>(
    () => [
      columnHelper.display({
        id: 'selection',
        header: ({ table }) => (
          <div css={jojikListViewCss.checkboxCell}>
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onChange={(event) => {
                setIsCreating(false);
                table.getToggleAllPageRowsSelectedHandler()(event);
              }}
              ariaLabel="전체 조직 선택"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div css={jojikListViewCss.checkboxCell}>
            <Checkbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={(event) => {
                setIsCreating(false);
                row.getToggleSelectedHandler()(event);
              }}
              ariaLabel={`${row.original.name} 선택`}
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor('name', {
        header: createSortableHeader('조직 이름'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        header: createSortableHeader('생성일'),
        cell: (info) => formatDate(info.getValue()),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue === 'all') {
            return true;
          }

          const days = Number(filterValue);
          const rawValue = row.getValue<string>(columnId);
          const parsed = new Date(rawValue);
          if (Number.isNaN(parsed.getTime())) {
            return true;
          }

          const diff = CREATED_AT_FILTER_NOW - parsed.getTime();
          const threshold = days * 24 * 60 * 60 * 1000;

          return diff <= threshold;
        },
      }),
    ],
    [setIsCreating],
  );

  const currentCreatedFilter =
    (columnFilters.find((filter) => filter.id === 'createdAt')?.value as CreatedAtFilterValue | undefined) ??
    'all';

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

  const handleClearSelection = () => {
    clearSelection();
  };

  const handleAfterMutation = async () => {
    await refetch();
    setIsCreating(false);
    clearSelection();
  };

  const listSectionProps: JojikListSectionProps = {
    data,
    columns,
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
      onPageSizeChange: handlePageSizeChange,
      onSelectedJojiksChange: setSelectedJojiks,
      onAddClick: handleAddClick,
      onStopCreate: stopCreate,
      onClearSelection: handleClearSelection,
    },
  };

  const settingsSectionProps: JojikSettingsSectionProps = {
    gigwanNanoId,
    selectedJojiks,
    isCreating,
    onStartCreate: startCreate,
    onExitCreate: stopCreate,
    onAfterMutation: handleAfterMutation,
    onClearSelection: handleClearSelection,
    isAuthenticated,
  };

  return {
    listSectionProps,
    settingsSectionProps,
    createdAtFilterOptions: CREATED_AT_FILTER_OPTIONS,
    sortOptions: SORT_OPTIONS,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  };
}
