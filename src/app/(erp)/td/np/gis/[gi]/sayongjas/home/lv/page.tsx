'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useEmploymentCategoriesQuery, useWorkTypeCustomSangtaesQuery } from '@/api/gigwan';
import { useJojiksQuery, type JojikListItem } from '@/api/jojik';
import {
  type GetSayongjasRequest,
  type GetSayongjasResponse,
  useGetSayongjaDetailQuery,
  useGetSayongjasQuery,
} from '@/api/sayongja';
import { useGetSayongjaSangtaesQuery } from '@/api/system';
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

type SortOption = {
  id: string;
  label: string;
  comparator: (a: SayongjaListItem, b: SayongjaListItem) => number;
};

type FilterState = {
  jojiks: string[];
  sayongjaSangtaes: string[];
  employmentCategorySangtaes: string[];
  workTypeSangtaes: string[];
};

type JojikOption = {
  value: string;
  label: string;
};

type EmploymentCategoryGroup = {
  categoryNanoId: string;
  categoryName: string;
  options: Array<{ value: string; label: string }>;
};

type EmploymentCategoryOption = EmploymentCategoryGroup['options'][number] & {
  categoryNanoId: string;
  categoryName: string;
};

type WorkTypeOption = {
  value: string;
  label: string;
};

type SayongjaListItem = GetSayongjasResponse['sayongjas'][number];

type AvailableFilterSets = {
  jojiks: Set<string>;
  sayongjaSangtaes: Set<string>;
  employmentCategorySangtaes: Set<string>;
  workTypeSangtaes: Set<string>;
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
    id: 'employedAt-desc',
    label: '입사일 최신순',
    comparator: (a, b) => compareDates(b.employedAt, a.employedAt),
  },
  {
    id: 'employedAt-asc',
    label: '입사일 오래된순',
    comparator: (a, b) => compareDates(a.employedAt, b.employedAt),
  },
];

