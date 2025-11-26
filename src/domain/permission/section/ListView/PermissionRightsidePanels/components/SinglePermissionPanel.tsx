import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
} from '@tanstack/react-table';

import { Button, Checkbox, Textfield } from '@/common/components';
import {
  useBatchlinkPermissionSayongjaMutation,
  useGetPermissionDetailQuery,
  useGetPermissionSayongjasQuery,
  useUpdatePermissionMutation,
} from '@/domain/permission/api';
import { useGetSayongjasQuery } from '@/domain/sayongja/api';
import { useJojiksQuery } from '@/domain/jojik/api';
import { useEmploymentCategoriesQuery, useWorkTypeCustomSangtaesQuery } from '@/domain/gigwan/api';
import { columnHelper, formatDate, IS_HWALSEONG_FILTER_OPTIONS, SORT_OPTIONS } from '@/domain/sayongja/section/ListView/constants';

import { cssObj as lvCss } from '@/common/lv/style';

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

  const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
  const [addUserRowSelection, setAddUserRowSelection] = useState<RowSelectionState>({});
  const [addUserSearch, setAddUserSearch] = useState('');
  const [addUserSortByOption, setAddUserSortByOption] = useState<string>('nameAsc');
  const [addUserFilters, setAddUserFilters] = useState({
    jojikNanoIds: ['all'],
    employmentCategoryNanoIds: ['all'],
    workTypeNanoIds: ['all'],
    isHwalseong: ['all'],
  });
  const [activeLinkedTab, setActiveLinkedTab] = useState('users');
  const addUserAnchorRef = useRef<HTMLDivElement>(null);
  const [addUserPopupPosition, setAddUserPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const { data: jojikData } = useJojiksQuery(
    { gigwanNanoId, pageNumber: 1, pageSize: 100 },
    { enabled: isAuthenticated && Boolean(gigwanNanoId) && isAddUserPopupOpen },
  );
  const jojikOptions = useMemo(
    () => [
      { label: '전체 조직', value: 'all' },
      ...(jojikData?.jojiks.map((item) => ({ label: item.name, value: item.nanoId })) ?? []),
    ],
    [jojikData?.jojiks],
  );

  const { data: employmentCategoriesData } = useEmploymentCategoriesQuery(gigwanNanoId, {
    enabled: isAuthenticated && Boolean(gigwanNanoId) && isAddUserPopupOpen,
  });

  const employmentCategoryOptions = useMemo(
    () => [
      { label: '전체 재직 상태', value: 'all' },
      ...(employmentCategoriesData?.categories.flatMap((category) =>
        category.sangtaes.map((item) => ({ label: item.name, value: item.nanoId })),
      ) ?? []),
    ],
    [employmentCategoriesData?.categories],
  );

  const { data: workTypeData } = useWorkTypeCustomSangtaesQuery(gigwanNanoId, {
    enabled: isAuthenticated && Boolean(gigwanNanoId) && isAddUserPopupOpen,
  });

  const workTypeOptions = useMemo(
    () => [
      { label: '전체 근무 형태', value: 'all' },
      ...(workTypeData?.sangtaes.map((item) => ({ label: item.name, value: item.nanoId })) ?? []),
    ],
    [workTypeData?.sangtaes],
  );

  const filterToArray = (values: string[]) => {
    const filtered = values.filter((value) => value !== 'all' && value !== '');
    return filtered.length ? filtered : undefined;
  };

  const isHwalseongFilterSelection = addUserFilters.isHwalseong.filter(
    (value) => value !== 'all' && value !== '',
  );

  const sayongjaQueryParams = {
    gigwanNanoId,
    sayongjaNameSearch: addUserSearch || undefined,
    jojikFilters: filterToArray(addUserFilters.jojikNanoIds),
    employmentCategorySangtaeFilters: filterToArray(addUserFilters.employmentCategoryNanoIds),
    workTypeCustomSangtaeFilters: filterToArray(addUserFilters.workTypeNanoIds),
    isHwalseongFilter:
      isHwalseongFilterSelection.length === 1
        ? isHwalseongFilterSelection[0] === 'true'
        : undefined,
    pageNumber: 1,
    pageSize: 10,
    sortByOption: addUserSortByOption,
  } as const;

  const { data: sayongjasData, isLoading: isAddUserLoading } = useGetSayongjasQuery(
    sayongjaQueryParams,
    {
      enabled: isAuthenticated && Boolean(gigwanNanoId) && isAddUserPopupOpen,
    },
  );
  const availableSayongjas = useMemo(
    () => sayongjasData?.sayongjas ?? [],
    [sayongjasData?.sayongjas],
  );

  useEffect(() => {
    setAddUserRowSelection((prev) => {
      const validIds = new Set(availableSayongjas.map((item) => item.nanoId));
      const nextState: RowSelectionState = {};

      Object.entries(prev).forEach(([key, value]) => {
        if (value && validIds.has(key)) {
          nextState[key] = value;
        }
      });

      return nextState;
    });
  }, [availableSayongjas]);

  useEffect(() => {
    if (!isAddUserPopupOpen) {
      return;
    }

    const updatePosition = () => {
      const anchor = addUserAnchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const left = rect.left - 880 - 12;
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

  const selectedAddUserNanoIds = useMemo(
    () => Object.keys(addUserRowSelection).filter((key) => addUserRowSelection[key]),
    [addUserRowSelection],
  );

  const closeAddUserPopup = useCallback(() => {
    setIsAddUserPopupOpen(false);
    setAddUserPopupPosition(null);
    setAddUserRowSelection({});
  }, []);

  const clearAddUserPopup = useCallback(() => {
    closeAddUserPopup();
    setAddUserSearch('');
    setAddUserSortByOption('nameAsc');
    setAddUserFilters({
      jojikNanoIds: ['all'],
      employmentCategoryNanoIds: ['all'],
      workTypeNanoIds: ['all'],
      isHwalseong: ['all'],
    });
  }, [closeAddUserPopup]);

  const toggleAddUserPopup = useCallback(() => {
    setIsAddUserPopupOpen((prev) => {
      const next = !prev;
      if (!next) {
        setAddUserPopupPosition(null);
        setAddUserRowSelection({});
      }
      return next;
    });
  }, []);

  const handleApplyAddUsers = useCallback(async () => {
    if (selectedAddUserNanoIds.length === 0) return;
    await batchlinkMutation.mutateAsync({
      sayongjas: selectedAddUserNanoIds.map((nanoId) => ({ nanoId })),
    });
    await refetchPermissionSayongjas();
    clearAddUserPopup();
    await onAfterMutation();
  }, [
    batchlinkMutation,
    clearAddUserPopup,
    onAfterMutation,
    refetchPermissionSayongjas,
    selectedAddUserNanoIds,
  ]);

  const addUserColumns = useMemo(
    () => [
      columnHelper.display({
        id: '__selection__',
        header: ({ table }) => (
          <div css={lvCss.selectionCell}>
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected?.()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              ariaLabel="전체 사용자 선택"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div css={lvCss.selectionCell}>
            <Checkbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected?.()}
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
              ariaLabel="사용자 선택"
            />
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor('name', {
        header: '이름',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('employedAt', {
        header: '입사일',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor('isHwalseong', {
        header: '활성 여부',
        cell: (info) => (info.getValue() ? '활성' : '비활성'),
      }),
    ],
    [],
  );

  const addUserTable = useReactTable({
    data: availableSayongjas,
    columns: addUserColumns,
    state: { rowSelection: addUserRowSelection },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setAddUserRowSelection,
    getRowId: (row) => row.nanoId,
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });

  const addUserTableRows = addUserTable.getRowModel().rows;
  const addUserVisibleColumns = addUserTable.getVisibleLeafColumns().length;

  const selectedAddUsers = useMemo(
    () => availableSayongjas.filter((user) => selectedAddUserNanoIds.includes(user.nanoId)),
    [availableSayongjas, selectedAddUserNanoIds],
  );

  const handleFilterChange = (key: keyof typeof addUserFilters) => (value: string) => {
    setAddUserFilters((prev) => ({ ...prev, [key]: value ? [value] : ['all'] }));
  };

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
                  <div css={cssObj.popupHeader}>
                    <Textfield
                      placeholder="사용자 이름으로 검색"
                      value={addUserSearch}
                      onValueChange={setAddUserSearch}
                      singleLine
                    />
                  </div>
                  <div css={cssObj.popupToolbar}>
                    <div css={cssObj.popupControl}>
                      <label css={cssObj.panelLabel}>조직</label>
                      <select
                        css={cssObj.toolbarSelect}
                        value={addUserFilters.jojikNanoIds[0] ?? 'all'}
                        onChange={(event) => handleFilterChange('jojikNanoIds')(event.target.value)}
                      >
                        {jojikOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div css={cssObj.popupControl}>
                      <label css={cssObj.panelLabel}>재직 상태</label>
                      <select
                        css={cssObj.toolbarSelect}
                        value={addUserFilters.employmentCategoryNanoIds[0] ?? 'all'}
                        onChange={(event) =>
                          handleFilterChange('employmentCategoryNanoIds')(event.target.value)
                        }
                      >
                        {employmentCategoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div css={cssObj.popupControl}>
                      <label css={cssObj.panelLabel}>근무 형태</label>
                      <select
                        css={cssObj.toolbarSelect}
                        value={addUserFilters.workTypeNanoIds[0] ?? 'all'}
                        onChange={(event) => handleFilterChange('workTypeNanoIds')(event.target.value)}
                      >
                        {workTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div css={cssObj.popupControl}>
                      <label css={cssObj.panelLabel}>활성 여부</label>
                      <select
                        css={cssObj.toolbarSelect}
                        value={addUserFilters.isHwalseong[0] ?? 'all'}
                        onChange={(event) => handleFilterChange('isHwalseong')(event.target.value)}
                      >
                        {IS_HWALSEONG_FILTER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div css={cssObj.popupControl}>
                      <label css={cssObj.panelLabel}>정렬 기준</label>
                      <select
                        css={cssObj.toolbarSelect}
                        value={addUserSortByOption}
                        onChange={(event) => setAddUserSortByOption(event.target.value)}
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div css={cssObj.popupBody}>
                    <div css={cssObj.popupTableWrapper}>
                      <div css={lvCss.tableWrapperContainer}>
                        <div css={lvCss.tableWrapper}>
                          <table css={lvCss.table}>
                            <thead>
                              {addUserTable.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} css={lvCss.tableHeadRow}>
                                  {headerGroup.headers.map((header) => (
                                    <th key={header.id} css={lvCss.tableHeaderCell} colSpan={header.colSpan}>
                                      {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                  ))}
                                </tr>
                              ))}
                            </thead>
                            <tbody>
                              {isAddUserLoading ? (
                                <tr>
                                  <td css={lvCss.stateCell} colSpan={addUserVisibleColumns}>
                                    사용자 목록을 불러오는 중입니다...
                                  </td>
                                </tr>
                              ) : addUserTableRows.length ? (
                                addUserTableRows.map((row) => (
                                  <tr
                                    key={row.id}
                                    css={[
                                      lvCss.tableRow,
                                      row.getIsSelected() ? lvCss.tableRowSelected : null,
                                    ]}
                                    onClick={() => row.toggleSelected()}
                                  >
                                    {row.getVisibleCells().map((cell) => (
                                      <td key={cell.id} css={lvCss.tableCell}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                      </td>
                                    ))}
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td css={lvCss.stateCell} colSpan={addUserVisibleColumns}>
                                    조건에 맞는 사용자가 없습니다. 검색어나 필터를 조정해 보세요.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div css={cssObj.popupSelectedSection}>
                      <span css={cssObj.panelLabel}>선택된 사용자들</span>
                      <div css={cssObj.chipList}>
                        {selectedAddUsers.length ? (
                          selectedAddUsers.map((user) => (
                            <span key={user.nanoId} css={cssObj.chip}>
                              {user.name}
                            </span>
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
                      disabled={selectedAddUserNanoIds.length === 0 || batchlinkMutation.isPending}
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
              ) : null}
            </div>
          </>
        ),
      },
    ],
    [
      addUserFilters,
      addUserPopupPosition,
      addUserSearch,
      addUserSortByOption,
      addUserTable,
      addUserTableRows,
      addUserVisibleColumns,
      availableSayongjas,
      batchlinkMutation.isPending,
      clearAddUserPopup,
      employmentCategoryOptions,
      handleApplyAddUsers,
      isAddUserLoading,
      isAddUserPopupOpen,
      jojikOptions,
      selectedAddUserNanoIds,
      selectedAddUsers,
      toggleAddUserPopup,
      workTypeOptions,
      sayongjaLinks?.sayongjas,
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
