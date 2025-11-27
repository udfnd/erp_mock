import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';

import { Button, Textfield } from '@/common/components';
import { PlusIcon } from '@/common/icons';
import { ListSection, type ListViewFilter, type ListViewSortProps } from '@/common/lv/component';
import { ToolbarLayout } from '@/common/lv/layout';
import {
  useBatchlinkPermissionSayongjaMutation,
  useGetPermissionsQuery,
} from '@/domain/permission/api';
import { type Permission } from '@/domain/permission/api';
import { useGetPermissionTypesQuery } from '@/domain/system/api';
import {
  useDeleteSayongjaMutation,
  useGetSayongjaDetailQuery,
  useGetSayongjaPermissionsQuery,
  useUpdateSayongjaMutation,
} from '@/domain/sayongja/api';
import type { SayongjaListItem, UpdateSayongjaRequest } from '@/domain/sayongja/api';

import { useListViewState } from '@/common/lv';
import { cssObj } from '../../styles';
import {
  HWALSEONG_OPTIONS,
  generateRandomPassword,
  getPasswordConfirmHelperText,
  getPasswordHelperText,
} from './constants';
import {
  SORT_OPTIONS as PERMISSION_SORT_OPTIONS,
  columnHelper as permissionColumnHelper,
  getSortOptionFromState as getPermissionSortOptionFromState,
  getSortStateFromOption as getPermissionSortStateFromOption,
} from '@/domain/permission/section/ListView/constants';

export type SingleSelectionPanelProps = {
  sayongjaNanoId: string;
  sayongjaName: string;
  gigwanNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
};

export type SingleSelectionPanelContentProps = {
  sayongjaNanoId: string;
  sayongjaName: string;
  employedAt: string;
  loginId: string;
  isHwalseong: boolean;
  employmentNanoId: string;
  workTypeNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  updateMutation: ReturnType<typeof useUpdateSayongjaMutation>;
  deleteMutation: ReturnType<typeof useDeleteSayongjaMutation>;
  permissions: { name: string; nanoId: string; role: string }[];
  onRefreshPermissions: () => Promise<unknown> | void;
  gigwanNanoId: string;
  isAuthenticated: boolean;
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
};

