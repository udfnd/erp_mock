'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import { useJojiksQuery } from '@/api/jojik';
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

const NAME_RANGE_OPTIONS = [
  { value: 'alphabet', label: '알파벳 시작' },
  { value: 'korean', label: '한글 시작' },
  { value: 'others', label: '숫자/기타' },
] as const;

type NameRangeValue = (typeof NAME_RANGE_OPTIONS)[number]['value'];

type SortOption = {
  id: string;
  label: string;
  comparator: (a: JojikListItemView, b: JojikListItemView) => number;
};

type FilterState = {
  nameRange: NameRangeValue[];
  year: string[];
};

type JojikListItemView = {
  nanoId: string;
  name: string;
  createdAt: string;
};

type PageProps = {
  params: {
    gi: string;
  };
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
    id: 'created-desc',
    label: '생성일 최신순',
    comparator: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  },
  {
    id: 'created-asc',
    label: '생성일 오래된순',
    comparator: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  },
];

export default function GiOrganizationsPage({ params }: PageProps) {
  const { gi } = useParams<{ gi: string }>();

  const { data, isLoading } = useJojiksQuery();
  const jojiks = useMemo<JojikListItemView[]>(() => data?.jojiks ?? [], [data]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({ nameRange: [], year: [] });
  const [pendingFilters, setPendingFilters] = useState<FilterState>(filters);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    jojiks.forEach((item) => {
      const timestamp = Date.parse(item.createdAt);
      if (!Number.isNaN(timestamp)) {
        years.add(new Date(timestamp).getFullYear().toString());
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [jojiks]);

  useEffect(() => {
    const removeOutsideClick = (event: MouseEvent) => {
      if (!isFilterOpen) return;
      if (!filterRef.current) return;
      if (filterRef.current.contains(event.target as Node)) return;
      setFilterOpen(false);
      setPendingFilters(normalizeFilters(filters, yearOptions));
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', removeOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', removeOutsideClick);
    };
  }, [isFilterOpen, filters, yearOptions]);

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

  const activeFilters = useMemo(
    () => normalizeFilters(filters, yearOptions),
    [filters, yearOptions],
  );

  const pendingFiltersNormalized = useMemo(
    () => normalizeFilters(pendingFilters, yearOptions),
    [pendingFilters, yearOptions],
  );

  const appliedFiltersSummary = useMemo(() => {
    const nameRangeSummary = activeFilters.nameRange
      .map((value) => NAME_RANGE_OPTIONS.find((option) => option.value === value)?.label ?? value)
      .join(', ');
    const yearSummary = activeFilters.year.map((year) => `${year}년`).join(', ');

    if (!nameRangeSummary && !yearSummary) return '필터가 적용되지 않았습니다.';

    if (nameRangeSummary && yearSummary) {
      return `${nameRangeSummary} | ${yearSummary}`;
    }

    if (nameRangeSummary) {
      return nameRangeSummary;
    }

    return yearSummary;
  }, [activeFilters]);

  const filteredJojiks = useMemo(() => {
    const lowered = searchTerm.trim().toLowerCase();
    const nameRangeSet = new Set(activeFilters.nameRange);
    const yearSet = new Set(activeFilters.year);

    return jojiks.filter((item) => {
      const matchesSearch = lowered.length === 0 || item.name.toLowerCase().includes(lowered);

      const bucket = getNameRangeBucket(item.name);
      const matchesNameRange = nameRangeSet.size === 0 || nameRangeSet.has(bucket);

      const itemYearTimestamp = Date.parse(item.createdAt);
      const itemYear = Number.isNaN(itemYearTimestamp)
        ? null
        : new Date(itemYearTimestamp).getFullYear().toString();
      const matchesYear = yearSet.size === 0 || (itemYear && yearSet.has(itemYear));

      return matchesSearch && matchesNameRange && matchesYear;
    });
  }, [jojiks, searchTerm, activeFilters]);

  const sortedJojiks = useMemo(() => {
    const items = [...filteredJojiks];
    items.sort(sortOption.comparator);
    return items;
  }, [filteredJojiks, sortOption]);

  const totalItems = sortedJojiks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return sortedJojiks.slice(start, start + PAGE_SIZE);
  }, [sortedJojiks, safeCurrentPage]);

  const availableIdSet = useMemo(() => new Set(sortedJojiks.map((item) => item.nanoId)), [sortedJojiks]);

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
        .map((id) => sortedJojiks.find((item) => item.nanoId === id))
        .filter((item): item is JojikListItemView => Boolean(item)),
    [displaySelectedIds, sortedJojiks],
  );

  const primarySelected = selectedItems[0];

  const tableColumns: Array<ListViewColumn<JojikListItemView>> = useMemo(
    () => [
      {
        id: 'name',
        header: '조직 이름',
        align: 'left',
        render: (row) => row.name,
      },
      {
        id: 'createdAt',
        header: '생성일',
        align: 'center',
        render: (row) => formatDate(row.createdAt),
      },
      {
        id: 'nanoId',
        header: '조직 코드',
        align: 'right',
        render: (row) => row.nanoId,
      },
    ],
    [],
  );

  const handleToggleFilterOption = (group: keyof FilterState, value: string) => {
    setPendingFilters((prev) => {
      const base = normalizeFilters(prev, yearOptions);
      const current = new Set(base[group]);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...base, [group]: Array.from(current) };
    });
  };

  const handleToggleFilterGroup = (group: keyof FilterState, options: string[]) => {
    setPendingFilters((prev) => {
      const base = normalizeFilters(prev, yearOptions);
      const current = new Set(base[group]);
      const hasAll = options.every((option) => current.has(option));
      if (hasAll) {
        return { ...base, [group]: base[group].filter((value) => !options.includes(value)) };
      }
      const merged = new Set(base[group]);
      options.forEach((option) => merged.add(option));
      return { ...base, [group]: Array.from(merged) };
    });
  };

  const handleApplyFilters = () => {
    const normalized = normalizeFilters(pendingFilters, yearOptions);
    setFilters(normalized);
    setPendingFilters(normalized);
    setFilterOpen(false);
    setCurrentPage(1);
  };

  const filterButtonLabel =
    activeFilters.nameRange.length + activeFilters.year.length > 0 ? '필터 적용됨' : '필터';

  const sortButtonLabel = sortOption.label;

  const sidePanelContent = (() => {
    if (selectedItems.length === 0) {
      return <div className={styles.placeholder}>좌측 목록에서 조직을 선택하면 상세 정보가 표시됩니다.</div>;
    }

    if (selectedItems.length > 1) {
      return (
        <div className={styles.placeholder}>
          {selectedItems[0]?.name} 외 {selectedItems.length - 1}개 조직 설정은 준비중입니다.
        </div>
      );
    }

    const item = selectedItems[0];
    return (
      <div className={styles.sidePanelBody}>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>조직 이름</span>
          <span className={styles.infoValue}>{item.name}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>조직 코드</span>
          <span className={styles.infoValue}>{item.nanoId}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>생성일</span>
          <span className={styles.infoValue}>{formatDate(item.createdAt)}</span>
        </div>
      </div>
    );
  })();

  return (
    <ListViewLayout
      title="조직 목록"
      description="기관에 속한 조직을 조회하고 관리할 수 있는 리스트 뷰입니다."
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
                placeholder="조직 이름으로 검색"
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
                    isFilterOpen || activeFilters.nameRange.length + activeFilters.year.length > 0
                  }
                  onClick={() => {
                    setFilterOpen((prev) => !prev);
                    setPendingFilters(normalizeFilters(filters, yearOptions));
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
                            'nameRange',
                            NAME_RANGE_OPTIONS.map((option) => option.value),
                          )
                        }
                      >
                        조직 이름
                      </button>
                      {NAME_RANGE_OPTIONS.map((option) => (
                        <label key={option.value} className={styles.filterOption}>
                          <span className={styles.filterOptionLabel}>{option.label}</span>
                          <Checkbox
                            checked={pendingFiltersNormalized.nameRange.includes(option.value)}
                            onChange={() => handleToggleFilterOption('nameRange', option.value)}
                          />
                        </label>
                      ))}
                    </div>
                    <hr className={styles.filterDivider} />
                    <div className={styles.filterGroup}>
                      <button
                        type="button"
                        className={styles.filterGroupHeader}
                        onClick={() => handleToggleFilterGroup('year', yearOptions)}
                      >
                        생성 연도
                      </button>
                      {yearOptions.length === 0 ? (
                        <span className={styles.filterOptionLabel}>표시할 연도가 없습니다.</span>
                      ) : (
                        yearOptions.map((year) => (
                          <label key={year} className={styles.filterOption}>
                            <span className={styles.filterOptionLabel}>{`${year}년`}</span>
                            <Checkbox
                              checked={pendingFiltersNormalized.year.includes(year)}
                              onChange={() => handleToggleFilterOption('year', year)}
                            />
                          </label>
                        ))
                      )}
                    </div>
                    <div className={styles.filterFooter}>
                      <Button
                        styleType="text"
                        variant="secondary"
                        onClick={() => {
                          setPendingFilters({ nameRange: [], year: [] });
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
          <div className={styles.placeholder}>조직 목록을 불러오는 중입니다.</div>
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
                : '선택된 조직 없음'}
            </span>
            <span className={styles.sidePanelSubtitle}>
              {selectedItems.length > 0 ? (
                <span className={styles.selectedCount}>{`총 ${selectedItems.length}개 선택됨`}</span>
              ) : (
                '조직을 선택하면 정보가 표시됩니다.'
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

function normalizeFilters(state: FilterState, availableYears: string[]): FilterState {
  const uniqueNameRange = Array.from(new Set(state.nameRange));
  const uniqueYears = Array.from(new Set(state.year.filter((year) => availableYears.includes(year))));
  return {
    nameRange: uniqueNameRange,
    year: uniqueYears,
  };
}

function getNameRangeBucket(name: string): NameRangeValue {
  const trimmed = name.trim();
  if (!trimmed) return 'others';
  const first = trimmed[0];
  if (/[A-Za-z]/.test(first)) return 'alphabet';
  if (first >= '가' && first <= '힣') return 'korean';
  return 'others';
}

function formatDate(value: string): string {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return '등록일 정보 없음';
  }
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
}
