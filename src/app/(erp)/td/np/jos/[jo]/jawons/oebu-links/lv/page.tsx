'use client';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  type CreateOebuLinkRequest,
  type GetOebuLinksRequest,
  type OebuLinkListItem,
  type UpdateOebuLinkRequest,
  useCreateOebuLinkMutation,
  useDeleteOebuLinkMutation,
  useGetOebuLinkDetailQuery,
  useGetOebuLinksQuery,
  useUpdateOebuLinkMutation,
} from '@/api/oebu-link';
import { useGetLinkIconsQuery } from '@/api/system';
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

const PAGE_SIZE = 10;

type PageProps = {
  params: {
    jo: string;
  };
};

type PanelMode = 'idle' | 'detail' | 'edit' | 'create';

type FilterState = {
  iconNanoIds: string[];
};

type SortOption = {
  id: 'nameAsc' | 'nameDesc' | 'createdAtAsc' | 'createdAtDesc';
  label: string;
};

type IconOption = {
  value: string;
  label: string;
};

type AvailableFilterSets = {
  iconNanoIds: Set<string>;
};

type OebuLinkFormState = Pick<
  CreateOebuLinkRequest,
  'name' | 'titleName' | 'linkUrl' | 'linkIconNanoId'
>;

type OebuLinkRequestPayload = Omit<CreateOebuLinkRequest, 'gigwanNanoId'>;

const initialFormState: OebuLinkFormState = {
  name: '',
  titleName: '',
  linkUrl: '',
  linkIconNanoId: '',
};

const SORT_OPTIONS: SortOption[] = [
  { id: 'nameAsc', label: '이름 오름차순' },
  { id: 'nameDesc', label: '이름 내림차순' },
  { id: 'createdAtDesc', label: '최근 등록순' },
  { id: 'createdAtAsc', label: '오래된 등록순' },
];

function normalizeFilters(state: FilterState, available: AvailableFilterSets): FilterState {
  return {
    iconNanoIds: Array.from(
      new Set(state.iconNanoIds.filter((value) => available.iconNanoIds.has(value))),
    ),
  };
}