export default function GiSayongjasPage({ params }: PageProps) {
  const { gi } = params;

  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    jojiks: [],
    sayongjaSangtaes: [],
    employmentCategorySangtaes: [],
    workTypeSangtaes: [],
  });
  const [pendingFilters, setPendingFilters] = useState<FilterState>(filters);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: jojikData } = useJojiksQuery();
  const { data: sayongjaSangtaeData } = useGetSayongjaSangtaesQuery();
  const { data: employmentCategoriesData } = useEmploymentCategoriesQuery(gi, { enabled: Boolean(gi) });
  const { data: workTypeData } = useWorkTypeCustomSangtaesQuery(gi, { enabled: Boolean(gi) });

  const jojikOptions = useMemo<JojikOption[]>(() => {
    const items: JojikListItem[] = jojikData?.jojiks ?? [];
    return items.map((item) => ({ value: item.nanoId, label: item.name }));
  }, [jojikData]);

  const jojikLabelMap = useMemo(() => new Map(jojikOptions.map((option) => [option.value, option.label])), [
    jojikOptions,
  ]);

  const sayongjaSangtaeOptions = useMemo(
    () =>
      (sayongjaSangtaeData?.sangtaes ?? []).map((item) => ({
        value: item.nanoId,
        label: item.name,
      })),
    [sayongjaSangtaeData],
  );

  const sayongjaSangtaeLabelMap = useMemo(
    () => new Map(sayongjaSangtaeOptions.map((option) => [option.value, option.label])),
    [sayongjaSangtaeOptions],
  );

  const employmentCategoryGroups = useMemo<EmploymentCategoryGroup[]>(
    () =>
      (employmentCategoriesData?.categories ?? []).map((category) => ({
        categoryNanoId: category.nanoId,
        categoryName: category.name,
        options: category.sangtaes.map((sangtae) => ({
          value: sangtae.nanoId,
          label: sangtae.name,
        })),
      })),
    [employmentCategoriesData],
  );

  const employmentCategoryOptions = useMemo<EmploymentCategoryOption[]>(
    () =>
      employmentCategoryGroups.flatMap((group) =>
        group.options.map((option) => ({
          ...option,
          categoryNanoId: group.categoryNanoId,
          categoryName: group.categoryName,
        })),
      ),
    [employmentCategoryGroups],
  );

  const employmentCategoryLabelMap = useMemo(
    () => new Map(employmentCategoryOptions.map((option) => [option.value, option.label])),
    [employmentCategoryOptions],
  );

  const workTypeOptions = useMemo<WorkTypeOption[]>(
    () =>
      (workTypeData?.sangtaes ?? []).map((item) => ({
        value: item.nanoId,
        label: item.name,
      })),
    [workTypeData],
  );

  const workTypeLabelMap = useMemo(
    () => new Map(workTypeOptions.map((option) => [option.value, option.label])),
    [workTypeOptions],
  );

  const availableFilterSets = useMemo<AvailableFilterSets>(
    () => ({
      jojiks: new Set(jojikOptions.map((option) => option.value)),
      sayongjaSangtaes: new Set(sayongjaSangtaeOptions.map((option) => option.value)),
      employmentCategorySangtaes: new Set(employmentCategoryOptions.map((option) => option.value)),
      workTypeSangtaes: new Set(workTypeOptions.map((option) => option.value)),
    }),
    [jojikOptions, sayongjaSangtaeOptions, employmentCategoryOptions, workTypeOptions],
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

  const queryParams = useMemo<GetSayongjasRequest>(() => {
    const params: GetSayongjasRequest = { gigwanNanoId: gi };
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      params.sayongjaNameSearch = trimmedSearch;
    }
    if (activeFilters.jojiks.length > 0) {
      params.jojikFilters = activeFilters.jojiks;
    }
    if (activeFilters.sayongjaSangtaes.length > 0) {
      params.sayongjaSangtaeFilters = activeFilters.sayongjaSangtaes;
    }
    if (activeFilters.employmentCategorySangtaes.length > 0) {
      params.employmentCategorySangtaeFilters = activeFilters.employmentCategorySangtaes;
    }
    if (activeFilters.workTypeSangtaes.length > 0) {
      params.workTypeCustomSangtaeFilters = activeFilters.workTypeSangtaes;
    }
    return params;
  }, [gi, searchTerm, activeFilters]);

  const { data, isLoading } = useGetSayongjasQuery(queryParams, { enabled: Boolean(gi) });

  const sayongjas = useMemo<SayongjaListItem[]>(() => data?.sayongjas ?? [], [data]);

  const filteredSayongjas = useMemo(() => {
    const lowered = searchTerm.trim().toLowerCase();
    if (!lowered) {
      return sayongjas;
    }
    return sayongjas.filter((item) => item.name.toLowerCase().includes(lowered));
  }, [sayongjas, searchTerm]);

  const sortedSayongjas = useMemo(() => {
    const items = [...filteredSayongjas];
    items.sort(sortOption.comparator);
    return items;
  }, [filteredSayongjas, sortOption]);

  const totalItems = sortedSayongjas.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return sortedSayongjas.slice(start, start + PAGE_SIZE);
  }, [sortedSayongjas, safeCurrentPage]);

  const availableIdSet = useMemo(() => new Set(sortedSayongjas.map((item) => item.nanoId)), [sortedSayongjas]);

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
        .map((id) => sortedSayongjas.find((item) => item.nanoId === id))
        .filter((item): item is SayongjaListItem => Boolean(item)),
    [displaySelectedIds, sortedSayongjas],
  );

  const primarySelected = selectedItems[0];
  const primarySelectedId = selectedItems.length === 1 ? primarySelected?.nanoId : undefined;

  const { data: primaryDetail, isLoading: isDetailLoading } = useGetSayongjaDetailQuery(
    primarySelectedId ?? '',
    {
      enabled: Boolean(primarySelectedId),
    },
  );

  const tableColumns: Array<ListViewColumn<SayongjaListItem>> = useMemo(
    () => [
      {
        id: 'name',
        header: '사용자 이름',
        align: 'left',
        render: (row) => row.name,
      },
      {
        id: 'employedAt',
        header: '입사일',
        align: 'center',
        render: (row) => formatDate(row.employedAt),
      },
      {
        id: 'nanoId',
        header: '사용자 코드',
        align: 'right',
        render: (row) => row.nanoId,
      },
    ],
    [],
  );

  const handleToggleFilterOption = (group: keyof FilterState, value: string) => {
    setPendingFilters((prev) => {
      const base = normalizeFilters(prev, availableFilterSets);
      const current = new Set(base[group]);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...base, [group]: Array.from(current) };
    });
  };

  const handleToggleFilterGroup = (group: keyof FilterState, values: string[]) => {
    setPendingFilters((prev) => {
      const base = normalizeFilters(prev, availableFilterSets);
      const current = new Set(base[group]);
      const hasAll = values.every((value) => current.has(value));
      if (hasAll) {
        return { ...base, [group]: base[group].filter((value) => !values.includes(value)) };
      }
      const merged = new Set(base[group]);
      values.forEach((value) => merged.add(value));
      return { ...base, [group]: Array.from(merged) };
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
    const parts: string[] = [];
    if (activeFilters.jojiks.length > 0) {
      const labels = activeFilters.jojiks
        .map((value) => jojikLabelMap.get(value) ?? value)
        .join(', ');
      parts.push(labels);
    }
    if (activeFilters.sayongjaSangtaes.length > 0) {
      const labels = activeFilters.sayongjaSangtaes
        .map((value) => sayongjaSangtaeLabelMap.get(value) ?? value)
        .join(' ');
      parts.push(labels);
    }
    const workTypeLabels = [
      ...activeFilters.employmentCategorySangtaes.map(
        (value) => employmentCategoryLabelMap.get(value) ?? value,
      ),
      ...activeFilters.workTypeSangtaes.map((value) => workTypeLabelMap.get(value) ?? value),
    ].filter(Boolean);
    if (workTypeLabels.length > 0) {
      parts.push(workTypeLabels.join(' '));
    }
    if (parts.length === 0) {
      return '필터가 적용되지 않았습니다.';
    }
    return parts.join(' | ');
  }, [
    activeFilters,
    employmentCategoryLabelMap,
    jojikLabelMap,
    sayongjaSangtaeLabelMap,
    workTypeLabelMap,
  ]);

  const filterButtonLabel =
    activeFilters.jojiks.length +
      activeFilters.sayongjaSangtaes.length +
      activeFilters.employmentCategorySangtaes.length +
      activeFilters.workTypeSangtaes.length >
    0
      ? '필터 적용됨'
      : '필터';

  const sortButtonLabel = sortOption.label;

  const sidePanelContent = (() => {
    if (selectedItems.length === 0) {
      return (
        <div className={styles.placeholder}>좌측 목록에서 사용자를 선택하면 상세 정보가 표시됩니다.</div>
      );
    }

    if (selectedItems.length > 1) {
      return (
        <div className={styles.placeholder}>
          {primarySelected?.name} 외 {selectedItems.length - 1}명 사용자 설정은 준비중입니다.
        </div>
      );
    }

    if (isDetailLoading) {
      return <div className={styles.placeholder}>선택한 사용자의 정보를 불러오는 중입니다.</div>;
    }

    if (!primaryDetail) {
      return <div className={styles.placeholder}>선택한 사용자의 정보를 확인할 수 없습니다.</div>;
    }

    return (
      <div className={styles.sidePanelBody}>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>사용자 이름</span>
          <span className={styles.infoValue}>{primaryDetail.name}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>사용자 코드</span>
          <span className={styles.infoValue}>{primaryDetail.nanoId}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>입사일</span>
          <span className={styles.infoValue}>{formatDate(primaryDetail.employedAt)}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>재직 상태</span>
          <span className={styles.infoValue}>{primaryDetail.activeSangtae.name}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>근무 형태</span>
          <span className={styles.infoValue}>
            {primaryDetail.workTypeSangtae?.name ?? '설정되지 않음'}
          </span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>고용 구분</span>
          <span className={styles.infoValue}>
            {primaryDetail.employmentSangtae?.name ?? '설정되지 않음'}
          </span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>로그인 ID</span>
          <span className={styles.infoValue}>{primaryDetail.loginId}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>등록일</span>
          <span className={styles.infoValue}>{formatDate(primaryDetail.createdAt)}</span>
        </div>
      </div>
    );
  })();

  return (
    <ListViewLayout
      title="사용자 목록"
      description="기관에 소속된 사용자를 조회하고 관리할 수 있는 리스트 뷰입니다."
      meta={<span>{`기관 코드: ${gi}`}</span>}
      headerActions={<span>{`총 ${totalItems}명`}</span>}
      filterBar={
        <div className={styles.tableToolbar}>
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <SearchIcon className={styles.searchIcon} width={18} height={18} />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="사용자 이름으로 검색"
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
                  active={
                    isFilterOpen ||
                    activeFilters.jojiks.length +
                      activeFilters.sayongjaSangtaes.length +
                      activeFilters.employmentCategorySangtaes.length +
                      activeFilters.workTypeSangtaes.length >
                      0
                  }
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
                          handleToggleFilterGroup(
                            'jojiks',
                            jojikOptions.map((option) => option.value),
                          )
                        }
                      >
                        권한 조직
                      </button>
                      {jojikOptions.length === 0 ? (
                        <span className={styles.filterHint}>표시할 조직이 없습니다.</span>
                      ) : (
                        jojikOptions.map((option) => (
                          <label key={option.value} className={styles.filterOption}>
                            <span className={styles.filterOptionLabel}>{option.label}</span>
                            <Checkbox
                              checked={pendingFiltersNormalized.jojiks.includes(option.value)}
                              onChange={() => handleToggleFilterOption('jojiks', option.value)}
                            />
                          </label>
                        ))
                      )}
                    </div>
                    <hr className={styles.filterDivider} />
                    <div className={styles.filterGroup}>
                      <button
                        type="button"
                        className={styles.filterGroupHeader}
                        onClick={() =>
                          handleToggleFilterGroup(
                            'sayongjaSangtaes',
                            sayongjaSangtaeOptions.map((option) => option.value),
                          )
                        }
                      >
                        재직 상태
                      </button>
                      {sayongjaSangtaeOptions.length === 0 ? (
                        <span className={styles.filterHint}>설정된 재직 상태가 없습니다.</span>
                      ) : (
                        sayongjaSangtaeOptions.map((option) => (
                          <label key={option.value} className={styles.filterOption}>
                            <span className={styles.filterOptionLabel}>{option.label}</span>
                            <Checkbox
                              checked={pendingFiltersNormalized.sayongjaSangtaes.includes(option.value)}
                              onChange={() => handleToggleFilterOption('sayongjaSangtaes', option.value)}
                            />
                          </label>
                        ))
                      )}
                    </div>
                    <hr className={styles.filterDivider} />
                    <div className={styles.filterGroup}>
                      <button
                        type="button"
                        className={styles.filterGroupHeader}
                        onClick={() => {
                          handleToggleFilterGroup(
                            'employmentCategorySangtaes',
                            employmentCategoryOptions.map((option) => option.value),
                          );
                          handleToggleFilterGroup(
                            'workTypeSangtaes',
                            workTypeOptions.map((option) => option.value),
                          );
                        }}
                      >
                        근무 형태
                      </button>
                      {employmentCategoryGroups.length === 0 && workTypeOptions.length === 0 ? (
                        <span className={styles.filterHint}>선택 가능한 근무 형태가 없습니다.</span>
                      ) : null}
                      {employmentCategoryGroups.map((group) => (
                        <div key={group.categoryNanoId} className={styles.filterSubGroup}>
                          <button
                            type="button"
                            className={styles.filterSubGroupHeader}
                            onClick={() =>
                              handleToggleFilterGroup(
                                'employmentCategorySangtaes',
                                group.options.map((option) => option.value),
                              )
                            }
                          >
                            {group.categoryName}
                          </button>
                          {group.options.map((option) => (
                            <label key={option.value} className={styles.filterOption}>
                              <span className={styles.filterOptionLabel}>{option.label}</span>
                              <Checkbox
                                checked={pendingFiltersNormalized.employmentCategorySangtaes.includes(
                                  option.value,
                                )}
                                onChange={() =>
                                  handleToggleFilterOption('employmentCategorySangtaes', option.value)
                                }
                              />
                            </label>
                          ))}
                        </div>
                      ))}
                      {workTypeOptions.length > 0 ? (
                        <div className={styles.filterSubGroup}>
                          <button
                            type="button"
                            className={styles.filterSubGroupHeader}
                            onClick={() =>
                              handleToggleFilterGroup(
                                'workTypeSangtaes',
                                workTypeOptions.map((option) => option.value),
                              )
                            }
                          >
                            커스텀 근무 형태
                          </button>
                          {workTypeOptions.map((option) => (
                            <label key={option.value} className={styles.filterOption}>
                              <span className={styles.filterOptionLabel}>{option.label}</span>
                              <Checkbox
                                checked={pendingFiltersNormalized.workTypeSangtaes.includes(option.value)}
                                onChange={() => handleToggleFilterOption('workTypeSangtaes', option.value)}
                              />
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className={styles.filterFooter}>
                      <Button
                        styleType="text"
                        variant="secondary"
                        onClick={() => {
                          setPendingFilters({
                            jojiks: [],
                            sayongjaSangtaes: [],
                            employmentCategorySangtaes: [],
                            workTypeSangtaes: [],
                          });
                        }}
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
          <div className={styles.placeholder}>사용자 목록을 불러오는 중입니다.</div>
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
                  ? `${primarySelected.name} 외 ${selectedItems.length - 1}명`
                  : primarySelected.name
                : '선택된 사용자 없음'}
            </span>
            <span className={styles.sidePanelSubtitle}>
              {selectedItems.length > 0 ? (
                <span className={styles.selectedCount}>{`총 ${selectedItems.length}명 선택됨`}</span>
              ) : (
                '사용자를 선택하면 정보가 표시됩니다.'
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
    jojiks: Array.from(new Set(state.jojiks.filter((value) => available.jojiks.has(value)))),
    sayongjaSangtaes: Array.from(
      new Set(state.sayongjaSangtaes.filter((value) => available.sayongjaSangtaes.has(value))),
    ),
    employmentCategorySangtaes: Array.from(
      new Set(
        state.employmentCategorySangtaes.filter((value) => available.employmentCategorySangtaes.has(value)),
      ),
    ),
    workTypeSangtaes: Array.from(
      new Set(state.workTypeSangtaes.filter((value) => available.workTypeSangtaes.has(value))),
    ),
  };
}

function compareDates(a: string, b: string): number {
  const aTime = Date.parse(a);
  const bTime = Date.parse(b);
  if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
  if (Number.isNaN(aTime)) return -1;
  if (Number.isNaN(bTime)) return 1;
  return aTime - bTime;
}

function formatDate(value: string): string {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return '날짜 정보 없음';
  }
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
}
