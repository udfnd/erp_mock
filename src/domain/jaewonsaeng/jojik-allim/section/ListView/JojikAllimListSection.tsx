'use client';

import { useMemo, useState, useCallback } from 'react';
import type { Row } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

import { ListSection, type ListViewSortProps } from '@/common/lv/component';
import { ToolbarLayout } from '@/common/lv/layout';
import { cssObj as lvCssObj } from '@/common/lv/style';
import { PlusIcon } from '@/common/icons';
import { color } from '@/style';
import type { JojikAllimListSectionProps } from './useJojikAllimListViewSections';
import type { JojikAllimListItem } from '../../api';
import { cssObj } from './styles';

export type JojikAllimListSectionComponentProps = JojikAllimListSectionProps & {
  sortOptions: { label: string; value: string }[];
};

export function JojikAllimListSection({
  data,
  state,
  isListLoading,
  pagination,
  searchTerm,
  sortByOption,
  totalCount,
  totalPages,
  handlers,
  sortOptions,
  columns,
}: JojikAllimListSectionComponentProps) {
  const sortValue = sortByOption;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'jaewonsaeng' | 'bejaewonsaeng' | null>(null);

  const handleCreateClick = useCallback(
    (branch: 'jaewonsaeng' | 'bejaewonsaeng', type: 'normal' | 'template') => {
      handlers.onStartCreate(branch, type);
      setOpenDropdown(null);
    },
    [handlers],
  );

  const handleDimmerClick = useCallback(() => {
    setIsSearchFocused(false);
    setOpenDropdown(null);
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const primaryActionColumn: ColumnDef<JojikAllimListItem> = useMemo(
    () => ({
      id: '__primary_action__',
      header: () => (
        <div css={lvCssObj.headerActionCell}>
          <div css={cssObj.primaryActionButtons}>
            <div css={cssObj.dropdownContainer}>
              <button
                type="button"
                css={cssObj.actionButton(false)}
                onClick={() => setOpenDropdown(openDropdown === 'bejaewonsaeng' ? null : 'bejaewonsaeng')}
              >
                비재원생 발송
                <PlusIcon width={16} height={16} color={`${color.white}`} />
              </button>
              {openDropdown === 'bejaewonsaeng' && (
                <div css={cssObj.actionDropdownMenu}>
                  <div
                    css={cssObj.actionDropdownItem}
                    onClick={() => handleCreateClick('bejaewonsaeng', 'normal')}
                  >
                    일반 생성
                  </div>
                  <div
                    css={cssObj.actionDropdownItem}
                    onClick={() => handleCreateClick('bejaewonsaeng', 'template')}
                  >
                    템플릿 생성
                  </div>
                </div>
              )}
            </div>
            <div css={cssObj.dropdownContainer}>
              <button
                type="button"
                css={cssObj.actionButton(true)}
                onClick={() => setOpenDropdown(openDropdown === 'jaewonsaeng' ? null : 'jaewonsaeng')}
              >
                재원생 발송
                <PlusIcon width={16} height={16} color={`${color.white}`} />
              </button>
              {openDropdown === 'jaewonsaeng' && (
                <div css={cssObj.actionDropdownMenu}>
                  <div
                    css={cssObj.actionDropdownItem}
                    onClick={() => handleCreateClick('jaewonsaeng', 'normal')}
                  >
                    일반 생성
                  </div>
                  <div
                    css={cssObj.actionDropdownItem}
                    onClick={() => handleCreateClick('jaewonsaeng', 'template')}
                  >
                    템플릿 생성
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      cell: () => null,
      enableSorting: false,
      enableColumnFilter: false,
      enableHiding: false,
    }),
    [openDropdown, handleCreateClick],
  );

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
      onClick: () => {},
    }),
    [],
  );

  const handleSelectedRowsChange = (rows: Row<JojikAllimListItem>[]) => {
    handlers.onSelectedJojikAllimsChange(rows.map((row) => row.original));
  };

  const enhancedColumns = useMemo(
    () => [...columns, primaryActionColumn],
    [columns, primaryActionColumn],
  );

  return (
    <section css={cssObj.listSection}>
      <ToolbarLayout
        search={{
          value: searchTerm,
          onChange: handlers.onSearchChange,
          placeholder: '알림 제목으로 검색',
        }}
        sort={sortProps}
        totalCount={totalCount}
        onSearchFocusChange={setIsSearchFocused}
      />
      <ListSection
        data={data}
        columns={enhancedColumns}
        state={state}
        manualPagination
        manualSorting
        pageCount={totalPages}
        isLoading={isListLoading}
        loadingMessage="조직 알림 데이터를 불러오는 중입니다..."
        emptyMessage="조건에 맞는 알림이 없습니다. 검색어를 조정해 보세요."
        isDimmed={isSearchFocused || openDropdown !== null}
        rowEventHandlers={rowEventHandlers}
        onSelectedRowsChange={handleSelectedRowsChange}
        onDimmerClick={handleDimmerClick}
      />
    </section>
  );
}
