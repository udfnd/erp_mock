'use client';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react';

import {
  useBatchlinkPermissionSayongjaMutation,
  useGetPermissionDetailQuery,
  useGetPermissionSayongjasQuery,
  useGetPermissionsQuery,
  useUpdatePermissionMutation,
  type GetPermissionSayongjasResponse,
  type GetPermissionsResponse,
} from '@/api/permission';
import { useGetSayongjasQuery, type GetSayongjasResponse } from '@/api/sayongja';
import { useGetPermissionTypesQuery } from '@/api/system';
import {
  ListViewLayout,
  ListViewPagination,
  ListViewTable,
  type ListViewColumn,
} from '@/app/(erp)/_components/list-view';
import LabeledInput from '@/app/(erp)/td/g/_components/LabeledInput';
import { Search as SearchIcon } from '@/components/icons';
import { Checkbox } from '@/design';
import { Button } from '@/design/components/Button';
import { Filter as FilterButton } from '@/design/components/Filter';

import * as styles from './page.style.css';

const PAGE_SIZE = 20;

type PageProps = {
  params: {
    gi: string;
  };
};

type FilterState = {
  permissionTypes: string[];
};

type SortOption = {
  id: 'nameAsc' | 'nameDesc';
  label: string;
};

type PermissionListItem = GetPermissionsResponse['permissions'][number];
type PermissionTypeOption = {
  value: string;
  label: string;
};

type AvailableFilterSets = {
  permissionTypes: Set<string>;
};

type AssignedSayongja = GetPermissionSayongjasResponse['sayongjas'][number];
type AvailableSayongja = GetSayongjasResponse['sayongjas'][number];

const SORT_OPTIONS: SortOption[] = [
  {
    id: 'nameAsc',
    label: '이름 오름차순',
  },
  {
    id: 'nameDesc',
    label: '이름 내림차순',
  },
];

function normalizeFilters(state: FilterState, available: AvailableFilterSets): FilterState {
  return {
    permissionTypes: Array.from(
      new Set(state.permissionTypes.filter((value) => available.permissionTypes.has(value))),
    ),
  };
}