export function SingleSelectionPanel({
  sayongjaNanoId,
  sayongjaName,
  gigwanNanoId,
  onAfterMutation,
  isAuthenticated,
  employmentCategoryOptions,
  workTypeOptions,
}: SingleSelectionPanelProps) {
  const { data: sayongjaDetail, isLoading } = useGetSayongjaDetailQuery(sayongjaNanoId, {
    enabled: isAuthenticated && Boolean(sayongjaNanoId),
  });
  const { data: permissionData, refetch: refetchPermissions } = useGetSayongjaPermissionsQuery(
    sayongjaNanoId,
    { enabled: isAuthenticated && Boolean(sayongjaNanoId) },
  );

  const updateMutation = useUpdateSayongjaMutation(sayongjaNanoId);
  const deleteMutation = useDeleteSayongjaMutation(sayongjaNanoId);

  if (isLoading && !sayongjaDetail) {
    return (
      <>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>{sayongjaName}</h2>
          <p css={cssObj.panelSubtitle}>선택한 사용자 정보를 불러오는 중입니다...</p>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.helperText}>선택한 사용자 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  const effectiveName = sayongjaDetail?.name ?? sayongjaName ?? '';
  const effectiveEmployedAt = sayongjaDetail?.employedAt ?? '';
  const effectiveLoginId = sayongjaDetail?.loginId ?? '';
  const employmentNanoId = sayongjaDetail?.employmentSangtae?.nanoId ?? 'all';
  const workTypeNanoId = sayongjaDetail?.workTypeSangtae?.nanoId ?? 'all';
  const isHwalseong = sayongjaDetail?.isHwalseong ?? true;

  return (
    <SingleSelectionPanelContent
      key={`${sayongjaNanoId}:${effectiveName}:${effectiveEmployedAt}:${effectiveLoginId}:${employmentNanoId}:${workTypeNanoId}:${isHwalseong}`}
      sayongjaNanoId={sayongjaNanoId}
      sayongjaName={effectiveName}
      employedAt={effectiveEmployedAt}
      loginId={effectiveLoginId}
      employmentNanoId={employmentNanoId}
      workTypeNanoId={workTypeNanoId}
      isHwalseong={isHwalseong}
      onAfterMutation={onAfterMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      permissions={permissionData?.permissions ?? []}
      onRefreshPermissions={refetchPermissions}
      gigwanNanoId={gigwanNanoId}
      isAuthenticated={isAuthenticated}
      employmentCategoryOptions={employmentCategoryOptions}
      workTypeOptions={workTypeOptions}
    />
  );
}

export function SingleSelectionPanelContent({
  sayongjaNanoId,
  sayongjaName,
  employedAt,
  loginId,
  employmentNanoId,
  workTypeNanoId,
  isHwalseong,
  onAfterMutation,
  updateMutation,
  deleteMutation,
  permissions,
  onRefreshPermissions,
  gigwanNanoId,
  isAuthenticated,
  employmentCategoryOptions,
  workTypeOptions,
}: SingleSelectionPanelContentProps) {
  const [name, setName] = useState(sayongjaName ?? '');
  const [employedAtValue, setEmployedAtValue] = useState(employedAt ?? '');
  const [loginIdValue, setLoginIdValue] = useState(loginId ?? '');
  const [isPermissionTooltipOpen, setIsPermissionTooltipOpen] = useState(false);
  const [selectedPermissionNanoId, setSelectedPermissionNanoId] = useState('');
  const [isHwalseongValue, setIsHwalseongValue] = useState(isHwalseong ? 'true' : 'false');
  const [employmentValue, setEmploymentValue] = useState(employmentNanoId);
  const [workTypeValue, setWorkTypeValue] = useState(workTypeNanoId);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [activeLinkedTab, setActiveLinkedTab] = useState('permissions');
  const permissionActionRef = useRef<HTMLDivElement>(null);
  const [permissionTooltipPosition, setPermissionTooltipPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('');
  const [permissionFilters, setPermissionFilters] = useState<{ permissionTypeNanoIds: string[] }>({
    permissionTypeNanoIds: ['all'],
  });
  const [permissionSortOption, setPermissionSortOption] = useState<string | undefined>('nameAsc');
  const [selectedPermissionItems, setSelectedPermissionItems] = useState<Permission[]>([]);
  const [isPermissionSearchFocused, setIsPermissionSearchFocused] = useState(false);

  const permissionListState = useListViewState<Permission>({
    initialSorting: getPermissionSortStateFromOption('nameAsc'),
    initialPagination: { pageIndex: 0, pageSize: 10 },
  });
  const {
    sorting: permissionSorting,
    pagination: permissionPagination,
    setSorting: setPermissionSorting,
    setPagination: setPermissionPagination,
    setRowSelection: setPermissionRowSelection,
  } = permissionListState;

  const permissionSortValue =
    getPermissionSortOptionFromState(permissionSorting) ?? permissionSortOption;

  const { data: permissionTypesData } = useGetPermissionTypesQuery({
    enabled: isPermissionTooltipOpen && isAuthenticated,
  });

  const permissionTypeOptions = useMemo(
    () => [
      { label: '전체 권한 시스템', value: 'all' },
      ...(permissionTypesData?.permissionTypes.map((type) => ({
        label: type.name,
        value: type.nanoId,
      })) ?? []),
    ],
    [permissionTypesData?.permissionTypes],
  );

  const permissionTypeFilters = permissionFilters.permissionTypeNanoIds.filter(
    (value) => value !== 'all' && value !== '',
  );

  const permissionsQuery = useGetPermissionsQuery(
    {
      gigwanNanoId,
      permissionNameSearch: permissionSearchTerm ? permissionSearchTerm : undefined,
      permissionTypeFilters: permissionTypeFilters.length ? permissionTypeFilters : undefined,
      pageNumber: permissionPagination.pageIndex + 1,
      pageSize: permissionPagination.pageSize,
      sortByOption: permissionSortValue,
    },
    { enabled: isPermissionTooltipOpen && Boolean(gigwanNanoId) },
  );
  const permissionLinkMutation = useBatchlinkPermissionSayongjaMutation(
    selectedPermissionNanoId || '',
  );

  const isDeleting = deleteMutation.isPending;
  const passwordHelperText = getPasswordHelperText(password);
  const passwordConfirmHelperText = getPasswordConfirmHelperText(password, passwordConfirm);
  const hasPasswordError = Boolean(passwordHelperText);
  const hasPasswordConfirmError = Boolean(passwordConfirmHelperText);
  const hasAttributeChanges =
    name.trim() !== sayongjaName.trim() ||
    employedAtValue !== employedAt ||
    loginIdValue.trim() !== loginId.trim() ||
    employmentValue !== employmentNanoId ||
    workTypeValue !== workTypeNanoId ||
    (isHwalseongValue === 'true') !== isHwalseong;
  const isUpdating = updateMutation.isPending;
  const isAttributeSaveDisabled = isUpdating || !hasAttributeChanges;
  const isPasswordSaveDisabled =
    isUpdating ||
    !password.trim() ||
    !passwordConfirm.trim() ||
    hasPasswordError ||
    hasPasswordConfirmError;

  const closePermissionTooltip = useCallback(() => {
    setIsPermissionTooltipOpen(false);
    setPermissionTooltipPosition(null);
    setSelectedPermissionNanoId('');
    setSelectedPermissionItems([]);
    setPermissionRowSelection({});
  }, [setPermissionRowSelection]);

  const togglePermissionTooltip = useCallback(() => {
    setIsPermissionTooltipOpen((prev) => {
      const next = !prev;

      if (!next) {
        setPermissionTooltipPosition(null);
        setSelectedPermissionNanoId('');
      }

      return next;
    });
  }, []);

  const handleAttributeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: UpdateSayongjaRequest = {};

    if (name.trim() !== sayongjaName.trim()) payload.name = name.trim();
    if (employedAtValue) payload.employedAt = employedAtValue;
    if (loginIdValue.trim() !== loginId.trim()) payload.loginId = loginIdValue.trim();
    if (employmentValue !== employmentNanoId) {
      payload.employmentSangtaeNanoId = employmentValue === 'all' ? null : employmentValue;
    }
    if (workTypeValue !== workTypeNanoId) {
      payload.workTypeSangtaeNanoId = workTypeValue === 'all' ? null : workTypeValue;
    }
    const isHwalseongSelected = isHwalseongValue === 'true';
    if (isHwalseongSelected !== isHwalseong) payload.isHwalseong = isHwalseongSelected;

    if (Object.keys(payload).length === 0) return;

    await updateMutation.mutateAsync(payload);
    await onAfterMutation();
    await onRefreshPermissions();
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPasswordSaveDisabled) return;

    await updateMutation.mutateAsync({ password: password.trim() });
    setPassword('');
    setPasswordConfirm('');
    await onAfterMutation();
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

    await deleteMutation.mutateAsync();
    await onAfterMutation();
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (generatedPassword && value !== generatedPassword) {
      setGeneratedPassword('');
    }
  };

  const availablePermissions = useMemo(
    () => permissionsQuery.data?.permissions ?? [],
    [permissionsQuery.data?.permissions],
  );

  const permissionTotalCount =
    (permissionsQuery.data?.paginationData?.totalItemCount as number | undefined) ??
    availablePermissions.length;
  const permissionTotalPages = Math.max(
    1,
    Math.ceil(permissionTotalCount / Math.max(permissionPagination.pageSize, 1)),
  );

  // 🔧 TS2322 해결: TValue를 unknown 대신 any로 지정
  const permissionColumns = useMemo<ColumnDef<Permission, any>[]>(
    () => [
      permissionColumnHelper.accessor('name', {
        header: '권한명',
        cell: (info) => info.getValue(),
      }),
      permissionColumnHelper.accessor((row) => row.type.name, {
        id: 'type',
        header: '권한 시스템 타입',
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
    ],
    [],
  );

  const handlePermissionSearchChange = (value: string) => {
    setPermissionSearchTerm(value);
    setPermissionPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handlePermissionFilterChange = (value: string[]) => {
    setPermissionFilters({ permissionTypeNanoIds: value.length ? value : ['all'] });
    setPermissionPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handlePermissionSortChange = (value: string) => {
    setPermissionSortOption(value);
    setPermissionSorting(getPermissionSortStateFromOption(value));
    setPermissionPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const lastSelectedPermissionIdsRef = useRef<string>('');

  const handlePermissionRowsChange = useCallback((rows: Row<Permission>[]) => {
    const selected = rows.map((row) => row.original);
    const selectedIds = selected.map((item) => item.nanoId).join(',');

    if (lastSelectedPermissionIdsRef.current === selectedIds) return;

    lastSelectedPermissionIdsRef.current = selectedIds;
    setSelectedPermissionItems(selected);
    setSelectedPermissionNanoId(selected[0]?.nanoId ?? '');
  }, []);

  const handlePermissionDimmerClick = () => {
    setIsPermissionSearchFocused(false);
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const permissionToolbarFilters: ListViewFilter[] = useMemo(
    () => [
      {
        key: 'permissionType',
        label: '권한 시스템',
        value: permissionFilters.permissionTypeNanoIds,
        defaultValue: ['all'],
        options: permissionTypeOptions,
        onChange: (value) => handlePermissionFilterChange(value),
      },
    ],
    [handlePermissionFilterChange, permissionFilters.permissionTypeNanoIds, permissionTypeOptions],
  );

  const permissionSortProps: ListViewSortProps = useMemo(
    () => ({
      label: '정렬 기준',
      value: permissionSortValue,
      placeholder: '정렬 기준',
      options: PERMISSION_SORT_OPTIONS,
      onChange: handlePermissionSortChange,
    }),
    [handlePermissionSortChange, permissionSortValue],
  );

  useEffect(() => {
    if (!isPermissionTooltipOpen) {
      return;
    }

    const updatePosition = () => {
      const container = permissionActionRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const left = rect.left - 680 - 12;
      const top = rect.top - 600;

      setPermissionTooltipPosition({ left, top });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isPermissionTooltipOpen]);

  const handlePermissionLink = useCallback(async () => {
    if (!selectedPermissionNanoId) return;
    await permissionLinkMutation.mutateAsync({ sayongjas: [{ nanoId: sayongjaNanoId }] });
    closePermissionTooltip();
    await onRefreshPermissions();
  }, [
    closePermissionTooltip,
    onRefreshPermissions,
    permissionLinkMutation,
    sayongjaNanoId,
    selectedPermissionNanoId,
  ]);

  const handleGeneratePassword = () => {
    const generated = generateRandomPassword();
    setPassword(generated);
    setPasswordConfirm(generated);
    setGeneratedPassword(generated);
  };

  const linkedObjectTabs = useMemo(
    () => [
      {
        key: 'permissions',
        label: '권한들',
        content: (
          <>
            <div css={cssObj.permissionList}>
              {permissions.map((permission) => (
                <div key={permission.nanoId} css={cssObj.permissionItem}>
                  <span css={cssObj.permissionName}>{permission.name}</span>
                  <span css={cssObj.panelText}>{permission.role}</span>
                </div>
              ))}
              {!permissions.length && <p css={cssObj.helperText}>아직 연결된 권한이 없습니다.</p>}
            </div>

            <div
              css={[cssObj.sectionActions, cssObj.permissionActionContainer]}
              ref={permissionActionRef}
            >
              <Button
                styleType="outlined"
                variant="assistive"
                isFull
                onClick={togglePermissionTooltip}
                aria-expanded={isPermissionTooltipOpen}
                iconRight={<PlusIcon />}
              >
                권한 추가
              </Button>
              {isPermissionTooltipOpen && permissionTooltipPosition ? (
                <div css={cssObj.permissionTooltip} style={permissionTooltipPosition}>
                  <div css={cssObj.permissionTooltipHeader}>
                    <ToolbarLayout
                      search={{
                        value: permissionSearchTerm,
                        onChange: handlePermissionSearchChange,
                        placeholder: '권한 이름으로 검색',
                      }}
                      filters={permissionToolbarFilters}
                      sort={permissionSortProps}
                      totalCount={permissionTotalCount}
                      onSearchFocusChange={setIsPermissionSearchFocused}
                    />
                  </div>
                  <div css={cssObj.permissionTooltipContent}>
                    <div css={cssObj.permissionTooltipTable}>
                      <ListSection
                        data={availablePermissions}
                        columns={permissionColumns}
                        state={permissionListState}
                        manualPagination
                        manualSorting
                        pageCount={permissionTotalPages}
                        isLoading={permissionsQuery.isLoading}
                        loadingMessage="권한 데이터를 불러오는 중입니다..."
                        emptyMessage="조건에 맞는 권한이 없습니다. 검색어나 필터를 조정해 보세요."
                        isDimmed={isPermissionSearchFocused}
                        rowEventHandlers={{ selectOnClick: true }}
                        onSelectedRowsChange={handlePermissionRowsChange}
                        onDimmerClick={handlePermissionDimmerClick}
                      />
                    </div>
                    <div css={cssObj.permissionTooltipSelected}>
                      <span css={cssObj.selectedPermissionLabel}>선택된 권한들</span>
                      <div css={cssObj.selectedPermissionList}>
                        {selectedPermissionItems.length ? (
                          selectedPermissionItems.map((item) => (
                            <div key={item.nanoId} css={cssObj.selectedPermissionItem}>
                              {item.name}
                            </div>
                          ))
                        ) : (
                          <p css={cssObj.helperText}>선택된 권한이 없습니다.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {permissionsQuery.isError && (
                    <p css={cssObj.helperText}>권한 목록을 불러오지 못했습니다.</p>
                  )}

                  <div css={cssObj.permissionTooltipActions}>
                    <Button
                      styleType="solid"
                      variant="secondary"
                      size="small"
                      onClick={handlePermissionLink}
                      disabled={!selectedPermissionNanoId || permissionLinkMutation.isPending}
                    >
                      연결
                    </Button>
                    <Button
                      styleType="outlined"
                      variant="assistive"
                      size="small"
                      onClick={closePermissionTooltip}
                    >
                      닫기
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
      // 🔧 react-hooks/preserve-manual-memoization: useMemo 안에서 쓰는 값 전부 의존성에 포함
      availablePermissions,
      closePermissionTooltip,
      handlePermissionDimmerClick,
      handlePermissionLink,
      handlePermissionRowsChange,
      handlePermissionSearchChange,
      isPermissionSearchFocused,
      isPermissionTooltipOpen,
      permissionColumns,
      permissionListState,
      permissionSearchTerm,
      permissionSortProps,
      permissionToolbarFilters,
      permissionTooltipPosition,
      permissionTotalCount,
      permissionTotalPages,
      permissionLinkMutation.isPending,
      permissions,
      permissionsQuery.isError,
      permissionsQuery.isLoading,
      selectedPermissionItems,
      selectedPermissionNanoId,
      setIsPermissionSearchFocused,
      togglePermissionTooltip,
    ],
  );

  const resolvedActiveLinkedTab = useMemo(() => {
    const hasActiveTab = linkedObjectTabs.some((tab) => tab.key === activeLinkedTab);

    return hasActiveTab ? activeLinkedTab : (linkedObjectTabs[0]?.key ?? '');
  }, [activeLinkedTab, linkedObjectTabs]);

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{sayongjaName}</h2>
      </div>
      <div css={cssObj.panelBody}>
        <form css={cssObj.panelSection} onSubmit={handleAttributeSubmit}>
          <h3 css={cssObj.panelSubtitle}>사용자 속성</h3>
          <Textfield
            singleLine
            required
            label="이름"
            value={name}
            onValueChange={setName}
            maxLength={60}
          />
          <Textfield
            singleLine
            required
            label="아이디"
            value={loginIdValue}
            onValueChange={setLoginIdValue}
          />
          <Textfield
            singleLine
            required
            type="date"
            label="입사일"
            value={employedAtValue}
            onValueChange={setEmployedAtValue}
          />

          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>재직 상태</label>
            <select
              css={cssObj.toolbarSelect}
              value={employmentValue}
              onChange={(e) => setEmploymentValue(e.target.value)}
            >
              {employmentCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>근무 형태</label>
            <select
              css={cssObj.toolbarSelect}
              value={workTypeValue}
              onChange={(e) => setWorkTypeValue(e.target.value)}
            >
              {workTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>활성 상태</label>
            <select
              css={cssObj.toolbarSelect}
              value={isHwalseongValue}
              onChange={(e) => setIsHwalseongValue(e.target.value)}
            >
              {HWALSEONG_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div css={cssObj.sectionActions}>
            <Button type="submit" size="small" disabled={isAttributeSaveDisabled}>
              저장
            </Button>
          </div>
        </form>
        <form css={cssObj.panelSection} onSubmit={handlePasswordSubmit}>
          <h3 css={cssObj.panelSubtitle}>비밀번호 변경</h3>
          <Textfield
            singleLine
            type="password"
            label="비밀번호"
            placeholder="변경 시에만 입력"
            value={password}
            onValueChange={handlePasswordChange}
            helperText={passwordHelperText}
            status={hasPasswordError ? 'negative' : 'normal'}
          />
          <Textfield
            singleLine
            type="password"
            label="비밀번호 확인"
            placeholder="변경 시에만 입력"
            value={passwordConfirm}
            onValueChange={setPasswordConfirm}
            helperText={passwordConfirmHelperText}
            status={hasPasswordConfirmError ? 'negative' : 'normal'}
          />
          <Button type="button" variant="assistive" size="small" onClick={handleGeneratePassword}>
            비밀번호 무작위 생성
          </Button>
          {generatedPassword ? (
            <p css={cssObj.generatedPasswordText}>
              생성된 비밀번호: <span>{generatedPassword}</span>
            </p>
          ) : null}
          <div css={cssObj.sectionActions}>
            <Button type="submit" size="small" disabled={isPasswordSaveDisabled}>
              비밀번호 변경
            </Button>
          </div>
        </form>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>연결 객체들</h3>
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

        {deleteMutation.isError && (
          <p css={cssObj.helperText}>사용자 삭제 중 문제가 발생했습니다. 다시 시도해 주세요.</p>
        )}
        {permissionLinkMutation.isError && (
          <p css={cssObj.helperText}>권한 연결 중 문제가 발생했습니다. 다시 시도해 주세요.</p>
        )}
      </div>
      <div css={cssObj.panelFooter}>
        <Button variant="red" size="small" isFull onClick={handleDelete} disabled={isDeleting}>
          사용자 삭제
        </Button>
      </div>
    </>
  );
}

export type MultiSelectionPanelProps = {
  sayongjas: SayongjaListItem[];
};

export function MultiSelectionPanel({ sayongjas }: MultiSelectionPanelProps) {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>사용자 {sayongjas.length}개 설정</h2>
      </div>
      <div css={cssObj.panelBody}>
        <div css={cssObj.salesDiv}>
          <span>준비중입니다.</span>
        </div>
      </div>
    </>
  );
}
