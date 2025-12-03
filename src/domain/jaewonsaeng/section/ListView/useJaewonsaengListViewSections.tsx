'use client';

import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { useGetJaewonsaengsQuery } from '@/domain/jaewonsaeng/api';
import type { GetJaewonsaengsRequest, JaewonsaengListItem } from '@/domain/jaewonsaeng/api';
import { color } from '@/style';

import {
  columnHelper,
  createSortableHeader,
  getSortOptionFromState,
  getSortStateFromOption,
  SORT_OPTIONS,
} from './constants';

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
  columns: ColumnDef<JaewonsaengListItem, unknown>[];
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

const formatListeningTooltip = (item: JaewonsaengListItem) => {
  const list = item.sueops ?? [];
  return list
    .slice()
    .sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''))
    .map((sueop) => sueop.name)
    .join('\n');
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

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: createSortableHeader('이름'),
        cell: (info) => info.getValue(),
        size: 112,
      }),
      columnHelper.accessor('boninPhoneNumber', {
        header: '전화번호',
        cell: (info) => info.getValue() ?? '-',
        size: 112,
      }),
      columnHelper.accessor('bohojaPhoneNumberFirst', {
        header: '보호자1 전화번호',
        cell: (info) => info.getValue() ?? '-',
        size: 112,
      }),
      columnHelper.accessor('bohojaPhoneNumberSecond', {
        header: '보호자2 전화번호',
        cell: (info) => info.getValue() ?? '-',
        size: 112,
      }),
      columnHelper.accessor('jaewonCategorySangtaeName', {
        header: '재원 상태',
        cell: (info) => info.getValue(),
        size: 56,
      }),
      columnHelper.accessor('isHadaLinked', {
        header: '하다 연동',
        cell: (info) => (info.getValue() ? '연동' : '미연동'),
        size: 112,
      }),
      columnHelper.display({
        id: 'divider',
        header: '',
        cell: () => <div style={{ borderLeft: `1px solid ${color.cgrey100}`, height: '100%' }} />,
        size: 56,
      }),
      columnHelper.accessor('daepyoJaewonsaengGroupName', {
        header: '대표 재원생 그룹',
        cell: (info) => info.getValue() ?? '-',
        size: 112,
      }),
      columnHelper.accessor('memo', {
        header: '메모',
        cell: (info) => info.getValue() ?? '-',
        size: 144,
      }),
      columnHelper.display({
        id: 'sueops',
        header: '듣는 수업',
        cell: (info) => {
          const count = info.row.original.sueops?.length ?? 0;
          const tooltip = formatListeningTooltip(info.row.original);
          return (
            <div style={{ position: 'relative' }}>
              <span title={tooltip}>{`${count}개`}</span>
            </div>
          );
        },
        size: 56,
      }),
    ],
    [],
  ) as ColumnDef<JaewonsaengListItem, unknown>[];

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
