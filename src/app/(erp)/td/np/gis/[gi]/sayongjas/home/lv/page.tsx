'use client';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';

import { useEmploymentCategoriesQuery, useWorkTypeCustomSangtaesQuery } from '@/api/gigwan';
import { useJojiksQuery } from '@/api/jojik';
import { useGetPermissionsQuery, type GetPermissionsResponse } from '@/api/permission';
import {
  type GetSayongjaDetailResponse,
  type GetSayongjaPermissionsResponse,
  type GetSayongjasRequest,
  type GetSayongjasResponse,
  useBatchlinkSayongjaPermissionsMutation,
  useCreateSayongjaMutation,
  useDeleteSayongjaMutation,
  useGetSayongjaDetailQuery,
  useGetSayongjaPermissionsQuery,
  useGetSayongjasQuery,
  useUpdateSayongjaMutation,
} from '@/api/sayongja';
import {
  ListViewLayout,
  ListViewPagination,
  ListViewTable,
  type ListViewColumn,
} from '@/app/(erp)/_components/list-view';
import { Search as SearchIcon } from '@/components/icons';
import { Checkbox } from '@/design';
import { Button } from '@/design/components/Button';
import { Filter as FilterButton } from '@/design/components/Filter';
import { Toggle } from '@/design/components/Toggle';

import * as styles from './page.style.css';

const PAGE_SIZE = 20;

type PageProps = {
  params: {
    gi: string;
  };
};

type SortOptionId = 'nameAsc' | 'nameDesc' | 'employedAtAsc' | 'employedAtDesc';
type SortOption = {
  id: SortOptionId;
  label: string;
};

type HwalseongFilter = 'all' | 'true' | 'false';

type FilterState = {
  jojiks: string[];
  employmentCategories: string[];
  workTypes: string[];
  isHwalseong: HwalseongFilter;
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
  employmentCategories: Set<string>;
  workTypes: Set<string>;
};

type CreateFormState = {
  name: string;
  loginId: string;
  password: string;
  employedAt: string;
  employmentSangtaeNanoId: string;
  workTypeSangtaeNanoId: string;
  isHwalseong: boolean;
};

type DetailFormState = {
  employmentSangtaeNanoId: string;
  workTypeSangtaeNanoId: string;
  isHwalseong: boolean;
};

const SORT_OPTIONS: SortOption[] = [
  { id: 'nameAsc', label: '이름 오름차순' },
  { id: 'nameDesc', label: '이름 내림차순' },
  { id: 'employedAtDesc', label: '입사일 최신순' },
  { id: 'employedAtAsc', label: '입사일 오래된순' },
];

const INITIAL_FILTER_STATE: FilterState = {
  jojiks: [],
  employmentCategories: [],
  workTypes: [],
  isHwalseong: 'all',
};

const INITIAL_CREATE_FORM: CreateFormState = {
  name: '',
  loginId: '',
  password: '',
  employedAt: '',
  employmentSangtaeNanoId: '',
  workTypeSangtaeNanoId: '',
  isHwalseong: true,
};