export default function JoResourceExternalLinksPage({ params }: PageProps) {
  const queryClient = useQueryClient();
  const gigwanNanoId = params.jo;

  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('idle');
  const [formState, setFormState] = useState<OebuLinkFormState>(initialFormState);
  const [filters, setFilters] = useState<FilterState>({ iconNanoIds: [] });
  const [pendingFilters, setPendingFilters] = useState<FilterState>({ iconNanoIds: [] });
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);

  const { data: linkIconsData } = useGetLinkIconsQuery();

  const iconOptions = useMemo<IconOption[]>(
    () =>
      (linkIconsData?.linkIcons ?? []).map((icon) => ({
        value: icon.nanoId,
        label: icon.name,
      })),
    [linkIconsData],
  );

  const iconLabelMap = useMemo(() => new Map(iconOptions.map((option) => [option.value, option.label])), [
    iconOptions,
  ]);

  const availableFilterSets = useMemo<AvailableFilterSets>(
    () => ({
      iconNanoIds: new Set(iconOptions.map((option) => option.value)),
    }),
    [iconOptions],
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
    const handleClickOutside = (event: MouseEvent) => {
      if (!isFilterOpen) return;
      if (!filterRef.current) return;
      if (filterRef.current.contains(event.target as Node)) return;
      setFilterOpen(false);
      setPendingFilters(normalizeFilters(filters, availableFilterSets));
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen, filters, availableFilterSets]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isSortOpen) return;
      if (!sortRef.current) return;
      if (sortRef.current.contains(event.target as Node)) return;
      setSortOpen(false);
    };

    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortOpen]);

  const listQueryParams = useMemo<GetOebuLinksRequest>(
    () => ({
      gigwanNanoId,
      nameSearch: searchTerm.trim() ? searchTerm.trim() : undefined,
      iconFilters:
        activeFilters.iconNanoIds.length > 0 ? activeFilters.iconNanoIds.join(',') : undefined,
      pageSize: PAGE_SIZE,
      pageNumber: currentPage,
      sortByOption: sortOption.id,
    }),
    [gigwanNanoId, searchTerm, activeFilters.iconNanoIds, currentPage, sortOption.id],
  );

  const {
    data: oebuLinkListData,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useGetOebuLinksQuery(listQueryParams, { enabled: Boolean(gigwanNanoId) });
  const { data: oebuLinkDetailData, isFetching: isDetailLoading } = useGetOebuLinkDetailQuery(
    selectedRowId ?? '',
    {
      enabled: panelMode !== 'create' && Boolean(selectedRowId),
    },
  );

  const createMutation = useCreateOebuLinkMutation();
  const updateMutation = useUpdateOebuLinkMutation(selectedRowId ?? '');
  const deleteMutation = useDeleteOebuLinkMutation(selectedRowId ?? '');

  const oebuLinks = useMemo<OebuLinkListItem[]>(
    () => oebuLinkListData?.oebuLinks ?? [],
    [oebuLinkListData],
  );

  const paginationData = oebuLinkListData?.paginationData;
  const totalItems = paginationData?.totalItemCount ?? oebuLinks.length;
  const pageSize = paginationData?.pageSize ?? PAGE_SIZE;
  const totalPages = paginationData?.totalPageCount ?? Math.max(1, Math.ceil(totalItems / pageSize));
  const pageItemCount = paginationData?.pageItemCount ?? oebuLinks.length;
  const currentPageForDisplay = paginationData?.pageNumber ?? Math.min(currentPage, totalPages);

  const columns = useMemo<ListViewColumn<OebuLinkListItem>[]>(
    () => [
      {
        id: 'name',
        header: '외부 링크',
        render: (row) => (
          <div className={styles.linkCell}>
            <div className={styles.linkIconWrapper}>
              {row.linkIcon ? (
                <Image
                  src={row.linkIcon}
                  alt={`${row.name} 아이콘`}
                  fill
                  sizes="36px"
                  className={styles.linkIcon}
                  unoptimized
                />
              ) : (
                <span className={styles.linkIconPlaceholder}>{row.name?.[0] ?? '?'}</span>
              )}
            </div>
            <div className={styles.linkInfo}>
              <span className={styles.linkName}>{row.name}</span>
              <span className={styles.linkAlias}>{row.titleName}</span>
            </div>
          </div>
        ),
      },
      {
        id: 'linkUrl',
        header: '링크 주소',
        render: (row) => (
          <a href={row.linkUrl} target="_blank" rel="noreferrer" className={styles.linkUrl}>
            {row.linkUrl}
          </a>
        ),
      },
      {
        id: 'createdBy',
        header: '등록자',
        render: (row) => row.createdBy || <span className={styles.cellMuted}>알 수 없음</span>,
      },
      {
        id: 'createdAt',
        header: '등록일',
        render: (row) => formatDateTime(row.createdAt),
      },
    ],
    [],
  );

  const handleSelectionChange = useCallback((ids: string[]) => {
    const lastId = ids.at(-1) ?? null;
    setSelectedRowId(lastId);
    if (lastId) {
      setPanelMode('detail');
    } else {
      setPanelMode('idle');
    }
  }, []);

  const handleOpenCreate = () => {
    setPanelMode('create');
    setSelectedRowId(null);
    setFormState(initialFormState);
  };

  const handleStartEdit = () => {
    if (!oebuLinkDetailData) return;
    setFormState({
      name: oebuLinkDetailData.name,
      titleName: oebuLinkDetailData.titleName,
      linkUrl: oebuLinkDetailData.linkUrl,
      linkIconNanoId: oebuLinkDetailData.linkIcon,
    });
    setPanelMode('edit');
  };

  const handleSubmitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildCreatePayload(formState, gigwanNanoId);
    if (!payload) return;
    try {
      const result = await createMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: ['oebuLinks'] });
      setCurrentPage(1);
      setSelectedRowId(result.nanoId);
      setPanelMode('detail');
    } catch (error) {
      console.error(error);
      window.alert('외부 링크 등록에 실패했습니다. 입력값을 확인해주세요.');
    }
  };

  const handleSubmitUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRowId) return;
    const payload = buildUpdatePayload(formState);
    if (!payload) return;
    try {
      await updateMutation.mutateAsync(payload);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['oebuLinks'] }),
        queryClient.invalidateQueries({ queryKey: ['oebuLink', selectedRowId] }),
      ]);
      setPanelMode('detail');
    } catch (error) {
      console.error(error);
      window.alert('외부 링크 정보를 수정하지 못했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async () => {
    if (!selectedRowId) return;
    const confirmed = window.confirm(
      '선택한 외부 링크를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.',
    );
    if (!confirmed) return;
    try {
      await deleteMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: ['oebuLinks'] });
      setSelectedRowId(null);
      setPanelMode('idle');
      setFormState(initialFormState);
    } catch (error) {
      console.error(error);
      window.alert('외부 링크 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleToggleFilterOption = (value: string) => {
    setPendingFilters((prev) => {
      const base = normalizeFilters(prev, availableFilterSets);
      const current = new Set(base.iconNanoIds);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { iconNanoIds: Array.from(current) };
    });
  };

  const handleApplyFilters = () => {
    const normalized = normalizeFilters(pendingFilters, availableFilterSets);
    setFilters(normalized);
    setPendingFilters(normalized);
    setFilterOpen(false);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setPendingFilters({ iconNanoIds: [] });
  };

  const filterButtonLabel =
    activeFilters.iconNanoIds.length > 0
      ? `아이콘 필터 (${activeFilters.iconNanoIds.length})`
      : '아이콘 필터';
  const sortButtonLabel = sortOption.label;

  const appliedFiltersSummary = useMemo(() => {
    if (activeFilters.iconNanoIds.length === 0) {
      return '아이콘 필터가 적용되지 않았습니다.';
    }
    const labels = activeFilters.iconNanoIds
      .map((value) => iconLabelMap.get(value) ?? value)
      .join(', ');
    return `선택된 아이콘: ${labels}`;
  }, [activeFilters.iconNanoIds, iconLabelMap]);

  const listPlaceholderMessage = isListFetching
    ? '외부 링크 목록을 불러오는 중입니다.'
    : '조건에 맞는 외부 링크가 없습니다.';

  const sidePanelContent = (() => {
    if (panelMode === 'create') {
      return (
        <form className={styles.sidePanel.form} onSubmit={handleSubmitCreate}>
          <div className={styles.sidePanel.section}>
            <div className={styles.sidePanel.sectionHeader}>
              <span className={styles.sidePanel.sectionTitle}>외부 링크 정보 입력</span>
              <span className={styles.sidePanel.sectionDescription}>
                업무에 필요한 외부 서비스를 연결할 수 있도록 링크 정보를 등록하세요.
              </span>
            </div>
            <div className={styles.sidePanel.formGroup}>
              <LabeledInput
                label="링크 이름"
                placeholder="예: 구글 드라이브"
                required
                value={formState.name}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, name: value }))}
              />
              <LabeledInput
                label="표시 이름"
                placeholder="예: 자료실"
                required
                value={formState.titleName}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, titleName: value }))}
              />
              <LabeledInput
                label="링크 주소"
                type="url"
                placeholder="https://example.com"
                required
                value={formState.linkUrl}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, linkUrl: value }))}
              />
              <Textfield
                label="아이콘 ID"
                placeholder="아이콘 식별자를 입력하세요"
                rows={2}
                resize="none"
                value={formState.linkIconNanoId}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    linkIconNanoId: value,
                  }))
                }
              />
            </div>
          </div>
          <div className={styles.sidePanel.formActions}>
            <Button
              type="button"
              styleType="text"
              variant="secondary"
              onClick={() => {
                if (selectedRowId) {
                  setPanelMode('detail');
                } else {
                  setPanelMode('idle');
                }
              }}
            >
              취소
            </Button>
            <Button
              type="submit"
              styleType="solid"
              variant="primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? '등록 중...' : '외부 링크 등록'}
            </Button>
          </div>
        </form>
      );
    }

    if (!selectedRowId || !oebuLinkDetailData) {
      return (
        <div className={styles.sidePanel.empty}>
          좌측 목록에서 외부 링크를 선택하거나 새로운 링크를 등록하세요.
        </div>
      );
    }

    if (panelMode === 'edit') {
      return (
        <form className={styles.sidePanel.form} onSubmit={handleSubmitUpdate}>
          <div className={styles.sidePanel.section}>
            <div className={styles.sidePanel.sectionHeader}>
              <span className={styles.sidePanel.sectionTitle}>외부 링크 정보 수정</span>
              <span className={styles.sidePanel.sectionDescription}>
                구성원이 자주 사용하는 외부 서비스 정보를 최신 상태로 유지하세요.
              </span>
            </div>
            <div className={styles.sidePanel.formGroup}>
              <LabeledInput
                label="링크 이름"
                required
                value={formState.name}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, name: value }))}
              />
              <LabeledInput
                label="표시 이름"
                required
                value={formState.titleName}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, titleName: value }))}
              />
              <LabeledInput
                label="링크 주소"
                type="url"
                required
                value={formState.linkUrl}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, linkUrl: value }))}
              />
              <Textfield
                label="아이콘 ID"
                rows={2}
                resize="none"
                value={formState.linkIconNanoId}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    linkIconNanoId: value,
                  }))
                }
              />
            </div>
          </div>
          <div className={styles.sidePanel.formActions}>
            <Button
              type="button"
              styleType="text"
              variant="secondary"
              onClick={() => setPanelMode('detail')}
            >
              취소
            </Button>
            <Button
              type="submit"
              styleType="solid"
              variant="primary"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? '저장 중...' : '변경 사항 저장'}
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className={styles.sidePanel.section}>
        <div className={styles.sidePanel.sectionHeader}>
          <span className={styles.sidePanel.sectionTitle}>등록 정보</span>
          <span className={styles.sidePanel.sectionDescription}>
            외부 서비스와의 연결 정보를 확인하고 설정을 변경할 수 있습니다.
          </span>
        </div>
        <div className={styles.sidePanel.infoList}>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>링크 이름</span>
            <span className={styles.sidePanel.infoValue}>{oebuLinkDetailData.name}</span>
          </div>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>표시 이름</span>
            <span className={styles.sidePanel.infoValue}>{oebuLinkDetailData.titleName}</span>
          </div>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>링크 주소</span>
            <span className={styles.sidePanel.infoValue}>
              <a href={oebuLinkDetailData.linkUrl} target="_blank" rel="noreferrer">
                {oebuLinkDetailData.linkUrl}
              </a>
            </span>
          </div>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>아이콘</span>
            <div className={styles.sidePanel.linkPreview}>
              <div className={styles.sidePanel.linkPreviewIcon}>
                {oebuLinkDetailData.linkIcon ? (
                  <Image
                    src={oebuLinkDetailData.linkIcon}
                    alt={`${oebuLinkDetailData.name} 아이콘`}
                    fill
                    sizes="40px"
                    className={styles.sidePanel.linkPreviewImage}
                    unoptimized
                  />
                ) : (
                  <span className={styles.sidePanel.linkPreviewFallback}>
                    {oebuLinkDetailData.name?.[0] ?? '?'}
                  </span>
                )}
              </div>
              <span className={styles.sidePanel.infoValue}>
                {oebuLinkDetailData.linkIcon || '아이콘 정보 없음'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.sidePanel.section}>
          <div className={styles.sidePanel.sectionHeader}>
            <span className={styles.sidePanel.sectionTitle}>이력</span>
            <span className={styles.sidePanel.sectionDescription}>
              언제 등록되고 수정되었는지 확인하세요.
            </span>
          </div>
          <div className={styles.sidePanel.infoList}>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>등록자</span>
              <span className={styles.sidePanel.infoValue}>{oebuLinkDetailData.createdBy}</span>
            </div>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>등록일</span>
              <span className={styles.sidePanel.infoValue}>
                {formatDateTime(oebuLinkDetailData.createdAt)}
              </span>
            </div>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>수정자</span>
              <span className={styles.sidePanel.infoValue}>{oebuLinkDetailData.updatedBy}</span>
            </div>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>수정일</span>
              <span className={styles.sidePanel.infoValue}>
                {formatDateTime(oebuLinkDetailData.updatedAt)}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.sidePanel.linkActions}>
          <Button
            type="button"
            styleType="solid"
            variant="primary"
            onClick={() => window.open(oebuLinkDetailData.linkUrl, '_blank', 'noopener,noreferrer')}
          >
            링크 열기
          </Button>
          <div className={styles.sidePanel.linkActionGroup}>
            <Button styleType="text" variant="secondary" onClick={handleStartEdit}>
              정보 수정
            </Button>
            <Button
              styleType="text"
              variant="secondary"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '삭제 중...' : '삭제하기'}
            </Button>
          </div>
        </div>
      </div>
    );
  })();

  return (
    <ListViewLayout
      title="외부 링크 관리"
      description="조직에서 자주 사용하는 외부 시스템과 자료 링크를 관리합니다."
      meta={<span>{`조직 코드: ${gigwanNanoId}`}</span>}
      headerActions={
        <>
          <span className={styles.headerCounter}>{`전체 외부 링크 (${totalItems.toLocaleString()}개)`}</span>
          <Button styleType="solid" variant="primary" onClick={handleOpenCreate}>
            외부 링크 추가
          </Button>
        </>
      }
      filterBar={
        <div className={styles.tableToolbar}>
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <SearchIcon className={styles.searchIcon} width={18} height={18} />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="링크 이름, 표시 이름, 주소를 검색해 주세요."
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
                  active={isFilterOpen || activeFilters.iconNanoIds.length > 0}
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
                      <span className={styles.filterGroupHeader}>아이콘 선택</span>
                      {iconOptions.length === 0 ? (
                        <span className={styles.filterEmpty}>표시할 아이콘이 없습니다.</span>
                      ) : (
                        iconOptions.map((option) => (
                          <label key={option.value} className={styles.filterOption}>
                            <span className={styles.filterOptionLabel}>{option.label}</span>
                            <Checkbox
                              checked={pendingFiltersNormalized.iconNanoIds.includes(option.value)}
                              onChange={() => handleToggleFilterOption(option.value)}
                            />
                          </label>
                        ))
                      )}
                    </div>
                    <div className={styles.filterFooter}>
                      <Button
                        styleType="text"
                        variant="secondary"
                        onClick={handleResetFilters}
                        disabled={pendingFiltersNormalized.iconNanoIds.length === 0}
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
          <div className={styles.tableMeta}>
            <span className={styles.filterSummary}>{appliedFiltersSummary}</span>
            <span className={styles.tableSummary}>{`조건에 맞는 외부 링크 ${totalItems.toLocaleString()}건 · 현재 페이지 ${pageItemCount.toLocaleString()}건`}</span>
          </div>
        </div>
      }
      list={
        isListLoading ? (
          <div className={styles.listPlaceholder}>외부 링크 목록을 불러오는 중입니다.</div>
        ) : oebuLinks.length === 0 ? (
          <div className={styles.listPlaceholder}>{listPlaceholderMessage}</div>
        ) : (
          <ListViewTable
            columns={columns}
            rows={oebuLinks}
            getRowId={(row) => row.nanoId}
            selectedRowIds={selectedRowId ? [selectedRowId] : []}
            onSelectionChange={handleSelectionChange}
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
          <div className={styles.sidePanel.header}>
            <span className={styles.sidePanel.title}>
              {panelMode === 'create'
                ? '외부 링크 등록'
                : panelMode === 'edit'
                  ? '외부 링크 설정 편집'
                  : selectedRowId
                    ? (oebuLinkDetailData?.name ?? '외부 링크 상세')
                    : '외부 링크 설정'}
            </span>
            <span className={styles.sidePanel.subtitle}>
              {panelMode === 'create'
                ? '새로운 외부 링크를 등록하세요.'
                : selectedRowId
                  ? '외부 링크의 상세 정보와 설정을 확인할 수 있습니다.'
                  : '좌측에서 외부 링크를 선택하면 상세 정보가 표시됩니다.'}
            </span>
          </div>
          <div className={styles.sidePanel.body}>
            {isDetailLoading && panelMode !== 'create'
              ? '정보를 불러오는 중입니다...'
              : sidePanelContent}
          </div>
        </>
      }
    />
  );
}

function buildCreatePayload(
  state: OebuLinkFormState,
  gigwanNanoId: string,
): CreateOebuLinkRequest | null {
  const base = sanitizeFormState(state);
  if (!base) return null;

  return {
    gigwanNanoId,
    ...base,
  };
}

function buildUpdatePayload(state: OebuLinkFormState): UpdateOebuLinkRequest | null {
  const base = sanitizeFormState(state);
  if (!base) return null;

  return base;
}

function sanitizeFormState(state: OebuLinkFormState): OebuLinkRequestPayload | null {
  const name = state.name.trim();
  const titleName = state.titleName.trim();
  const linkUrl = state.linkUrl.trim();
  const linkIconNanoId = state.linkIconNanoId.trim();

  if (!name || !titleName || !linkUrl || !linkIconNanoId) {
    window.alert('링크 이름, 표시 이름, 링크 주소, 아이콘 ID는 모두 필수 입력 항목입니다.');
    return null;
  }

  return {
    name,
    titleName,
    linkUrl,
    linkIconNanoId,
  };
}

function formatDateTime(value: string): string {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return '날짜 정보 없음';
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hour}:${minute}`;
}