export default function GiPermissionsPage({ params }: PageProps) {
  const { gi } = params;

  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const userPickerRef = useRef<HTMLDivElement | null>(null);

  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({ permissionTypes: [] });
  const [pendingFilters, setPendingFilters] = useState<FilterState>({ permissionTypes: [] });
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPermissionId, setSelectedPermissionId] = useState<string | null>(null);

  const [nameValue, setNameValue] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const [isUserPickerOpen, setUserPickerOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userPickerSelections, setUserPickerSelections] = useState<string[]>([]);
  const [userLinkError, setUserLinkError] = useState<string | null>(null);

  const { data: permissionTypesData } = useGetPermissionTypesQuery();

  const permissionTypeOptions = useMemo<PermissionTypeOption[]>(
    () =>
      (permissionTypesData?.permissionTypes ?? []).map((item) => ({
        value: item.nanoId,
        label: item.name,
      })),
    [permissionTypesData],
  );

  const permissionTypeLabelMap = useMemo(
    () => new Map(permissionTypeOptions.map((option) => [option.value, option.label])),
    [permissionTypeOptions],
  );

  const availableFilterSets = useMemo<AvailableFilterSets>(
    () => ({
      permissionTypes: new Set(permissionTypeOptions.map((option) => option.value)),
    }),
    [permissionTypeOptions],
  );

  const activeFilters = useMemo(
    () => normalizeFilters(filters, availableFilterSets),
    [filters, availableFilterSets],
  );

  const pendingFiltersNormalized = useMemo(
    () => normalizeFilters(pendingFilters, availableFilterSets),
    [pendingFilters, availableFilterSets],
  );

  useEffect(() => {
    const removeOutsideClick = (event: MouseEvent) => {
      if (!isFilterOpen) return;
      if (!filterRef.current) return;
      if (filterRef.current.contains(event.target as Node)) return;
      setFilterOpen(false);
      setPendingFilters(normalizeFilters(filters, availableFilterSets));
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', removeOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', removeOutsideClick);
    };
  }, [isFilterOpen, filters, availableFilterSets]);

  useEffect(() => {
    const removeOutsideClick = (event: MouseEvent) => {
      if (!isSortOpen) return;
      if (!sortRef.current) return;
      if (sortRef.current.contains(event.target as Node)) return;
      setSortOpen(false);
    };
    if (isSortOpen) {
      document.addEventListener('mousedown', removeOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', removeOutsideClick);
    };
  }, [isSortOpen]);

  const closeUserPicker = useCallback(() => {
    setUserPickerOpen(false);
    setUserPickerSelections([]);
    setUserSearchTerm('');
    setUserLinkError(null);
  }, []);

  const openUserPicker = useCallback(() => {
    setUserPickerSelections([]);
    setUserSearchTerm('');
    setUserLinkError(null);
    setUserPickerOpen(true);
  }, []);

  useEffect(() => {
    if (!isUserPickerOpen) return;
    const removeOutsideClick = (event: MouseEvent) => {
      if (!userPickerRef.current) return;
      if (userPickerRef.current.contains(event.target as Node)) return;
      closeUserPicker();
    };
    document.addEventListener('mousedown', removeOutsideClick);
    return () => {
      document.removeEventListener('mousedown', removeOutsideClick);
    };
  }, [isUserPickerOpen, closeUserPicker]);

  const listQueryParams = useMemo(
    () => ({
      gigwanNanoId: gi,
      permissionNameSearch: searchTerm.trim() ? searchTerm.trim() : undefined,
      permissionTypeFilters:
        activeFilters.permissionTypes.length > 0 ? activeFilters.permissionTypes : undefined,
      pageSize: PAGE_SIZE,
      pageNumber: currentPage,
      sortByOption: sortOption.id,
    }),
    [gi, searchTerm, activeFilters.permissionTypes, currentPage, sortOption.id],
  );

  const {
    data: permissionsData,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useGetPermissionsQuery(listQueryParams, {
    enabled: Boolean(gi),
  });

  const permissions = useMemo<PermissionListItem[]>(
    () => permissionsData?.permissions ?? [],
    [permissionsData],
  );

  const totalItems = permissionsData?.paginationData?.totalItemCount ?? permissions.length;
  const pageSize = permissionsData?.paginationData?.pageSize ?? PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPageForDisplay = Math.min(currentPage, totalPages);

  const tableColumns: Array<ListViewColumn<PermissionListItem>> = useMemo(
    () => [
      {
        id: 'name',
        header: '권한 이름',
        render: (row) => row.name,
        align: 'left',
      },
      {
        id: 'type',
        header: '권한 타입',
        render: (row) => row.type.name,
        align: 'center',
      },
      {
        id: 'nanoId',
        header: '권한 코드',
        render: (row) => row.nanoId,
        align: 'right',
      },
    ],
    [],
  );

  const selectedPermissionSummary = useMemo(
    () => permissions.find((item) => item.nanoId === selectedPermissionId) ?? null,
    [permissions, selectedPermissionId],
  );

  const {
    data: permissionDetail,
    isFetching: isPermissionDetailFetching,
  } = useGetPermissionDetailQuery(selectedPermissionId ?? '', {
    enabled: Boolean(selectedPermissionId),
  });

  useEffect(() => {
    if (!permissionDetail) {
      startTransition(() => {
        setNameValue('');
        setNameError(null);
      });
      return;
    }
    startTransition(() => {
      setNameValue(permissionDetail.name ?? '');
      setNameError(null);
    });
  }, [permissionDetail]);

  const updatePermissionMutation = useUpdatePermissionMutation(selectedPermissionId ?? '');

  const handleSavePermissionName = useCallback(() => {
    if (!selectedPermissionId) return;
    const trimmed = nameValue.trim();
    if (!trimmed) {
      setNameError('권한 이름을 입력해주세요.');
      return;
    }
    setNameError(null);
    updatePermissionMutation.mutate(
      { name: trimmed },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['permission', selectedPermissionId] });
          queryClient.invalidateQueries({ queryKey: ['permissions'] });
        },
        onError: () => {
          setNameError('권한 이름 저장에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  }, [nameValue, selectedPermissionId, updatePermissionMutation, queryClient]);

  const {
    data: permissionSayongjasData,
    isFetching: isAssignedUsersFetching,
  } = useGetPermissionSayongjasQuery(selectedPermissionId ?? '', {
    enabled: Boolean(selectedPermissionId),
  });

  const assignedSayongjas = useMemo<AssignedSayongja[]>(
    () => permissionSayongjasData?.sayongjas ?? [],
    [permissionSayongjasData],
  );

  const assignedSayongjaIds = useMemo(
    () => new Set(assignedSayongjas.map((item) => item.nanoId)),
    [assignedSayongjas],
  );

  const userPickerParams = useMemo(
    () => ({
      gigwanNanoId: gi,
      sayongjaNameSearch: userSearchTerm.trim() ? userSearchTerm.trim() : undefined,
      pageSize: 30,
      pageNumber: 1,
      sortByOption: 'nameAsc' as const,
    }),
    [gi, userSearchTerm],
  );

  const { data: availableSayongjasData, isLoading: isAvailableUsersLoading } = useGetSayongjasQuery(
    userPickerParams,
    {
      enabled: isUserPickerOpen && Boolean(gi),
    },
  );

  const availableSayongjas = useMemo<AvailableSayongja[]>(
    () => availableSayongjasData?.sayongjas ?? [],
    [availableSayongjasData],
  );

  const batchlinkPermissionSayongjaMutation = useBatchlinkPermissionSayongjaMutation(
    selectedPermissionId ?? '',
  );

  const handleToggleFilterOption = (value: string) => {
    setPendingFilters((prev) => {
      const base = normalizeFilters(prev, availableFilterSets);
      const current = new Set(base.permissionTypes);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { permissionTypes: Array.from(current) };
    });
  };

  const handleToggleFilterGroup = (values: string[]) => {
    setPendingFilters((prev) => {
      const base = normalizeFilters(prev, availableFilterSets);
      const current = new Set(base.permissionTypes);
      const hasAll = values.every((value) => current.has(value));
      if (hasAll) {
        return { permissionTypes: base.permissionTypes.filter((value) => !values.includes(value)) };
      }
      const merged = new Set(base.permissionTypes);
      values.forEach((value) => merged.add(value));
      return { permissionTypes: Array.from(merged) };
    });
  };

  const handleApplyFilters = () => {
    const normalized = normalizeFilters(pendingFilters, availableFilterSets);
    setFilters(normalized);
    setPendingFilters(normalized);
    setFilterOpen(false);
    setCurrentPage(1);
  };

  const appliedFiltersSummary = useMemo(() => {
    if (activeFilters.permissionTypes.length === 0) {
      return '필터가 적용되지 않았습니다.';
    }
    const labels = activeFilters.permissionTypes
      .map((value) => permissionTypeLabelMap.get(value) ?? value)
      .join(', ');
    return labels;
  }, [activeFilters.permissionTypes, permissionTypeLabelMap]);

  const filterButtonLabel = activeFilters.permissionTypes.length > 0 ? '필터 적용됨' : '필터';
  const sortButtonLabel = sortOption.label;

  const handleRowClick = useCallback(
    (row: PermissionListItem) => {
      closeUserPicker();
      setSelectedPermissionId(row.nanoId);
    },
    [closeUserPicker],
  );

  const handleClearSelection = useCallback(() => {
    closeUserPicker();
    setSelectedPermissionId(null);
  }, [closeUserPicker]);

  const handleToggleUserSelection = useCallback((nanoId: string) => {
    setUserPickerSelections((prev) => {
      if (prev.includes(nanoId)) {
        return prev.filter((id) => id !== nanoId);
      }
      return [...prev, nanoId];
    });
  }, []);

  const handleLinkSelectedUsers = useCallback(() => {
    if (!selectedPermissionId) return;
    if (userPickerSelections.length === 0) {
      setUserLinkError('연결할 사용자를 선택해주세요.');
      return;
    }
    setUserLinkError(null);
    batchlinkPermissionSayongjaMutation.mutate(
      {
        sayongjas: userPickerSelections.map((nanoId) => ({ nanoId })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['permissionSayongjas', selectedPermissionId] });
          closeUserPicker();
        },
        onError: () => {
          setUserLinkError('사용자 연결에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  }, [
    selectedPermissionId,
    userPickerSelections,
    batchlinkPermissionSayongjaMutation,
    queryClient,
    closeUserPicker,
  ]);

  const sidePanelContent = (() => {
    if (!selectedPermissionId) {
      return <div className={styles.placeholder}>좌측 목록에서 권한을 선택하면 정보가 표시됩니다.</div>;
    }

    if (isPermissionDetailFetching) {
      return <div className={styles.placeholder}>선택한 권한 정보를 불러오는 중입니다.</div>;
    }

    if (!permissionDetail) {
      return <div className={styles.placeholder}>선택한 권한 정보를 확인할 수 없습니다.</div>;
    }

    const linkedJojik = Array.isArray(permissionDetail.linkJojik)
      ? permissionDetail.linkJojik
      : permissionDetail.linkJojik
      ? [permissionDetail.linkJojik]
      : [];

    const shouldShowOrganizationNotice = linkedJojik.length !== 1;

    return (
      <div className={styles.sidePanelBody}>
        <div className={styles.sidePanelSection}>
          <h3 className={styles.sectionTitle}>기본 정보</h3>
          <p className={styles.sectionDescription}>
            권한 이름을 수정하고 저장할 수 있습니다. 변경 사항은 즉시 적용됩니다.
          </p>
          <LabeledInput
            label="권한 이름"
            value={nameValue}
            onValueChange={(value) => {
              setNameValue(value);
              setNameError(null);
            }}
            status={nameError ? 'negative' : 'normal'}
            helperText={nameError ?? undefined}
            placeholder="권한 이름을 입력하세요"
          />
          <div className={styles.sectionActions}>
            <Button
              styleType="solid"
              variant="secondary"
              onClick={handleSavePermissionName}
              disabled={
                updatePermissionMutation.isPending ||
                !nameValue.trim() ||
                nameValue.trim() === (permissionDetail.name ?? '').trim()
              }
            >
              저장
            </Button>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>권한 코드</span>
            <span className={styles.infoValue}>{permissionDetail.nanoId}</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>권한 타입</span>
            <span className={styles.infoValue}>{permissionDetail.type.name}</span>
          </div>
        </div>

        <div className={styles.sidePanelSection}>
          <h3 className={styles.sectionTitle}>연결된 조직</h3>
          {shouldShowOrganizationNotice ? (
            <div className={styles.connectionPlaceholder}>조직 선택 기능은 준비중입니다.</div>
          ) : (
            <div className={styles.organizationInfo}>
              <span className={styles.organizationName}>{linkedJojik[0].name}</span>
              <span className={styles.organizationMeta}>{linkedJojik[0].nanoId}</span>
            </div>
          )}
        </div>

        <div className={styles.sidePanelSection}>
          <div className={styles.connectionHeader}>
            <div className={styles.connectionTitleGroup}>
              <h3 className={styles.sectionTitle}>연결 객체들</h3>
              <p className={styles.sectionDescription}>
                권한이 부여된 사용자 목록을 확인하고 새로운 사용자를 연결할 수 있습니다.
              </p>
            </div>
            <div ref={userPickerRef} className={styles.userAddContainer}>
              <Button
                styleType="solid"
                variant="secondary"
                onClick={() => {
                  if (isUserPickerOpen) {
                    closeUserPicker();
                  } else {
                    openUserPicker();
                  }
                }}
                disabled={batchlinkPermissionSayongjaMutation.isPending}
              >
                사용자 추가
              </Button>
              {isUserPickerOpen ? (
                <div className={styles.userPicker}>
                  <div className={styles.userPickerSearch}>
                    <SearchIcon className={styles.userPickerSearchIcon} width={16} height={16} />
                    <input
                      type="search"
                      className={styles.userPickerInput}
                      placeholder="사용자 이름 검색"
                      value={userSearchTerm}
                      onChange={(event) => setUserSearchTerm(event.target.value)}
                    />
                  </div>
                  <div className={styles.userPickerList}>
                    {isAvailableUsersLoading ? (
                      <div className={styles.userPickerNotice}>사용자 목록을 불러오는 중입니다.</div>
                    ) : availableSayongjas.length === 0 ? (
                      <div className={styles.userPickerNotice}>표시할 사용자가 없습니다.</div>
                    ) : (
                      availableSayongjas.map((sayongja) => {
                        const isAssigned = assignedSayongjaIds.has(sayongja.nanoId);
                        const isSelected = userPickerSelections.includes(sayongja.nanoId);
                        return (
                          <label key={sayongja.nanoId} className={styles.userPickerItem}>
                            <div className={styles.userPickerItemInfo}>
                              <span className={styles.userName}>{sayongja.name}</span>
                              <span className={styles.userPickerItemMeta}>
                                {sayongja.employedAt ? `입사일 ${sayongja.employedAt}` : '입사 정보 없음'}
                              </span>
                            </div>
                            <Checkbox
                              checked={isSelected || isAssigned}
                              disabled={isAssigned}
                              onChange={() => handleToggleUserSelection(sayongja.nanoId)}
                              ariaLabel={`${sayongja.name} 선택`}
                            />
                          </label>
                        );
                      })
                    )}
                  </div>
                  <div className={styles.userPickerFooter}>
                    <span className={clsx(styles.helperText, userLinkError && styles.errorText)}>
                      {userLinkError
                        ? userLinkError
                        : '이미 연결된 사용자는 선택할 수 없습니다.'}
                    </span>
                    <div className={styles.userPickerActions}>
                      <Button styleType="text" variant="secondary" onClick={closeUserPicker}>
                        닫기
                      </Button>
                      <Button
                        styleType="solid"
                        variant="primary"
                        onClick={handleLinkSelectedUsers}
                        disabled={
                          batchlinkPermissionSayongjaMutation.isPending ||
                          userPickerSelections.length === 0
                        }
                      >
                        연결하기
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {isAssignedUsersFetching ? (
            <div className={styles.connectionPlaceholder}>권한과 연결된 사용자를 불러오는 중입니다.</div>
          ) : assignedSayongjas.length === 0 ? (
            <div className={styles.connectionPlaceholder}>연결된 사용자가 없습니다.</div>
          ) : (
            <ul className={styles.userList}>
              {assignedSayongjas.map((sayongja) => (
                <li key={sayongja.nanoId} className={styles.userListItem}>
                  <div>
                    <span className={styles.userName}>{sayongja.name}</span>
                    <span className={styles.userMeta}>
                      {sayongja.employmentSangtae
                        ? sayongja.employmentSangtae.name
                        : '재직 정보 없음'}
                    </span>
                  </div>
                  <span
                    className={
                      styles.userStatusBadge[sayongja.isHwalseong ? 'active' : 'inactive']
                    }
                  >
                    {sayongja.isHwalseong ? '활성' : '비활성'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  })();

  const listPlaceholderMessage = isListFetching
    ? '권한 목록을 불러오는 중입니다.'
    : '표시할 권한이 없습니다.';

  return (
    <ListViewLayout
      title="권한 목록"
      description="기관의 권한 세트를 조회하고 관리할 수 있는 리스트 뷰입니다."
      meta={<span>{`기관 코드: ${gi}`}</span>}
      headerActions={<span>{`총 ${totalItems.toLocaleString()}개`}</span>}
      filterBar={
        <div className={styles.tableToolbar}>
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <SearchIcon className={styles.searchIcon} width={18} height={18} />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="권한 이름으로 검색"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className={styles.filterButtons}>
              <div ref={filterRef} style={{ position: 'relative' }}>
                <FilterButton
                  styleType="solid"
                  active={isFilterOpen || activeFilters.permissionTypes.length > 0}
                  onClick={() => {
                    setFilterOpen((prev) => !prev);
                    setPendingFilters(normalizeFilters(filters, availableFilterSets));
                  }}
                >
                  {filterButtonLabel}
                </FilterButton>
                {isFilterOpen ? (
                  <div className={styles.filterPopover}>
                    <div className={styles.filterGroup}>
                      <button
                        type="button"
                        className={styles.filterGroupHeader}
                        onClick={() =>
                          handleToggleFilterGroup(permissionTypeOptions.map((option) => option.value))
                        }
                      >
                        권한 타입
                      </button>
                      {permissionTypeOptions.map((option) => (
                        <label key={option.value} className={styles.filterOption}>
                          <span className={styles.filterOptionLabel}>{option.label}</span>
                          <Checkbox
                            checked={pendingFiltersNormalized.permissionTypes.includes(option.value)}
                            onChange={() => handleToggleFilterOption(option.value)}
                          />
                        </label>
                      ))}
                    </div>
                    <div className={styles.filterFooter}>
                      <Button
                        styleType="text"
                        variant="secondary"
                        onClick={() => setPendingFilters({ permissionTypes: [] })}
                      >
                        초기화
                      </Button>
                      <Button styleType="solid" variant="primary" onClick={handleApplyFilters}>
                        적용하기
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
              <div ref={sortRef} style={{ position: 'relative' }}>
                <FilterButton
                  styleType="outlined"
                  active={isSortOpen}
                  onClick={() => setSortOpen((prev) => !prev)}
                >
                  {sortButtonLabel}
                </FilterButton>
                {isSortOpen ? (
                  <div className={styles.sortPopover}>
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={clsx(
                          styles.sortOptionButton,
                          option.id === sortOption.id && styles.sortOptionActive,
                        )}
                        onClick={() => {
                          setSortOption(option);
                          setSortOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <span className={styles.filterSummary}>{appliedFiltersSummary}</span>
        </div>
      }
      list={
        isListLoading ? (
          <div className={styles.placeholder}>권한 목록을 불러오는 중입니다.</div>
        ) : permissions.length === 0 ? (
          <div className={styles.placeholder}>{listPlaceholderMessage}</div>
        ) : (
          <ListViewTable
            columns={tableColumns}
            rows={permissions}
            getRowId={(row) => row.nanoId}
            selectedRowIds={selectedPermissionId ? [selectedPermissionId] : []}
            onRowClick={handleRowClick}
          />
        )
      }
      pagination={
        <ListViewPagination
          currentPage={currentPageForDisplay}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      }
      sidePanel={
        <>
          <div className={styles.sidePanelHeader}>
            <span className={styles.sidePanelTitle}>
              {selectedPermissionSummary?.name ?? '선택된 권한 없음'}
            </span>
            <span className={styles.sidePanelSubtitle}>
              {selectedPermissionSummary
                ? `${selectedPermissionSummary.type.name} · ${selectedPermissionSummary.nanoId}`
                : '권한을 선택하면 상세 정보가 표시됩니다.'}
            </span>
          </div>
          {sidePanelContent}
          {selectedPermissionId ? (
            <div className={styles.panelFooter}>
              <Button styleType="text" variant="secondary" onClick={handleClearSelection}>
                선택 해제
              </Button>
            </div>
          ) : null}
        </>
      }
    />
  );
}