export default function GiSayongjasPage({ params }: PageProps) {
  const { gi } = params;

  const queryClient = useQueryClient();

  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const permissionModalRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
  const [permissionSelection, setPermissionSelection] = useState<string[]>([]);
  const [createForm, setCreateForm] = useState<CreateFormState>(() => ({ ...INITIAL_CREATE_FORM }));
  const [createError, setCreateError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const jojikQueryParams = useMemo(
    () => ({
      gigwanNanoId: gi,
      pageSize: 200,
      pageNumber: 1,
    }),
    [gi],
  );

  const { data: jojikData } = useJojiksQuery(jojikQueryParams, {
    enabled: Boolean(gi),
  });

  const { data: employmentCategoriesData } = useEmploymentCategoriesQuery(gi, {
    enabled: Boolean(gi),
  });

  const { data: workTypeData } = useWorkTypeCustomSangtaesQuery(gi, {
    enabled: Boolean(gi),
  });

  const jojikOptions = useMemo<JojikOption[]>(
    () => (jojikData?.jojiks ?? []).map((item) => ({ value: item.nanoId, label: item.name })),
    [jojikData],
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

  const workTypeOptions = useMemo<WorkTypeOption[]>(
    () => (workTypeData?.sangtaes ?? []).map((item) => ({ value: item.nanoId, label: item.name })),
    [workTypeData],
  );

  const jojikLabelMap = useMemo(
    () => new Map(jojikOptions.map((option) => [option.value, option.label])),
    [jojikOptions],
  );
  const employmentCategoryLabelMap = useMemo(
    () => new Map(employmentCategoryOptions.map((option) => [option.value, option.label])),
    [employmentCategoryOptions],
  );
  const workTypeLabelMap = useMemo(
    () => new Map(workTypeOptions.map((option) => [option.value, option.label])),
    [workTypeOptions],
  );

  const availableFilterSets = useMemo<AvailableFilterSets>(
    () => ({
      jojiks: new Set(jojikOptions.map((option) => option.value)),
      employmentCategories: new Set(employmentCategoryOptions.map((option) => option.value)),
      workTypes: new Set(workTypeOptions.map((option) => option.value)),
    }),
    [jojikOptions, employmentCategoryOptions, workTypeOptions],
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
      setPendingFilters(activeFilters);
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', removeOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', removeOutsideClick);
    };
  }, [isFilterOpen, activeFilters]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isPermissionModalOpen) return;
      if (!permissionModalRef.current) return;
      if (permissionModalRef.current.contains(event.target as Node)) return;
      setPermissionModalOpen(false);
      setPermissionSelection([]);
      setPermissionError(null);
    };
    if (isPermissionModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPermissionModalOpen]);

  const safeCurrentPage = Math.max(1, currentPage);

  const listQueryParams = useMemo<GetSayongjasRequest>(() => {
    const params: GetSayongjasRequest = {
      gigwanNanoId: gi,
      pageNumber: safeCurrentPage,
      pageSize: PAGE_SIZE,
      sortByOption: sortOption.id,
    };
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      params.sayongjaNameSearch = trimmedSearch;
    }
    if (activeFilters.jojiks.length > 0) {
      params.jojikFilters = activeFilters.jojiks;
    }
    if (activeFilters.employmentCategories.length > 0) {
      params.employmentCategorySangtaeFilters = activeFilters.employmentCategories;
    }
    if (activeFilters.workTypes.length > 0) {
      params.workTypeCustomSangtaeFilters = activeFilters.workTypes;
    }
    if (activeFilters.isHwalseong !== 'all') {
      params.isHwalseongFilter = activeFilters.isHwalseong === 'true';
    }
    return params;
  }, [gi, safeCurrentPage, sortOption.id, searchTerm, activeFilters]);

  const {
    data: sayongjaListData,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useGetSayongjasQuery(listQueryParams, {
    enabled: Boolean(gi),
  });

  const sayongjas = useMemo<SayongjaListItem[]>(() => sayongjaListData?.sayongjas ?? [], [sayongjaListData]);
  const paginationData = sayongjaListData?.paginationData;
  const totalItems = paginationData?.totalItemCount ?? sayongjas.length;
  const totalPages = paginationData?.totalPageCount ?? Math.max(1, Math.ceil(Math.max(totalItems, 1) / PAGE_SIZE));
  const currentPageFromServer = paginationData?.pageNumber ?? currentPage;

  const currentRowIdSet = useMemo(() => new Set(sayongjas.map((item) => item.nanoId)), [sayongjas]);

  const selectedRowIdsForPage = useMemo(
    () => selectedIds.filter((id) => currentRowIdSet.has(id)),
    [selectedIds, currentRowIdSet],
  );

  const handleSelectionChange = useCallback(
    (pageSelection: string[]) => {
      setSelectedIds((prev) => {
        const persistent = prev.filter((id) => !currentRowIdSet.has(id));
        const sanitized = pageSelection.filter((id) => currentRowIdSet.has(id));
        return [...persistent, ...sanitized];
      });
    },
    [currentRowIdSet],
  );

  const primarySelectedId = selectedIds.length === 1 ? selectedIds[0] : undefined;

  const { data: primaryDetail, isLoading: isDetailLoading } = useGetSayongjaDetailQuery(primarySelectedId ?? '', {
    enabled: Boolean(primarySelectedId),
  });

  const { data: assignedPermissionsData, isFetching: isPermissionsFetching } = useGetSayongjaPermissionsQuery(
    primarySelectedId ?? '',
    {
      enabled: Boolean(primarySelectedId),
    },
  );

  const updateSayongjaMutation = useUpdateSayongjaMutation(primarySelectedId ?? '');
  const deleteSayongjaMutation = useDeleteSayongjaMutation(primarySelectedId ?? '');
  const batchlinkPermissionsMutation = useBatchlinkSayongjaPermissionsMutation(primarySelectedId ?? '');
  const createSayongjaMutation = useCreateSayongjaMutation();

  const assignedPermissions = useMemo(
    () => assignedPermissionsData?.permissions ?? [],
    [assignedPermissionsData],
  );
  const assignedPermissionIds = useMemo(
    () => new Set(assignedPermissions.map((permission) => permission.nanoId)),
    [assignedPermissions],
  );

  const permissionQueryParams = useMemo(
    () => ({
      gigwanNanoId: gi,
      pageSize: 200,
      pageNumber: 1,
    }),
    [gi],
  );

  const { data: permissionListData } = useGetPermissionsQuery(permissionQueryParams, {
    enabled: isPermissionModalOpen && Boolean(gi),
  });

  const availablePermissions = useMemo(
    () => (permissionListData?.permissions ?? []).filter((permission) => !assignedPermissionIds.has(permission.nanoId)),
    [permissionListData, assignedPermissionIds],
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
        id: 'isHwalseong',
        header: '활성 여부',
        align: 'center',
        render: (row) => (row.isHwalseong ? '활성' : '비활성'),
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

  const appliedFiltersSummary = useMemo(() => {
    const parts: string[] = [];
    if (activeFilters.jojiks.length > 0) {
      const labels = activeFilters.jojiks.map((value) => jojikLabelMap.get(value) ?? value).join(', ');
      parts.push(labels);
    }
    if (activeFilters.employmentCategories.length > 0) {
      const labels = activeFilters.employmentCategories
        .map((value) => employmentCategoryLabelMap.get(value) ?? value)
        .join(', ');
      parts.push(labels);
    }
    if (activeFilters.workTypes.length > 0) {
      const labels = activeFilters.workTypes
        .map((value) => workTypeLabelMap.get(value) ?? value)
        .join(', ');
      parts.push(labels);
    }
    if (activeFilters.isHwalseong !== 'all') {
      parts.push(activeFilters.isHwalseong === 'true' ? '활성 사용자만' : '비활성 사용자만');
    }
    if (parts.length === 0) {
      return '필터가 적용되지 않았습니다.';
    }
    return parts.join(' | ');
  }, [
    activeFilters,
    employmentCategoryLabelMap,
    jojikLabelMap,
    workTypeLabelMap,
  ]);

  const filterAppliedCount =
    activeFilters.jojiks.length +
    activeFilters.employmentCategories.length +
    activeFilters.workTypes.length +
    (activeFilters.isHwalseong === 'all' ? 0 : 1);

  const sortButtonLabel = sortOption.label;
  const filterButtonLabel = filterAppliedCount > 0 ? '필터 적용됨' : '필터';

  const primarySelectedName = primaryDetail?.name
    ?? sayongjas.find((item) => item.nanoId === primarySelectedId)?.name
    ?? (primarySelectedId ? `사용자 ${primarySelectedId}` : undefined);

  const handleToggleFilterOption = (group: keyof FilterState, value: string) => {
    if (group === 'isHwalseong') return;
    setPendingFilters((prev) => {
      const normalized = normalizeFilters(prev, availableFilterSets);
      const current = new Set(normalized[group] as string[]);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...normalized, [group]: Array.from(current) };
    });
  };

  const handleToggleFilterGroup = (group: keyof FilterState, values: string[]) => {
    if (group === 'isHwalseong') return;
    setPendingFilters((prev) => {
      const normalized = normalizeFilters(prev, availableFilterSets);
      const current = new Set(normalized[group] as string[]);
      const hasAll = values.every((value) => current.has(value));
      if (hasAll) {
        return {
          ...normalized,
          [group]: (normalized[group] as string[]).filter((value) => !values.includes(value)),
        };
      }
      const merged = new Set(normalized[group] as string[]);
      values.forEach((value) => merged.add(value));
      return { ...normalized, [group]: Array.from(merged) };
    });
  };

  const handleToggleHwalseongFilter = (value: HwalseongFilter) => {
    setPendingFilters((prev) => {
      const normalized = normalizeFilters(prev, availableFilterSets);
      const nextValue = normalized.isHwalseong === value ? 'all' : value;
      return { ...normalized, isHwalseong: nextValue };
    });
  };

  const handleApplyFilters = () => {
    const normalized = normalizeFilters(pendingFilters, availableFilterSets);
    setFilters(normalized);
    setPendingFilters(normalized);
    setFilterOpen(false);
    setCurrentPage(1);
  };

  const handleClearSelections = () => {
    setSelectedIds([]);
  };

  const handlePermissionSelection = (permissionId: string) => {
    setPermissionSelection((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      }
      return [...prev, permissionId];
    });
  };

  const handlePermissionModalToggle = () => {
    setPermissionModalOpen((prev) => {
      const next = !prev;
      if (next) {
        setPermissionSelection([]);
        setPermissionError(null);
      }
      return next;
    });
  };

  const handlePermissionModalCancel = () => {
    setPermissionModalOpen(false);
    setPermissionSelection([]);
    setPermissionError(null);
  };

  const handlePermissionModalSubmit = () => {
    if (!primarySelectedId) return;
    if (permissionSelection.length === 0) {
      handlePermissionModalCancel();
      return;
    }
    batchlinkPermissionsMutation.mutate(
      { permissions: permissionSelection },
      {
        onSuccess: () => {
          handlePermissionModalCancel();
          queryClient.invalidateQueries({ queryKey: ['sayongjaPermissions', primarySelectedId] });
        },
        onError: () => {
          setPermissionError('권한을 추가하는 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  const handleCreateSubmit = () => {
    const trimmedName = createForm.name.trim();
    const trimmedLoginId = createForm.loginId.trim();
    if (!trimmedName || !trimmedLoginId || !createForm.password.trim() || !createForm.employedAt) {
      setCreateError('이름, 로그인 ID, 비밀번호, 입사일은 필수입니다.');
      return;
    }
    setCreateError(null);
    createSayongjaMutation.mutate(
      {
        name: trimmedName,
        gigwanNanoId: gi,
        employedAt: createForm.employedAt,
        isHwalseong: createForm.isHwalseong,
        employmentSangtaeNanoId: createForm.employmentSangtaeNanoId || null,
        workTypeSangtaeNanoId: createForm.workTypeSangtaeNanoId || null,
        loginId: trimmedLoginId,
        password: createForm.password,
      },
      {
        onSuccess: (result) => {
          setCreateForm({ ...INITIAL_CREATE_FORM });
          setSelectedIds(result.nanoId ? [result.nanoId] : []);
          setCurrentPage(1);
          queryClient.invalidateQueries({ queryKey: ['sayongjas'] });
        },
        onError: () => {
          setCreateError('사용자 생성에 실패했습니다. 입력값을 확인한 후 다시 시도해주세요.');
        },
      },
    );
  };

  const handleDetailFormSave = (form: DetailFormState): Promise<void> => {
    if (!primarySelectedId) {
      return Promise.reject(new Error('선택된 사용자가 없습니다.'));
    }
    return new Promise((resolve, reject) => {
      updateSayongjaMutation.mutate(
        {
          employmentSangtaeNanoId: form.employmentSangtaeNanoId || null,
          workTypeSangtaeNanoId: form.workTypeSangtaeNanoId || null,
          isHwalseong: form.isHwalseong,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sayongja', primarySelectedId] });
            queryClient.invalidateQueries({ queryKey: ['sayongjas'] });
            resolve();
          },
          onError: () => {
            reject(new Error('사용자 정보를 저장하는 중 문제가 발생했습니다. 다시 시도해주세요.'));
          },
        },
      );
    });
  };

  const handleDelete = () => {
    if (!primarySelectedId) return;
    const confirmed = window.confirm('선택한 사용자를 삭제하시겠습니까?');
    if (!confirmed) return;
    deleteSayongjaMutation.mutate(undefined, {
      onSuccess: () => {
        setSelectedIds([]);
        queryClient.invalidateQueries({ queryKey: ['sayongjas'] });
      },
      onError: () => {
        window.alert('사용자 삭제에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  const renderCreateForm = () => (
    <div className={styles.sidePanelBody}>
      <div className={styles.sidePanelSection}>
        <h3 className={styles.sectionTitle}>새 사용자 등록</h3>
        <p className={styles.sectionSubtitle}>기관에 새로운 사용자를 추가할 수 있습니다.</p>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="create-name">
            사용자 이름
          </label>
          <input
            id="create-name"
            className={styles.textInput}
            value={createForm.name}
            onChange={(event) => {
              setCreateForm((prev) => ({ ...prev, name: event.target.value }));
            }}
            placeholder="홍길동"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="create-login-id">
            로그인 ID
          </label>
          <input
            id="create-login-id"
            className={styles.textInput}
            value={createForm.loginId}
            onChange={(event) => {
              setCreateForm((prev) => ({ ...prev, loginId: event.target.value }));
            }}
            placeholder="아이디를 입력하세요"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="create-password">
            비밀번호
          </label>
          <input
            id="create-password"
            className={styles.textInput}
            type="password"
            value={createForm.password}
            onChange={(event) => {
              setCreateForm((prev) => ({ ...prev, password: event.target.value }));
            }}
            placeholder="임시 비밀번호를 입력하세요"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="create-employed-at">
            입사일
          </label>
          <input
            id="create-employed-at"
            className={styles.textInput}
            type="date"
            value={createForm.employedAt}
            onChange={(event) => {
              setCreateForm((prev) => ({ ...prev, employedAt: event.target.value }));
            }}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="create-employment">
            재직 상태
          </label>
          <select
            id="create-employment"
            className={styles.select}
            value={createForm.employmentSangtaeNanoId}
            onChange={(event) => {
              setCreateForm((prev) => ({ ...prev, employmentSangtaeNanoId: event.target.value }));
            }}
          >
            <option value="">설정 안 함</option>
            {employmentCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.categoryName} - {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="create-worktype">
            근무 형태
          </label>
          <select
            id="create-worktype"
            className={styles.select}
            value={createForm.workTypeSangtaeNanoId}
            onChange={(event) => {
              setCreateForm((prev) => ({ ...prev, workTypeSangtaeNanoId: event.target.value }));
            }}
          >
            <option value="">설정 안 함</option>
            {workTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>활성 사용자로 설정</span>
          <Toggle
            active={createForm.isHwalseong}
            onChange={(next) => {
              setCreateForm((prev) => ({ ...prev, isHwalseong: next }));
            }}
          />
        </div>
        {createError ? <p className={styles.errorText}>{createError}</p> : null}
      </div>
      <div className={styles.sectionActions}>
        <Button
          styleType="solid"
          variant="primary"
          onClick={handleCreateSubmit}
          disabled={createSayongjaMutation.isPending}
        >
          {createSayongjaMutation.isPending ? '생성 중...' : '사용자 생성'}
        </Button>
      </div>
    </div>
  );

  const renderMultiSelection = () => (
    <div className={styles.placeholder}>
      선택한 여러 사용자를 한 번에 수정하는 기능은 준비중입니다.
    </div>
  );

  const renderDetailView = () => {
    if (isDetailLoading) {
      return <div className={styles.placeholder}>선택한 사용자의 정보를 불러오는 중입니다.</div>;
    }
    if (!primaryDetail) {
      return <div className={styles.placeholder}>선택한 사용자의 정보를 확인할 수 없습니다.</div>;
    }

    return (
      <SelectedSayongjaPanel
        key={primaryDetail.nanoId}
        detail={primaryDetail}
        employmentCategoryOptions={employmentCategoryOptions}
        workTypeOptions={workTypeOptions}
        onSave={handleDetailFormSave}
        isSaving={updateSayongjaMutation.isPending}
        onDelete={handleDelete}
        isDeleting={deleteSayongjaMutation.isPending}
        assignedPermissions={assignedPermissions}
        isPermissionsFetching={isPermissionsFetching}
        onPermissionModalToggle={handlePermissionModalToggle}
        isPermissionModalOpen={isPermissionModalOpen}
        permissionModalRef={permissionModalRef}
        availablePermissions={availablePermissions}
        permissionSelection={permissionSelection}
        onPermissionSelection={handlePermissionSelection}
        onPermissionSubmit={handlePermissionModalSubmit}
        onPermissionCancel={handlePermissionModalCancel}
        permissionError={permissionError}
        permissionIsSubmitting={batchlinkPermissionsMutation.isPending}
      />
    );
  };

const sidePanelContent = (() => {
  if (selectedIds.length === 0) {
    return renderCreateForm();
  }
  if (selectedIds.length > 1) {
      return renderMultiSelection();
    }
    return renderDetailView();
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
                  active={isFilterOpen || filterAppliedCount > 0}
                  onClick={() => {
                    setFilterOpen((prev) => !prev);
                    setPendingFilters(activeFilters);
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
                      {jojikOptions.map((option) => (
                        <label key={option.value} className={styles.filterOption}>
                          <span className={styles.filterOptionLabel}>{option.label}</span>
                          <Checkbox
                            checked={pendingFiltersNormalized.jojiks.includes(option.value)}
                            onChange={() => handleToggleFilterOption('jojiks', option.value)}
                            ariaLabel={`${option.label} 필터 토글`}
                          />
                        </label>
                      ))}
                    </div>
                    <hr className={styles.filterDivider} />
                    <div className={styles.filterGroup}>
                      <button
                        type="button"
                        className={styles.filterGroupHeader}
                        onClick={() =>
                          handleToggleFilterGroup(
                            'employmentCategories',
                            employmentCategoryOptions.map((option) => option.value),
                          )
                        }
                      >
                        재직 상태
                      </button>
                      {employmentCategoryGroups.map((group) => (
                        <div key={group.categoryNanoId} className={styles.filterSubGroup}>
                          <button
                            type="button"
                            className={styles.filterSubGroupHeader}
                            onClick={() =>
                              handleToggleFilterGroup(
                                'employmentCategories',
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
                                checked={pendingFiltersNormalized.employmentCategories.includes(option.value)}
                                onChange={() =>
                                  handleToggleFilterOption('employmentCategories', option.value)
                                }
                                ariaLabel={`${group.categoryName} ${option.label} 필터 토글`}
                              />
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                    <hr className={styles.filterDivider} />
                    <div className={styles.filterGroup}>
                      <button
                        type="button"
                        className={styles.filterGroupHeader}
                        onClick={() =>
                          handleToggleFilterGroup(
                            'workTypes',
                            workTypeOptions.map((option) => option.value),
                          )
                        }
                      >
                        근무 형태
                      </button>
                      {workTypeOptions.map((option) => (
                        <label key={option.value} className={styles.filterOption}>
                          <span className={styles.filterOptionLabel}>{option.label}</span>
                          <Checkbox
                            checked={pendingFiltersNormalized.workTypes.includes(option.value)}
                            onChange={() => handleToggleFilterOption('workTypes', option.value)}
                            ariaLabel={`${option.label} 근무 형태 필터 토글`}
                          />
                        </label>
                      ))}
                    </div>
                    <hr className={styles.filterDivider} />
                    <div className={styles.filterGroup}>
                      <span className={styles.filterGroupHeader}>활성 상태</span>
                      <label className={styles.filterOption}>
                        <span className={styles.filterOptionLabel}>활성 사용자만</span>
                        <Checkbox
                          checked={pendingFiltersNormalized.isHwalseong === 'true'}
                          onChange={() => handleToggleHwalseongFilter('true')}
                          ariaLabel="활성 사용자 필터"
                        />
                      </label>
                      <label className={styles.filterOption}>
                        <span className={styles.filterOptionLabel}>비활성 사용자만</span>
                        <Checkbox
                          checked={pendingFiltersNormalized.isHwalseong === 'false'}
                          onChange={() => handleToggleHwalseongFilter('false')}
                          ariaLabel="비활성 사용자 필터"
                        />
                      </label>
                      <p className={styles.filterHint}>체크를 해제하면 전체 사용자가 표시됩니다.</p>
                    </div>
                    <div className={styles.filterFooter}>
                      <Button
                        styleType="text"
                        variant="secondary"
                        onClick={() => {
                          setPendingFilters({ ...INITIAL_FILTER_STATE });
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
          {isListFetching ? (
            <span className={styles.fetchStatus}>목록을 새로고침하는 중입니다...</span>
          ) : null}
        </div>
      }
      list={
        isListLoading ? (
          <div className={styles.placeholder}>사용자 목록을 불러오는 중입니다.</div>
        ) : (
          <ListViewTable
            columns={tableColumns}
            rows={sayongjas}
            getRowId={(row) => row.nanoId}
            selectedRowIds={selectedRowIdsForPage}
            onSelectionChange={handleSelectionChange}
          />
        )
      }
      pagination={
        <ListViewPagination
          currentPage={currentPageFromServer}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      }
      sidePanel={
        <>
          <div className={styles.sidePanelHeader}>
            <span className={styles.sidePanelTitle}>
              {selectedIds.length === 0
                ? '새 사용자 등록'
                : selectedIds.length > 1
                ? `${selectedIds.length}명 선택됨`
                : primarySelectedName ?? '선택된 사용자 없음'}
            </span>
            <span className={styles.sidePanelSubtitle}>
              {selectedIds.length > 0 ? (
                <span className={styles.selectedCount}>{`총 ${selectedIds.length}명 선택됨`}</span>
              ) : (
                '선택하지 않은 상태에서는 신규 사용자를 생성할 수 있습니다.'
              )}
            </span>
          </div>
          {sidePanelContent}
          {selectedIds.length > 0 ? (
            <div className={styles.panelFooter}>
              <Button styleType="text" variant="secondary" onClick={handleClearSelections}>
                선택 해제
              </Button>
            </div>
          ) : null}
        </>
      }
    />
  );
}

type AssignedPermission = GetSayongjaPermissionsResponse['permissions'][number];
type PermissionListItem = GetPermissionsResponse['permissions'][number];

type SelectedSayongjaPanelProps = {
  detail: GetSayongjaDetailResponse;
  employmentCategoryOptions: EmploymentCategoryOption[];
  workTypeOptions: WorkTypeOption[];
  onSave: (form: DetailFormState) => Promise<void>;
  isSaving: boolean;
  onDelete: () => void;
  isDeleting: boolean;
  assignedPermissions: AssignedPermission[];
  isPermissionsFetching: boolean;
  onPermissionModalToggle: () => void;
  isPermissionModalOpen: boolean;
  permissionModalRef: RefObject<HTMLDivElement>;
  availablePermissions: PermissionListItem[];
  permissionSelection: string[];
  onPermissionSelection: (permissionId: string) => void;
  onPermissionSubmit: () => void;
  onPermissionCancel: () => void;
  permissionError: string | null;
  permissionIsSubmitting: boolean;
};

function SelectedSayongjaPanel({
  detail,
  employmentCategoryOptions,
  workTypeOptions,
  onSave,
  isSaving,
  onDelete,
  isDeleting,
  assignedPermissions,
  isPermissionsFetching,
  onPermissionModalToggle,
  isPermissionModalOpen,
  permissionModalRef,
  availablePermissions,
  permissionSelection,
  onPermissionSelection,
  onPermissionSubmit,
  onPermissionCancel,
  permissionError,
  permissionIsSubmitting,
}: SelectedSayongjaPanelProps) {
  const [detailForm, setDetailForm] = useState<DetailFormState>(() => ({
    employmentSangtaeNanoId: detail.employmentSangtae?.nanoId ?? '',
    workTypeSangtaeNanoId: detail.workTypeSangtae?.nanoId ?? '',
    isHwalseong: detail.isHwalseong,
  }));
  const initialForm = useMemo(
    () => ({
      employmentSangtaeNanoId: detail.employmentSangtae?.nanoId ?? '',
      workTypeSangtaeNanoId: detail.workTypeSangtae?.nanoId ?? '',
      isHwalseong: detail.isHwalseong,
    }),
    [detail],
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const isDetailDirty =
    detailForm.employmentSangtaeNanoId !== initialForm.employmentSangtaeNanoId ||
    detailForm.workTypeSangtaeNanoId !== initialForm.workTypeSangtaeNanoId ||
    detailForm.isHwalseong !== initialForm.isHwalseong;

  const handleSaveClick = () => {
    onSave(detailForm)
      .then(() => {
        setLocalError(null);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : '사용자 정보를 저장하는 중 문제가 발생했습니다. 다시 시도해주세요.';
        setLocalError(message);
      });
  };

  return (
    <div className={styles.sidePanelBody}>
      <div className={styles.sidePanelSection}>
        <h3 className={styles.sectionTitle}>기본 정보</h3>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>사용자 이름</span>
          <span className={styles.fieldValue}>{detail.name}</span>
        </div>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>사용자 코드</span>
          <span className={styles.fieldValue}>{detail.nanoId}</span>
        </div>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>로그인 ID</span>
          <span className={styles.fieldValue}>{detail.loginId}</span>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>입사일</span>
            <span className={styles.fieldValue}>{formatDate(detail.employedAt)}</span>
          </div>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>등록일</span>
            <span className={styles.fieldValue}>{formatDate(detail.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className={styles.sidePanelSection}>
        <h3 className={styles.sectionTitle}>근무 설정</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="detail-employment">
            재직 상태
          </label>
          <select
            id="detail-employment"
            className={styles.select}
            value={detailForm.employmentSangtaeNanoId}
            onChange={(event) => {
              setDetailForm((prev) => ({ ...prev, employmentSangtaeNanoId: event.target.value }));
              setLocalError(null);
            }}
          >
            <option value="">설정 안 함</option>
            {employmentCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.categoryName} - {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="detail-worktype">
            근무 형태
          </label>
          <select
            id="detail-worktype"
            className={styles.select}
            value={detailForm.workTypeSangtaeNanoId}
            onChange={(event) => {
              setDetailForm((prev) => ({ ...prev, workTypeSangtaeNanoId: event.target.value }));
              setLocalError(null);
            }}
          >
            <option value="">설정 안 함</option>
            {workTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>활성 사용자</span>
          <Toggle
            active={detailForm.isHwalseong}
            onChange={(next) => {
              setDetailForm((prev) => ({ ...prev, isHwalseong: next }));
              setLocalError(null);
            }}
          />
        </div>
        {localError ? <p className={styles.errorText}>{localError}</p> : null}
        <div className={styles.sectionActions}>
          <Button
            styleType="solid"
            variant="primary"
            onClick={handleSaveClick}
            disabled={!isDetailDirty || isSaving}
          >
            {isSaving ? '저장 중...' : '변경 사항 저장'}
          </Button>
        </div>
      </div>
      <div className={styles.sidePanelSection}>
        <h3 className={styles.sectionTitle}>연결 객체들</h3>
        <p className={styles.sectionSubtitle}>권한들</p>
        {isPermissionsFetching ? (
          <div className={styles.placeholder}>권한 정보를 불러오는 중입니다.</div>
        ) : assignedPermissions.length === 0 ? (
          <p className={styles.fieldValue}>아직 연결된 권한이 없습니다.</p>
        ) : (
          <ul className={styles.permissionList}>
            {assignedPermissions.map((permission) => (
              <li key={permission.nanoId} className={styles.permissionItem}>
                <span className={styles.permissionName}>{permission.name}</span>
                <span className={styles.permissionMeta}>코드: {permission.nanoId}</span>
                <span className={styles.permissionMeta}>역할: {permission.role}</span>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.permissionActions}>
          <Button
            styleType="outlined"
            variant="primary"
            onClick={onPermissionModalToggle}
            disabled={permissionIsSubmitting}
          >
            권한 추가
          </Button>
          {isPermissionModalOpen ? (
            <div className={styles.permissionModal} ref={permissionModalRef}>
              <div className={styles.permissionModalHeader}>
                <span className={styles.permissionModalTitle}>권한 선택</span>
                <span className={styles.permissionModalHint}>
                  추가하고 싶은 권한을 선택한 뒤 적용하세요.
                </span>
              </div>
              <div className={styles.permissionModalBody}>
                {availablePermissions.length === 0 ? (
                  <p className={styles.permissionModalEmpty}>추가할 수 있는 권한이 없습니다.</p>
                ) : (
                  <ul className={styles.permissionModalList}>
                    {availablePermissions.map((permission) => {
                      const checked = permissionSelection.includes(permission.nanoId);
                      return (
                        <li key={permission.nanoId} className={styles.permissionModalOption}>
                          <span className={styles.permissionModalOptionLabel}>{permission.name}</span>
                          <Checkbox
                            checked={checked}
                            onChange={() => onPermissionSelection(permission.nanoId)}
                            ariaLabel={`${permission.name} 권한 선택`}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {permissionError ? <p className={styles.errorText}>{permissionError}</p> : null}
              <div className={styles.permissionModalFooter}>
                <Button styleType="text" variant="secondary" onClick={onPermissionCancel}>
                  취소
                </Button>
                <Button
                  styleType="solid"
                  variant="primary"
                  onClick={onPermissionSubmit}
                  disabled={permissionSelection.length === 0 || permissionIsSubmitting}
                >
                  {permissionIsSubmitting ? '적용 중...' : '적용하기'}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className={styles.sidePanelSection}>
        <h3 className={styles.sectionTitle}>위험 작업</h3>
        <p className={styles.sectionSubtitle}>사용자를 삭제하면 복구할 수 없습니다.</p>
        <Button
          styleType="outlined"
          variant="assistive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '삭제 중...' : '사용자 삭제'}
        </Button>
      </div>
    </div>
  );
}

function normalizeFilters(state: FilterState, available: AvailableFilterSets): FilterState {
  const validHwalseong: HwalseongFilter =
    state.isHwalseong === 'true' || state.isHwalseong === 'false' ? state.isHwalseong : 'all';
  return {
    jojiks: Array.from(new Set(state.jojiks.filter((value) => available.jojiks.has(value)))),
    employmentCategories: Array.from(
      new Set(state.employmentCategories.filter((value) => available.employmentCategories.has(value))),
    ),
    workTypes: Array.from(new Set(state.workTypes.filter((value) => available.workTypes.has(value)))),
    isHwalseong: validHwalseong,
  };
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
