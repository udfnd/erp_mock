'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  useGetPermissionDetailQuery,
  useGetPermissionsQuery,
  type GetPermissionsResponse,
} from '@/api/permission';
import { useGetPermissionTypesQuery } from '@/api/system';
import {
  ListViewLayout,
  ListViewPagination,
  ListViewTable,
  type ListViewColumn,
} from '@/app/(erp)/_components/list-view';
import { Checkbox } from '@/components/Checkbox';
import { Search as SearchIcon } from '@/components/icons';
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
  id: string;
  label: string;
  comparator: (a: PermissionListItem, b: PermissionListItem) => number;
};

type PermissionListItem = GetPermissionsResponse['permissions'][number];

type PermissionTypeOption = {
  value: string;
  label: string;
};

type AvailableFilterSets = {
  permissionTypes: Set<string>;
};

const SORT_OPTIONS: SortOption[] = [
  {
    id: 'name-asc',
    label: '이름 오름차순',
    comparator: (a, b) => a.name.localeCompare(b.name, 'ko'),
  },
  {
    id: 'name-desc',
    label: '이름 내림차순',
    comparator: (a, b) => b.name.localeCompare(a.name, 'ko'),
  },
  {
    id: 'type-asc',
    label: '타입 오름차순',
    comparator: (a, b) => a.permissionType.localeCompare(b.permissionType, 'ko'),
  },
  {
    id: 'type-desc',
    label: '타입 내림차순',
    comparator: (a, b) => b.permissionType.localeCompare(a.permissionType, 'ko'),
  },
];

export default function GiPermissionsPage({ params }: PageProps) {
  const { gi } = params;

  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({ permissionTypes: [] });
  const [pendingFilters, setPendingFilters] = useState<FilterState>(filters);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: permissionsData, isLoading } = useGetPermissionsQuery();
  const { data: permissionTypesData } = useGetPermissionTypesQuery();

  const permissionTypeOptions = useMemo<PermissionTypeOption[]>(
    () =>
      (permissionTypesData?.permissionTypes ?? []).map((item) => ({
        value: item.name,
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

  const permissions = useMemo<PermissionListItem[]>(() => permissionsData?.permissions ?? [], [
    permissionsData,
  ]);

  const filteredPermissions = useMemo(() => {
    if (activeFilters.permissionTypes.length === 0) {
      return permissions;
    }
    const allowed = new Set(activeFilters.permissionTypes);
    return permissions.filter((item) => allowed.has(item.permissionType));
  }, [permissions, activeFilters.permissionTypes]);

  const searchedPermissions = useMemo(() => {
    const lowered = searchTerm.trim().toLowerCase();
    if (!lowered) {
      return filteredPermissions;
    }
    return filteredPermissions.filter((item) => item.name.toLowerCase().includes(lowered));
  }, [filteredPermissions, searchTerm]);

  const sortedPermissions = useMemo(() => {
    const items = [...searchedPermissions];
    items.sort(sortOption.comparator);
    return items;
  }, [searchedPermissions, sortOption]);

  const totalItems = sortedPermissions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return sortedPermissions.slice(start, start + PAGE_SIZE);
  }, [sortedPermissions, safeCurrentPage]);

  const availableIdSet = useMemo(
    () => new Set(sortedPermissions.map((item) => item.nanoId)),
    [sortedPermissions],
  );

  const displaySelectedIds = useMemo(
    () => selectedIds.filter((id) => availableIdSet.has(id)),
    [selectedIds, availableIdSet],
  );

  const handleSelectionChange = useCallback(
    (nextIds: string[]) => {
      const sanitized = nextIds.filter((id) => availableIdSet.has(id));
      setSelectedIds(sanitized);
    },
    [availableIdSet],
  );

  const selectedItems = useMemo(
    () =>
      displaySelectedIds
        .map((id) => sortedPermissions.find((item) => item.nanoId === id))
        .filter((item): item is PermissionListItem => Boolean(item)),
    [displaySelectedIds, sortedPermissions],
  );

  const primarySelected = selectedItems[0];
  const primarySelectedId = selectedItems.length === 1 ? primarySelected?.nanoId : undefined;

  const { data: primaryDetail, isLoading: isDetailLoading } = useGetPermissionDetailQuery(
    primarySelectedId ?? '',
    {
      enabled: Boolean(primarySelectedId),
    },
  );

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
        render: (row) => row.permissionType,
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

  const sidePanelContent = (() => {
    if (selectedItems.length === 0) {
      return <div className={styles.placeholder}>좌측 목록에서 권한을 선택하면 정보가 표시됩니다.</div>;
    }

    if (selectedItems.length > 1) {
      return (
        <div className={styles.placeholder}>
          {primarySelected?.name} 외 {selectedItems.length - 1}개 권한 설정은 준비중입니다.
        </div>
      );
    }

    if (isDetailLoading) {
      return <div className={styles.placeholder}>선택한 권한 정보를 불러오는 중입니다.</div>;
    }

    if (!primaryDetail) {
      return <div className={styles.placeholder}>선택한 권한 정보를 확인할 수 없습니다.</div>;
    }

    return (
      <div className={styles.sidePanelBody}>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>권한 이름</span>
          <span className={styles.infoValue}>{primaryDetail.name}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>권한 코드</span>
          <span className={styles.infoValue}>{primaryDetail.nanoId}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>권한 타입</span>
          <span className={styles.infoValue}>{primaryDetail.type}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>연결된 조직</span>
          <span className={styles.infoValue}>
            {primaryDetail.linkJojik ? `${primaryDetail.linkJojik.name} (${primaryDetail.linkJojik.nanoId})` : '연결된 조직 없음'}
          </span>
        </div>
      </div>
    );
  })();

  return (
    <ListViewLayout
      title="권한 목록"
      description="기관의 권한 세트를 조회하고 관리할 수 있는 리스트 뷰입니다."
      meta={<span>{`기관 코드: ${gi}`}</span>}
      headerActions={<span>{`총 ${totalItems}개`}</span>}
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
        isLoading ? (
          <div className={styles.placeholder}>권한 목록을 불러오는 중입니다.</div>
        ) : (
          <ListViewTable
            columns={tableColumns}
            rows={paginatedRows}
            getRowId={(row) => row.nanoId}
            selectedRowIds={displaySelectedIds}
            onSelectionChange={handleSelectionChange}
          />
        )
      }
      pagination={
        <ListViewPagination
          currentPage={safeCurrentPage}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      }
      sidePanel={
        <>
          <div className={styles.sidePanelHeader}>
            <span className={styles.sidePanelTitle}>
              {primarySelected
                ? selectedItems.length > 1
                  ? `${primarySelected.name} 외 ${selectedItems.length - 1}개`
                  : primarySelected.name
                : '선택된 권한 없음'}
            </span>
            <span className={styles.sidePanelSubtitle}>
              {selectedItems.length > 0 ? (
                <span className={styles.selectedCount}>{`총 ${selectedItems.length}개 선택됨`}</span>
              ) : (
                '권한을 선택하면 상세 정보가 표시됩니다.'
              )}
            </span>
          </div>
          {sidePanelContent}
          {selectedItems.length > 0 ? (
            <div className={styles.panelFooter}>
              <Button styleType="text" variant="secondary" onClick={() => setSelectedIds([])}>
                선택 해제
              </Button>
            </div>
          ) : null}
        </>
      }
    />
  );
}

function normalizeFilters(state: FilterState, available: AvailableFilterSets): FilterState {
  return {
    permissionTypes: Array.from(
      new Set(state.permissionTypes.filter((value) => available.permissionTypes.has(value))),
    ),
  };
}
