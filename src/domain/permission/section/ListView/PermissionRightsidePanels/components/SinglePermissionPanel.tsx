import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';

import { Button, Textfield } from '@/common/components';
import { ListSection, type ListViewFilter, type ListViewSortProps } from '@/common/lv/component';
import { ToolbarLayout } from '@/common/lv/layout';
import {
  useBatchlinkPermissionSayongjaMutation,
  useGetPermissionDetailQuery,
  useGetPermissionSayongjasQuery,
  useUpdatePermissionMutation,
} from '@/domain/permission/api';
import { type SayongjaListItem, useGetSayongjasQuery } from '@/domain/sayongja/api';
import { useListViewState } from '@/common/lv';
import {
  IS_HWALSEONG_FILTER_OPTIONS,
  SORT_OPTIONS as SAYONGJA_SORT_OPTIONS,
  columnHelper as sayongjaColumnHelper,
  formatDate,
  getSortOptionFromState as getSayongjaSortOptionFromState,
  getSortStateFromOption as getSayongjaSortStateFromOption,
} from '@/domain/sayongja/section/ListView/constants';

import { cssObj } from '../../styles';

export type SinglePermissionPanelProps = {
  nanoId: string;
  gigwanNanoId: string;
  isAuthenticated: boolean;
  onAfterMutation: () => Promise<unknown> | void;
};

