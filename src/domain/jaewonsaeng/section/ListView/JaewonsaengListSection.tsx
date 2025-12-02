'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';

import { ListSection, type ListViewSortProps } from '@/common/lv/component';
import { ToolbarLayout } from '@/common/lv/layout';
import type { JaewonsaengListSectionProps } from './useJaewonsaengListViewSections';
import type { JaewonsaengListItem } from '@/domain/jaewonsaeng/api';
import { cssObj } from './styles';
import { columnHelper, createSortableHeader } from './constants';
import { color } from '@/style';

export type JaewonsaengListSectionComponentProps = JaewonsaengListSectionProps & {
  sortOptions: { label: string; value: string }[];
};

const formatListeningTooltip = (item: JaewonsaengListItem) => {
  const list = item.sueops ?? [];
  return list
    .slice()
    .sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''))
    .map((sueop) => sueop.name)
    .join('\n');
};

export function JaewonsaengListSection({
  data,
  state,
  isListLoading,
  pagination,
  searchTerm,
  sortByOption,
  totalCount,
  totalPages,
  isCreating,
  handlers,
  sortOptions,
}: JaewonsaengListSectionComponentProps) {
  const sortValue = sortByOption;
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const sortProps: ListViewSortProps = useMemo(
    () => ({
      label: '정렬 기준',
      value: sortValue,
      placeholder: '정렬 기준',
      options: sortOptions,
      onChange: handlers.onSortChange,
    }),
    [handlers.onSortChange, sortOptions, sortValue],
  );

  const rowEventHandlers = useMemo(
    () => ({
      selectOnClick: true,
      onClick: () => {
        handlers.onStopCreate();
      },
    }),
    [handlers],
  );

  const handleSelectedRowsChange = (rows: Row<JaewonsaengListItem>[]) => {
    if (rows.length > 0) {
      handlers.onStopCreate();
    }
    handlers.onSelectedItemsChange(rows.map((row) => row.original));
  };

  const handleDimmerClick = () => {
    setIsSearchFocused(false);
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const columns: ColumnDef<JaewonsaengListItem, unknown>[] = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: createSortableHeader('이름'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('boninPhoneNumber', {
        header: '전화번호',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('bohojaPhoneNumberFirst', {
        header: '보호자1 전화번호',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('bohojaPhoneNumberSecond', {
        header: '보호자2 전화번호',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('jaewonCategorySangtaeName', {
        header: '재원상태',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('isHadaLinked', {
        header: '하다 연동여부',
        cell: (info) => (info.getValue() ? '연동' : '미연동'),
      }),
      columnHelper.display({
        id: 'divider',
        header: '',
        cell: () => <div style={{ borderLeft: `1px solid ${color.cgrey100}`, height: '100%' }} />,
      }),
      columnHelper.accessor('daepyoJaewonsaengGroupName', {
        header: '대표 재원생 그룹',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('memo', {
        header: '메모',
        cell: (info) => info.getValue() ?? '-',
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
      }),
    ],
    [],
  );

  return (
    <section css={cssObj.listSection}>
      <ToolbarLayout
        search={{
          value: searchTerm,
          onChange: handlers.onSearchChange,
          placeholder: '재원생 이름으로 검색',
        }}
        sort={sortProps}
        totalCount={totalCount}
        onSearchFocusChange={setIsSearchFocused}
      />
      <ListSection
        data={data}
        columns={columns}
        state={state}
        primaryAction={{
          label: '새 재원생 추가',
          onClick: handlers.onAddClick,
          disabled: isCreating,
        }}
        manualPagination
        manualSorting
        pageCount={totalPages}
        isLoading={isListLoading}
        loadingMessage="재원생 데이터를 불러오는 중입니다..."
        emptyMessage="조건에 맞는 재원생이 없습니다. 검색어나 정렬을 조정해 보세요."
        isDimmed={isSearchFocused}
        rowEventHandlers={rowEventHandlers}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDimmerClick={handleDimmerClick}
        rowProps={(row) => ({
          style: row.original.isHwalseong ? undefined : { color: color.cgrey300 },
        })}
      />
    </section>
  );
}
