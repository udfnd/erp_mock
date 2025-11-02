'use client';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  useCreateJojikMutation,
  useDeleteJojikMutation,
  useJojikQuery,
  useJojiksQuery,
  useUpdateJojikMutation,
} from '@/api/jojik';
import {
  ListViewLayout,
  ListViewPagination,
  ListViewTable,
  type ListViewColumn,
} from '@/app/(erp)/_components/list-view';
import LabeledInput from '@/app/(erp)/td/g/_components/LabeledInput';
import { Search as SearchIcon } from '@/components/icons';
import { Button, Checkbox, Textfield } from '@/design';
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

export default function GiOrganizationsPage() {
  // ✅ useParams만 사용 (배열 가능성 대비)
  const { gi: rawGi } = useParams<{ gi: string | string[] }>();
  const gi = Array.isArray(rawGi) ? rawGi[0] : rawGi;

  const queryClient = useQueryClient();

  const listQueryParams = useMemo(() => ({ gigwanNanoId: gi }), [gi]);

  const { data, isLoading } = useJojiksQuery(listQueryParams, {
    enabled: Boolean(listQueryParams.gigwanNanoId),
  });
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
    if (isFilterOpen) document.addEventListener('mousedown', removeOutsideClick);
    return () => document.removeEventListener('mousedown', removeOutsideClick);
  }, [isFilterOpen, filters, yearOptions]);

  useEffect(() => {
    const removeOutsideClick = (event: MouseEvent) => {
      if (!isSortOpen) return;
      if (!sortRef.current) return;
      if (sortRef.current.contains(event.target as Node)) return;
      setSortOpen(false);
    };
    if (isSortOpen) document.addEventListener('mousedown', removeOutsideClick);
    return () => document.removeEventListener('mousedown', removeOutsideClick);
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
    if (nameRangeSummary && yearSummary) return `${nameRangeSummary} | ${yearSummary}`;
    return nameRangeSummary || yearSummary;
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

  const availableIdSet = useMemo(
    () => new Set(sortedJojiks.map((item) => item.nanoId)),
    [sortedJojiks],
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
        .map((id) => sortedJojiks.find((item) => item.nanoId === id))
        .filter((item): item is JojikListItemView => Boolean(item)),
    [displaySelectedIds, sortedJojiks],
  );

  const primarySelected = selectedItems[0];
  const singleSelected = selectedItems.length === 1 ? selectedItems[0] : null;
  const selectedNanoId = singleSelected?.nanoId ?? '';

  const { data: selectedJojik, isFetching: isSelectedJojikFetching } = useJojikQuery(
    selectedNanoId,
    { enabled: Boolean(selectedNanoId) },
  );

  const updateJojikMutation = useUpdateJojikMutation(selectedNanoId);
  const deleteJojikMutation = useDeleteJojikMutation(selectedNanoId);
  const createJojikMutation = useCreateJojikMutation();

  const [nameValue, setNameValue] = useState('');
  const [introValue, setIntroValue] = useState('');
  const [openSangtaeValue, setOpenSangtaeValue] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [introError, setIntroError] = useState<string | null>(null);
  const [openError, setOpenError] = useState<string | null>(null);
  const [createName, setCreateName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedJojik) {
      startTransition(() => {
        setNameValue('');
        setIntroValue('');
        setOpenSangtaeValue(false);
        setNameError(null);
        setIntroError(null);
        setOpenError(null);
      });
      return;
    }
    startTransition(() => {
      setNameValue(selectedJojik.name ?? '');
      setIntroValue(selectedJojik.intro ?? '');
      setOpenSangtaeValue(Boolean(selectedJojik.openSangtae));
      setNameError(null);
      setIntroError(null);
      setOpenError(null);
    });
  }, [selectedJojik]);

  const handleCreateJojik = useCallback(() => {
    if (!listQueryParams.gigwanNanoId) return;
    const trimmed = createName.trim();
    if (!trimmed) {
      setCreateError('조직명을 입력해주세요.');
      return;
    }
    setCreateError(null);
    createJojikMutation.mutate(
      { name: trimmed, gigwanNanoId: listQueryParams.gigwanNanoId },
      {
        onSuccess: () => {
          setCreateName('');
          queryClient.invalidateQueries({ queryKey: ['jojiks'] });
        },
        onError: () => {
          setCreateError('조직 생성에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  }, [createJojikMutation, createName, listQueryParams.gigwanNanoId, queryClient]);

  const handleSaveName = useCallback(() => {
    if (!selectedNanoId) return;
    const trimmed = nameValue.trim();
    if (!trimmed) {
      setNameError('조직 이름을 입력해주세요.');
      return;
    }
    setNameError(null);
    updateJojikMutation.mutate(
      { name: trimmed },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['jojik', selectedNanoId] });
          queryClient.invalidateQueries({ queryKey: ['jojiks'] });
        },
        onError: () => {
          setNameError('조직 이름 저장에 실패했습니다.');
        },
      },
    );
  }, [nameValue, selectedNanoId, updateJojikMutation, queryClient]);

  const handleSaveIntro = useCallback(() => {
    if (!selectedNanoId) return;
    updateJojikMutation.mutate(
      { intro: introValue },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['jojik', selectedNanoId] });
        },
        onError: () => {
          setIntroError('조직 소개 저장에 실패했습니다.');
        },
      },
    );
  }, [introValue, selectedNanoId, updateJojikMutation, queryClient]);

  const handleSaveOpenSangtae = useCallback(() => {
    if (!selectedNanoId) return;
    updateJojikMutation.mutate(
      { openSangtae: openSangtaeValue },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['jojik', selectedNanoId] });
        },
        onError: () => {
          setOpenError('공개 설정 저장에 실패했습니다.');
        },
      },
    );
  }, [openSangtaeValue, selectedNanoId, updateJojikMutation, queryClient]);

  const handleDeleteJojik = useCallback(() => {
    if (!selectedNanoId) return;
    const confirmed = window.confirm(
      '선택한 조직을 삭제하시겠습니까? 삭제 후에는 되돌릴 수 없습니다.',
    );
    if (!confirmed) return;
    deleteJojikMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jojiks'] });
        queryClient.invalidateQueries({ queryKey: ['jojik', selectedNanoId] });
        setSelectedIds((prev) => prev.filter((id) => id !== selectedNanoId));
      },
    });
  }, [deleteJojikMutation, queryClient, selectedNanoId]);

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
      return (
        <div className={styles.sidePanelBody}>
          <div className={styles.sidePanelSection}>
            <h3 className={styles.sectionTitle}>새 조직 생성</h3>
            <p className={styles.sectionDescription}>
              조직명을 입력하고 저장하면 새로운 조직을 등록할 수 있습니다.
            </p>
            <LabeledInput
              label="조직 이름"
              value={createName}
              onValueChange={(value) => {
                setCreateName(value);
                setCreateError(null);
              }}
              placeholder="예: 행복한 교실"
              status={createError ? 'negative' : 'normal'}
              helperText={createError ?? undefined}
              containerClassName={styles.fullWidthInput}
            />
            <div className={styles.sectionActions}>
              <Button
                styleType="solid"
                variant="primary"
                onClick={handleCreateJojik}
                disabled={createJojikMutation.isPending || createName.trim().length === 0}
              >
                조직 생성
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedItems.length > 1) {
      return (
        <div className={styles.placeholder}>
          선택된 {selectedItems.length}개 조직의 일괄 설정 기능은 준비중입니다.
        </div>
      );
    }

    if (isSelectedJojikFetching) {
      return <div className={styles.placeholder}>조직 정보를 불러오는 중입니다.</div>;
    }

    if (!selectedJojik) {
      return (
        <div className={styles.placeholder}>
          조직 상세 정보를 불러오지 못했습니다. 다시 시도해주세요.
        </div>
      );
    }

    return (
      <div className={styles.sidePanelBody}>
        <div className={styles.sidePanelSection}>
          <h3 className={styles.sectionTitle}>기본 정보</h3>
          <p className={styles.sectionDescription}>
            조직의 이름과 소개를 수정하고 저장할 수 있습니다.
          </p>
          <LabeledInput
            label="조직 이름"
            value={nameValue}
            onValueChange={(value) => {
              setNameValue(value);
              setNameError(null);
            }}
            status={nameError ? 'negative' : 'normal'}
            helperText={nameError ?? undefined}
            containerClassName={styles.fullWidthInput}
          />
          <div className={styles.sectionActions}>
            <Button
              styleType="solid"
              variant="secondary"
              onClick={handleSaveName}
              disabled={
                updateJojikMutation.isPending ||
                nameValue.trim().length === 0 ||
                nameValue.trim() === selectedJojik.name.trim()
              }
            >
              저장
            </Button>
          </div>
          <Textfield
            label="조직 소개"
            value={introValue}
            onValueChange={(value) => {
              setIntroValue(value);
              setIntroError(null);
            }}
            placeholder="조직 소개를 입력하세요"
            resize="limit"
            className={styles.fullWidthInput}
            status={introError ? 'negative' : 'normal'}
            helperText={introError ?? undefined}
          />
          <div className={styles.sectionActions}>
            <Button
              styleType="solid"
              variant="secondary"
              onClick={handleSaveIntro}
              disabled={updateJojikMutation.isPending || introValue === (selectedJojik.intro ?? '')}
            >
              저장
            </Button>
          </div>
        </div>

        <div className={styles.sidePanelSection}>
          <h3 className={styles.sectionTitle}>공개 설정</h3>
          <div className={styles.toggleRow}>
            <span className={styles.toggleLabel}>조직 정보 공개</span>
            <Checkbox
              checked={openSangtaeValue}
              onChange={(event) => {
                setOpenSangtaeValue(event.target.checked);
                setOpenError(null);
              }}
            />
          </div>
          {openError ? <span className={styles.errorText}>{openError}</span> : null}
          <div className={styles.sectionActions}>
            <Button
              styleType="solid"
              variant="secondary"
              onClick={handleSaveOpenSangtae}
              disabled={
                updateJojikMutation.isPending || openSangtaeValue === selectedJojik.openSangtae
              }
            >
              저장
            </Button>
          </div>
        </div>

        <div className={styles.sidePanelSection}>
          <h3 className={styles.sectionTitle}>추가 정보</h3>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>조직 코드</span>
            <span className={styles.infoValue}>{selectedJojik.nanoId}</span>
          </div>
          {singleSelected ? (
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>생성일</span>
              <span className={styles.infoValue}>{formatDate(singleSelected.createdAt)}</span>
            </div>
          ) : null}
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>재원생 신청 URL</span>
            <a
              href={selectedJojik.jaewonsaengLinkRequestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.infoLink}
            >
              {selectedJojik.jaewonsaengLinkRequestUrl}
            </a>
          </div>
          {selectedJojik.homepageUrl ? (
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>홈페이지</span>
              <a
                href={selectedJojik.homepageUrl.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoLink}
              >
                {selectedJojik.homepageUrl.name}
              </a>
            </div>
          ) : null}
          {selectedJojik.openFiles.length > 0 ? (
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>공개 자료</span>
              <ul className={styles.infoList}>
                {selectedJojik.openFiles.map((file) => (
                  <li key={file.nanoId}>{file.name}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {selectedJojik.juso ? (
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>주소</span>
              <span className={styles.infoValue}>
                {selectedJojik.juso.juso}
                {selectedJojik.juso.jusoDetail ? ` ${selectedJojik.juso.jusoDetail}` : ''}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    );
  })();

  const panelFooter = (() => {
    if (selectedItems.length === 0) return null;
    if (selectedItems.length > 1) {
      return (
        <div className={clsx(styles.panelFooter, styles.panelFooterSingle)}>
          <Button styleType="text" variant="secondary" onClick={() => setSelectedIds([])}>
            선택 해제
          </Button>
        </div>
      );
    }
    return (
      <div className={styles.panelFooter}>
        <Button
          styleType="outlined"
          variant="secondary"
          className={styles.deleteButton}
          onClick={handleDeleteJojik}
          disabled={deleteJojikMutation.isPending}
        >
          조직 삭제
        </Button>
        <Button styleType="text" variant="secondary" onClick={() => setSelectedIds([])}>
          선택 해제
        </Button>
      </div>
    );
  })();

  return (
    <ListViewLayout
      title="조직 목록"
      description="기관에 속한 조직을 조회하고 관리할 수 있는 리스트 뷰입니다."
      meta={<span>{`기관 코드: ${listQueryParams.gigwanNanoId ?? '-'}`}</span>}
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
              {singleSelected
                ? singleSelected.name
                : selectedItems.length > 1
                  ? `${primarySelected?.name ?? ''} 외 ${selectedItems.length - 1}개`
                  : '새 조직 생성'}
            </span>
            <span className={styles.sidePanelSubtitle}>
              {selectedItems.length === 0 ? (
                '조직을 선택하거나 새 조직을 생성하세요.'
              ) : selectedItems.length > 1 ? (
                <span
                  className={styles.selectedCount}
                >{`총 ${selectedItems.length}개 선택됨`}</span>
              ) : (
                <span className={styles.selectedCount}>조직 정보를 수정할 수 있습니다.</span>
              )}
            </span>
          </div>
          {sidePanelContent}
          {panelFooter}
        </>
      }
    />
  );
}

function normalizeFilters(state: FilterState, availableYears: string[]): FilterState {
  const uniqueNameRange = Array.from(new Set(state.nameRange));
  const uniqueYears = Array.from(
    new Set(state.year.filter((year) => availableYears.includes(year))),
  );
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
