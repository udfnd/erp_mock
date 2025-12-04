'use client';

import { useCallback, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import { ListViewState, useListViewState } from '@/common/lv';
import { useGetJojikMunuisQuery } from '../../api';
import type { GetJojikMunuisRequest, JojikMunuiListItem } from '../../api';

import {
  SORT_OPTIONS,
  columnHelper,
  createSortableHeader,
  formatDate,
  getSortOptionFromState,
  getSortStateFromOption,
} from './constants';

export type JojikMunuiListViewHookParams = {
  jojikNanoId: string;
  isAuthenticated: boolean;
};

export type ListSectionState = ListViewState<JojikMunuiListItem>;

export type JojikMunuiListSectionHandlers = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSelectedJojikMunuisChange: (jojikMunuis: JojikMunuiListItem[]) => void;
  onStopCreate: () => void;
};

export type JojikMunuiListSectionProps = {
  data: JojikMunuiListItem[];
  columns: ColumnDef<JojikMunuiListItem, unknown>[];
  state: ListSectionState;
  isListLoading: boolean;
  pagination: ListSectionState['pagination'];
  searchTerm: string;
  sortByOption?: string;
  totalCount: number;
  totalPages: number;
  handlers: JojikMunuiListSectionHandlers;
};

export type JojikMunuiRightsidePanelsSectionProps = {
  jojikNanoId: string;
  selectedJojikMunuis: JojikMunuiListItem[];
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export type UseJojikMunuiListViewSectionsResult = {
  listSectionProps: JojikMunuiListSectionProps;
  settingsSectionProps: JojikMunuiRightsidePanelsSectionProps;
  sortOptions: typeof SORT_OPTIONS;
};

export function useJojikMunuiListViewSections({
  jojikNanoId,
  isAuthenticated,
}: JojikMunuiListViewHookParams): UseJojikMunuiListViewSectionsResult {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewState<JojikMunuiListItem>({
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

  const [selectedJojikMunuis, setSelectedJojikMunuis] = useState<JojikMunuiListItem[]>([]);

  const queryParams: GetJojikMunuisRequest = {
    jojikNanoId,
    titleSearch: searchTerm || undefined,
    pageNumber: String(pagination.pageIndex + 1),
    pageSize: String(pagination.pageSize),
    sortByOption,
  };

  const {
    data: jojikMunuisData,
    isLoading: isListLoading,
    refetch,
  } = useGetJojikMunuisQuery(queryParams, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  const data = useMemo(() => jojikMunuisData?.jojikMunuis ?? [], [jojikMunuisData?.jojikMunuis]);
  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: createSortableHeader('제목'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('jaewonsaengName', {
        header: '재원생 이름',
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
      columnHelper.accessor('gwangye', {
        header: '관계',
        cell: (info) => info.getValue() || '-',
        enableSorting: false,
      }),
      columnHelper.accessor('createdAt', {
        header: createSortableHeader('문의 일시'),
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor('jojikMunuiSangtaeName', {
        header: '문의 상태',
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
      columnHelper.accessor((row) => row.dapbyeon.dapbyeonByName, {
        id: 'dapbyeonByName',
        header: '답변자 이름',
        cell: (info) => info.getValue() || '-',
        enableSorting: false,
      }),
      columnHelper.accessor((row) => row.dapbyeon.dapbyeonAt, {
        id: 'dapbyeonAt',
        header: '답변 일시',
        cell: (info) => formatDate(info.getValue()),
        enableSorting: false,
      }),
      columnHelper.accessor((row) => row.dapbyeon.viewedAt, {
        id: 'viewedAt',
        header: '답변 읽음',
        cell: (info) => (info.getValue() ? '읽음' : '읽지 않음'),
        enableSorting: false,
      }),
      columnHelper.accessor(
        (row) => {
          const links = [];
          if (row.linkedJojikMunuiNanoId) links.push('문의');
          if (row.linkedJojikAllimNanoId) links.push('알림');
          return links.join(', ') || '-';
        },
        {
          id: 'linkedObjects',
          header: '연결 객체',
          cell: (info) => info.getValue(),
          enableSorting: false,
        },
      ),
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

  const handleSelectedJojikMunuisChange = (jojikMunuis: JojikMunuiListItem[]) => {
    setSelectedJojikMunuis(jojikMunuis);
  };

  const handleStopCreate = () => {
    // 재원생 문의 리스트에서는 생성 모드가 없어 선택 상태를 유지해야 합니다.
    // 동일한 로직을 사용하는 재원생 리스트 섹션과 일관성을 맞추기 위해 선택 초기화를 제거합니다.
  };

  const handleAfterMutation = async () => {
    await refetch();
    setSelectedJojikMunuis([]);
    setRowSelection({});
  };

  const listSectionProps: JojikMunuiListSectionProps = {
    data,
    columns: columns as ColumnDef<JojikMunuiListItem, unknown>[],
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
      onSelectedJojikMunuisChange: handleSelectedJojikMunuisChange,
      onStopCreate: handleStopCreate,
    },
  };

  const settingsSectionProps: JojikMunuiRightsidePanelsSectionProps = {
    jojikNanoId,
    selectedJojikMunuis,
    onAfterMutation: handleAfterMutation,
    isAuthenticated,
  };

  return {
    listSectionProps,
    settingsSectionProps,
    sortOptions: SORT_OPTIONS,
  };
}