export function SinglePermissionPanel({
  nanoId,
  gigwanNanoId,
  isAuthenticated,
  onAfterMutation,
}: SinglePermissionPanelProps) {
  const { data: permissionDetail } = useGetPermissionDetailQuery(nanoId, {
    enabled: isAuthenticated && Boolean(nanoId),
  });
  const { data: sayongjaLinks, refetch: refetchPermissionSayongjas } =
    useGetPermissionSayongjasQuery(nanoId, {
      enabled: isAuthenticated && Boolean(nanoId),
    });
  const updateMutation = useUpdatePermissionMutation(nanoId);
  const batchlinkMutation = useBatchlinkPermissionSayongjaMutation(nanoId);

  const addUserListState = useListViewState<SayongjaListItem>({
    initialSorting: getSayongjaSortStateFromOption('nameAsc'),
    initialPagination: { pageIndex: 0, pageSize: 10 },
  });
  const {
    sorting: addUserSorting,
    pagination: addUserPagination,
    setSorting: setAddUserSorting,
    setPagination: setAddUserPagination,
    setRowSelection: setAddUserRowSelection,
  } = addUserListState;

  const addUserSortValue =
    getSayongjaSortOptionFromState(addUserSorting) ?? userSortOption;

  const resolvedIsHwalseongFilter = userFilters.isHwalseong.includes('true') &&
    !userFilters.isHwalseong.includes('false')
      ? true
      : userFilters.isHwalseong.includes('false') &&
          !userFilters.isHwalseong.includes('true')
        ? false
        : undefined;

  const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
  const [addUserSelection, setAddUserSelection] = useState<Set<string>>(new Set());
  const [activeLinkedTab, setActiveLinkedTab] = useState('users');
  const addUserAnchorRef = useRef<HTMLDivElement>(null);
  const [addUserPopupPosition, setAddUserPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilters, setUserFilters] = useState<{ isHwalseong: string[] }>({ isHwalseong: ['all'] });
  const [userSortOption, setUserSortOption] = useState<string | undefined>('nameAsc');
  const [isUserSearchFocused, setIsUserSearchFocused] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<SayongjaListItem[]>([]);

  const { data: sayongjasData, isLoading: isAddUserLoading } = useGetSayongjasQuery(
    {
      gigwanNanoId,
      sayongjaNameSearch: userSearchTerm ? userSearchTerm : undefined,
      isHwalseongFilter: resolvedIsHwalseongFilter,
      pageNumber: addUserPagination.pageIndex + 1,
      pageSize: addUserPagination.pageSize,
      sortByOption: addUserSortValue,
    },
    {
      enabled: isAuthenticated && Boolean(gigwanNanoId) && isAddUserPopupOpen,
    },
  );
  const availableSayongjas = useMemo(
    () => sayongjasData?.sayongjas ?? [],
    [sayongjasData?.sayongjas],
  );

  const addUserTotalCount =
    (sayongjasData?.paginationData?.totalItemCount as number | undefined) ??
    availableSayongjas.length;
  const addUserTotalPages = Math.max(
    1,
    Math.ceil(addUserTotalCount / Math.max(addUserPagination.pageSize, 1)),
  );

  const addUserColumns = useMemo<ColumnDef<SayongjaListItem, unknown>[]>(
    () => [
      sayongjaColumnHelper.accessor('name', {
        header: '이름',
        cell: (info) => info.getValue(),
      }),
      sayongjaColumnHelper.accessor('employedAt', {
        header: '입사일',
        cell: (info) => formatDate(info.getValue()),
      }),
      sayongjaColumnHelper.accessor('isHwalseong', {
        header: '활성 여부',
        cell: (info) => (info.getValue() ? '활성' : '비활성'),
      }),
    ],
    [],
  );

  const handleUserSearchChange = (value: string) => {
    setUserSearchTerm(value);
    setAddUserPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleUserFilterChange = (value: string[]) => {
    setUserFilters({ isHwalseong: value.length ? value : ['all'] });
    setAddUserPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleUserSortChange = (value: string) => {
    setUserSortOption(value);
    setAddUserSorting(getSayongjaSortStateFromOption(value));
    setAddUserPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSelectedUsersChange = (rows: Row<SayongjaListItem>[]) => {
    const items = rows.map((row) => row.original);
    setAddUserSelection(new Set(items.map((item) => item.nanoId)));
    setSelectedUsers(items);
  };

  const handleUserDimmerClick = () => {
    setIsUserSearchFocused(false);
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const addUserToolbarFilters: ListViewFilter[] = useMemo(
    () => [
      {
        key: 'isHwalseong',
        label: '활성 여부',
        value: userFilters.isHwalseong,
        defaultValue: ['all'],
        options: IS_HWALSEONG_FILTER_OPTIONS,
        onChange: handleUserFilterChange,
      },
    ],
    [handleUserFilterChange, userFilters.isHwalseong],
  );

  const addUserSortProps: ListViewSortProps = useMemo(
    () => ({
      label: '정렬 기준',
      value: addUserSortValue,
      placeholder: '정렬 기준',
      options: SAYONGJA_SORT_OPTIONS,
      onChange: handleUserSortChange,
    }),
    [addUserSortValue, handleUserSortChange],
  );

  useEffect(() => {
    const selectionByIndex: Record<string, boolean> = {};
    availableSayongjas.forEach((item, index) => {
      if (addUserSelection.has(item.nanoId)) {
        selectionByIndex[index.toString()] = true;
      }
    });
    setAddUserRowSelection(selectionByIndex);
  }, [addUserSelection, availableSayongjas, setAddUserRowSelection]);

  useEffect(() => {
    if (!isAddUserPopupOpen) {
      return;
    }

    const updatePosition = () => {
      const anchor = addUserAnchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const left = rect.left - 680 - 12;
      const top = rect.top;

      setAddUserPopupPosition({ left, top });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isAddUserPopupOpen]);

  const [nameInput, setNameInput] = useState<string | null>(null);

  const originalName = permissionDetail?.name ?? '';
  const currentName = nameInput ?? originalName;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = currentName.trim();
    if (!trimmed) return;

    await updateMutation.mutateAsync({ name: trimmed });

    setNameInput(null);
    await onAfterMutation();
  };

  const isSaving = updateMutation.isPending;
  const hasChanged = currentName.trim() !== originalName.trim();

  const closeAddUserPopup = useCallback(() => {
    setIsAddUserPopupOpen(false);
    setAddUserPopupPosition(null);
  }, []);

  const clearAddUserPopup = useCallback(() => {
    closeAddUserPopup();
    setAddUserSelection(new Set());
    setSelectedUsers([]);
    setAddUserRowSelection({});
  }, [closeAddUserPopup, setAddUserRowSelection]);

  const toggleAddUserPopup = useCallback(() => {
    setIsAddUserPopupOpen((prev) => {
      const next = !prev;
      if (!next) {
        setAddUserPopupPosition(null);
      }
      return next;
    });
  }, []);

  const handleApplyAddUsers = useCallback(async () => {
    if (addUserSelection.size === 0) return;
    await batchlinkMutation.mutateAsync({
      sayongjas: Array.from(addUserSelection).map((nanoId) => ({ nanoId })),
    });
    await refetchPermissionSayongjas();
    clearAddUserPopup();
    await onAfterMutation();
  }, [
    addUserSelection,
    batchlinkMutation,
    clearAddUserPopup,
    onAfterMutation,
    refetchPermissionSayongjas,
  ]);

  const linkedObjectTabs = useMemo(
    () => [
      {
        key: 'users',
        label: '사용자들',
        content: (
          <>
            <div>
              <span css={cssObj.tag}>사용자들</span>
            </div>
            <div css={cssObj.listBox}>
              {sayongjaLinks?.sayongjas.map((item) => (
                <div key={item.nanoId} css={cssObj.listRow}>
                  {item.name} {item.employmentSangtae ? `(${item.employmentSangtae.name})` : ''}
                </div>
              ))}
              {sayongjaLinks?.sayongjas.length === 0 ? (
                <p css={cssObj.helperText}>아직 연결된 사용자가 없습니다.</p>
              ) : null}
            </div>
            {/* 앵커 ref 설정 */}
            <div css={cssObj.addUserContainer} ref={addUserAnchorRef}>
              <Button
                styleType="outlined"
                variant="secondary"
                size="small"
                onClick={toggleAddUserPopup}
                aria-expanded={isAddUserPopupOpen}
              >
                사용자 추가
              </Button>
              {isAddUserPopupOpen && addUserPopupPosition ? (
                <div css={cssObj.addUserPopup} style={addUserPopupPosition}>
                  <div css={cssObj.addUserPopupContent}>
                    <ToolbarLayout
                      search={{
                        value: userSearchTerm,
                        onChange: handleUserSearchChange,
                        placeholder: '사용자 이름으로 검색',
                      }}
                      filters={addUserToolbarFilters}
                      sort={addUserSortProps}
                      totalCount={addUserTotalCount}
                      onSearchFocusChange={setIsUserSearchFocused}
                    />
                    <div css={cssObj.popupGrid}>
                      <div css={cssObj.popupTableWrapper}>
                        <ListSection
                          data={availableSayongjas}
                          columns={addUserColumns}
                          state={addUserListState}
                          manualPagination
                          manualSorting
                          pageCount={addUserTotalPages}
                          isLoading={isAddUserLoading}
                          loadingMessage="사용자 데이터를 불러오는 중입니다..."
                          emptyMessage="조건에 맞는 사용자가 없습니다. 검색어나 필터를 조정해 보세요."
                          isDimmed={isUserSearchFocused}
                          rowEventHandlers={{ selectOnClick: true }}
                          onSelectedRowsChange={handleSelectedUsersChange}
                          onDimmerClick={handleUserDimmerClick}
                        />
                      </div>
                      <div css={cssObj.selectedUserPanel}>
                        <span css={cssObj.selectedUserLabel}>선택된 사용자들</span>
                        <div css={cssObj.selectedUserList}>
                          {selectedUsers.length ? (
                            selectedUsers.map((user) => (
                              <div key={user.nanoId} css={cssObj.selectedUserItem}>
                                {user.name}
                                {user.employedAt ? ` · ${formatDate(user.employedAt)}` : ''}
                              </div>
                            ))
                          ) : (
                            <p css={cssObj.helperText}>선택된 사용자가 없습니다.</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div css={cssObj.popupActions}>
                      <Button
                        styleType="solid"
                        variant="secondary"
                        size="small"
                        onClick={handleApplyAddUsers}
                        disabled={addUserSelection.size === 0 || batchlinkMutation.isPending}
                      >
                        적용
                      </Button>
                      <Button
                        styleType="outlined"
                        variant="assistive"
                        size="small"
                        onClick={clearAddUserPopup}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ),
      },
    ],
    [
      addUserColumns,
      addUserListState,
      addUserPopupPosition,
      addUserSelection.size,
      addUserSortProps,
      addUserToolbarFilters,
      addUserTotalCount,
      addUserTotalPages,
      availableSayongjas,
      batchlinkMutation.isPending,
      clearAddUserPopup,
      handleApplyAddUsers,
      handleSelectedUsersChange,
      handleUserDimmerClick,
      handleUserSearchChange,
      isAddUserLoading,
      isAddUserPopupOpen,
      sayongjaLinks?.sayongjas,
      selectedUsers,
      setIsUserSearchFocused,
      toggleAddUserPopup,
      userSearchTerm,
    ],
  );

  const resolvedActiveLinkedTab = useMemo(() => {
    const hasActiveTab = linkedObjectTabs.some((tab) => tab.key === activeLinkedTab);
    return hasActiveTab ? activeLinkedTab : (linkedObjectTabs[0]?.key ?? '');
  }, [activeLinkedTab, linkedObjectTabs]);

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{currentName} 설정</h2>
      </div>
      <form css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>사용자 속성</h3>
          <Textfield
            label="권한 이름"
            value={currentName}
            onValueChange={setNameInput}
            singleLine
            helperText="30자 이내의 권한 이름을 입력해 주세요."
          />
        </div>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelTitle}>연결 객체들</h3>
          <div css={cssObj.linkedNav}>
            {linkedObjectTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                css={[
                  cssObj.linkedNavButton,
                  tab.key === resolvedActiveLinkedTab ? cssObj.linkedNavButtonActive : null,
                ]}
                onClick={() => setActiveLinkedTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div css={cssObj.linkedContent}>
            {linkedObjectTabs.find((tab) => tab.key === resolvedActiveLinkedTab)?.content ?? (
              <p css={cssObj.helperText}>연결된 객체가 없습니다.</p>
            )}
          </div>
        </div>
        <div css={cssObj.panelFooter}>
          <Button type="submit" disabled={isSaving || !hasChanged}>
            저장
          </Button>
        </div>
      </form>
    </>
  );
}
