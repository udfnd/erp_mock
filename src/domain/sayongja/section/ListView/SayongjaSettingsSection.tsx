'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { Button, Checkbox, Modal, Textfield } from '@/common/components';
import {
  useBatchlinkPermissionSayongjaMutation,
  useDeleteSayongjaMutation,
  useGetPermissionsQuery,
} from '@/domain/permission/api';
import {
  useCreateSayongjaMutation,
  useGetSayongjaDetailQuery,
  useGetSayongjaPermissionsQuery,
  useUpdateSayongjaMutation,
} from '@/domain/sayongja/api';
import type { SayongjaListItem, UpdateSayongjaRequest } from '@/domain/sayongja/api';

import { sayongjaListViewCss } from './styles';
import type { SayongjaSettingsSectionProps } from './useSayongjaListViewSections';

export type SayongjaSettingsSectionComponentProps = SayongjaSettingsSectionProps & {
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
};

export function SayongjaSettingsSection({
  gigwanNanoId,
  selectedSayongjas,
  isCreating,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
  employmentCategoryOptions,
  workTypeOptions,
}: SayongjaSettingsSectionComponentProps) {
  if (!gigwanNanoId) {
    return (
      <aside css={sayongjaListViewCss.settingsPanel}>
        <div css={sayongjaListViewCss.panelHeader}>
          <h2 css={sayongjaListViewCss.panelTitle}>기관이 선택되지 않았습니다</h2>
          <p css={sayongjaListViewCss.panelSubtitle}>URL의 기관 식별자를 확인해 주세요.</p>
        </div>
        <div css={sayongjaListViewCss.panelBody}>
          <p css={sayongjaListViewCss.helperText}>기관 ID가 없으면 사용자 데이터를 불러올 수 없습니다.</p>
        </div>
      </aside>
    );
  }

  if (isCreating || selectedSayongjas.length === 0) {
    return (
      <aside css={sayongjaListViewCss.settingsPanel}>
        <CreateSayongjaPanel
          gigwanNanoId={gigwanNanoId}
          onExit={isCreating ? onExitCreate : undefined}
          onAfterMutation={onAfterMutation}
          employmentCategoryOptions={employmentCategoryOptions}
          workTypeOptions={workTypeOptions}
        />
      </aside>
    );
  }

  if (selectedSayongjas.length === 1) {
    return (
      <aside css={sayongjaListViewCss.settingsPanel}>
        <SingleSelectionPanel
          sayongjaNanoId={selectedSayongjas[0].nanoId}
          sayongjaName={selectedSayongjas[0].name}
          gigwanNanoId={gigwanNanoId}
          onAfterMutation={onAfterMutation}
          isAuthenticated={isAuthenticated}
          employmentCategoryOptions={employmentCategoryOptions}
          workTypeOptions={workTypeOptions}
        />
      </aside>
    );
  }

  return (
    <aside css={sayongjaListViewCss.settingsPanel}>
      <MultiSelectionPanel sayongjas={selectedSayongjas} />
    </aside>
  );
}

type CreateSayongjaPanelProps = {
  gigwanNanoId: string;
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

function CreateSayongjaPanel({
  gigwanNanoId,
  employmentCategoryOptions,
  workTypeOptions,
  onExit,
  onAfterMutation,
}: CreateSayongjaPanelProps) {
  const createMutation = useCreateSayongjaMutation();
  const [name, setName] = useState('');
  const [employedAt, setEmployedAt] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [employmentNanoId, setEmploymentNanoId] = useState('all');
  const [workTypeNanoId, setWorkTypeNanoId] = useState('all');
  const [isHwalseong, setIsHwalseong] = useState(true);

  const isSaving = createMutation.isPending;
  const formId = 'sayongja-create-form';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !employedAt || !loginId || !password) {
      return;
    }

    await createMutation.mutateAsync({
      name: trimmedName,
      gigwanNanoId,
      employedAt,
      loginId,
      password,
      employmentSangtaeNanoId: employmentNanoId === 'all' ? null : employmentNanoId,
      workTypeSangtaeNanoId: workTypeNanoId === 'all' ? null : workTypeNanoId,
      isHwalseong,
    });

    setName('');
    setEmployedAt('');
    setLoginId('');
    setPassword('');
    setEmploymentNanoId('all');
    setWorkTypeNanoId('all');
    setIsHwalseong(true);
    onAfterMutation();
    onExit?.();
  };

  return (
    <>
      <div css={sayongjaListViewCss.panelHeader}>
        <h2 css={sayongjaListViewCss.panelTitle}>새 사용자 추가</h2>
        <p css={sayongjaListViewCss.panelSubtitle}>선택된 기관에 새로운 사용자를 생성합니다.</p>
      </div>
      <form id={formId} css={sayongjaListViewCss.panelBody} onSubmit={handleSubmit}>
        <div css={sayongjaListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="이름"
            placeholder="사용자 이름"
            value={name}
            onValueChange={setName}
            maxLength={60}
          />
        </div>
        <div css={sayongjaListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            type="date"
            label="입사일"
            value={employedAt}
            onValueChange={setEmployedAt}
          />
        </div>
        <div css={[sayongjaListViewCss.panelSection, sayongjaListViewCss.fieldRow]}>
          <div>
            <label css={sayongjaListViewCss.panelLabel}>재직 상태</label>
            <select
              css={sayongjaListViewCss.toolbarSelect}
              value={employmentNanoId}
              onChange={(e) => setEmploymentNanoId(e.target.value)}
            >
              {employmentCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label css={sayongjaListViewCss.panelLabel}>근무 형태</label>
            <select
              css={sayongjaListViewCss.toolbarSelect}
              value={workTypeNanoId}
              onChange={(e) => setWorkTypeNanoId(e.target.value)}
            >
              {workTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div css={[sayongjaListViewCss.panelSection, sayongjaListViewCss.fieldRow]}>
          <Textfield
            singleLine
            required
            label="로그인 ID"
            value={loginId}
            onValueChange={setLoginId}
          />
          <Textfield
            singleLine
            required
            type="password"
            label="비밀번호"
            value={password}
            onValueChange={setPassword}
          />
        </div>
        <div css={sayongjaListViewCss.panelSection}>
          <label css={sayongjaListViewCss.panelLabel}>활성화 여부</label>
          <Checkbox checked={isHwalseong} onChange={(e) => setIsHwalseong(e.target.checked)} />
        </div>
        {createMutation.isError && (
          <p css={sayongjaListViewCss.helperText}>사용자 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
        )}
      </form>
      <div css={sayongjaListViewCss.panelFooter}>
        {onExit ? (
          <Button styleType="text" variant="secondary" onClick={onExit} disabled={isSaving}>
            취소
          </Button>
        ) : null}
        <Button type="submit" form={formId} disabled={isSaving || !name.trim() || !employedAt || !loginId || !password}>
          사용자 생성
        </Button>
      </div>
    </>
  );
}

type SingleSelectionPanelProps = {
  sayongjaNanoId: string;
  sayongjaName: string;
  gigwanNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
};

type SingleSelectionPanelContentProps = {
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
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
};

function SingleSelectionPanel({
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
        <div css={sayongjaListViewCss.panelHeader}>
          <h2 css={sayongjaListViewCss.panelTitle}>{sayongjaName}</h2>
          <p css={sayongjaListViewCss.panelSubtitle}>선택한 사용자 정보를 불러오는 중입니다...</p>
        </div>
        <div css={sayongjaListViewCss.panelBody}>
          <p css={sayongjaListViewCss.helperText}>선택한 사용자 정보를 불러오는 중입니다...</p>
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
      employmentCategoryOptions={employmentCategoryOptions}
      workTypeOptions={workTypeOptions}
    />
  );
}

function SingleSelectionPanelContent({
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
  employmentCategoryOptions,
  workTypeOptions,
}: SingleSelectionPanelContentProps) {
  const [name, setName] = useState(sayongjaName);
  const [employedAtValue, setEmployedAtValue] = useState(employedAt);
  const [loginIdValue, setLoginIdValue] = useState(loginId);
  const [employmentValue, setEmploymentValue] = useState(employmentNanoId);
  const [workTypeValue, setWorkTypeValue] = useState(workTypeNanoId);
  const [isHwalseongValue, setIsHwalseongValue] = useState(isHwalseong);
  const [password, setPassword] = useState('');
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedPermissionNanoId, setSelectedPermissionNanoId] = useState<string>('');
  const formId = 'sayongja-update-form';

  const permissionsQuery = useGetPermissionsQuery(
    { gigwanNanoId, pageNumber: 1, pageSize: 50 },
    { enabled: isPermissionModalOpen && Boolean(gigwanNanoId) },
  );
  const permissionLinkMutation = useBatchlinkPermissionSayongjaMutation(selectedPermissionNanoId || '');

  useEffect(() => {
    setName(sayongjaName);
    setEmployedAtValue(employedAt);
    setLoginIdValue(loginId);
    setEmploymentValue(employmentNanoId);
    setWorkTypeValue(workTypeNanoId);
    setIsHwalseongValue(isHwalseong);
  }, [sayongjaName, employedAt, loginId, employmentNanoId, workTypeNanoId, isHwalseong]);

  const isUpdating = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    if (password.trim()) payload.password = password.trim();
    if (isHwalseongValue !== isHwalseong) payload.isHwalseong = isHwalseongValue;

    if (Object.keys(payload).length === 0) return;

    await updateMutation.mutateAsync(payload);
    setPassword('');
    await onAfterMutation();
    await onRefreshPermissions();
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

    await deleteMutation.mutateAsync();
    await onAfterMutation();
  };

  const availablePermissions = useMemo(
    () => permissionsQuery.data?.permissions ?? [],
    [permissionsQuery.data?.permissions],
  );

  const handlePermissionLink = async () => {
    if (!selectedPermissionNanoId) return;
    await permissionLinkMutation.mutateAsync({ sayongjas: [{ nanoId: sayongjaNanoId }] });
    setIsPermissionModalOpen(false);
    setSelectedPermissionNanoId('');
    await onRefreshPermissions();
  };

  return (
    <>
      <div css={sayongjaListViewCss.panelHeader}>
        <h2 css={sayongjaListViewCss.panelTitle}>{sayongjaName}</h2>
        <p css={sayongjaListViewCss.panelSubtitle}>사용자 정보를 수정하거나 삭제할 수 있습니다.</p>
      </div>
      <form id={formId} css={sayongjaListViewCss.panelBody} onSubmit={handleSubmit}>
        <div css={sayongjaListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="이름"
            value={name}
            onValueChange={setName}
            maxLength={60}
          />
        </div>
        <div css={[sayongjaListViewCss.panelSection, sayongjaListViewCss.fieldRow]}>
          <Textfield
            singleLine
            required
            type="date"
            label="입사일"
            value={employedAtValue}
            onValueChange={setEmployedAtValue}
          />
          <Textfield
            singleLine
            required
            label="로그인 ID"
            value={loginIdValue}
            onValueChange={setLoginIdValue}
          />
        </div>
        <div css={[sayongjaListViewCss.panelSection, sayongjaListViewCss.fieldRow]}>
          <div>
            <label css={sayongjaListViewCss.panelLabel}>재직 상태</label>
            <select
              css={sayongjaListViewCss.toolbarSelect}
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
          <div>
            <label css={sayongjaListViewCss.panelLabel}>근무 형태</label>
            <select
              css={sayongjaListViewCss.toolbarSelect}
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
        </div>
        <div css={[sayongjaListViewCss.panelSection, sayongjaListViewCss.fieldRow]}>
          <Textfield
            singleLine
            type="password"
            label="비밀번호 변경"
            placeholder="변경 시에만 입력"
            value={password}
            onValueChange={setPassword}
          />
          <div>
            <label css={sayongjaListViewCss.panelLabel}>활성화 여부</label>
            <div>
              <Checkbox
                checked={isHwalseongValue}
                onChange={(e) => setIsHwalseongValue(e.target.checked)}
                ariaLabel="활성화"
              />
            </div>
          </div>
        </div>
        {updateMutation.isError && (
          <p css={sayongjaListViewCss.helperText}>사용자 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}
        <div css={sayongjaListViewCss.panelSection}>
          <span css={sayongjaListViewCss.panelLabel}>연결 객체들</span>
          <div css={sayongjaListViewCss.panelSection}>
            <div css={sayongjaListViewCss.panelLabel}>권한들</div>
            <div css={sayongjaListViewCss.permissionList}>
              {permissions.map((permission) => (
                <div key={permission.nanoId} css={sayongjaListViewCss.permissionItem}>
                  <span css={sayongjaListViewCss.permissionName}>{permission.name}</span>
                  <span css={sayongjaListViewCss.panelText}>{permission.role}</span>
                </div>
              ))}
              {!permissions.length && (
                <p css={sayongjaListViewCss.helperText}>아직 연결된 권한이 없습니다.</p>
              )}
            </div>
            <div css={sayongjaListViewCss.sectionActions}>
              <Button styleType="outlined" variant="secondary" onClick={() => setIsPermissionModalOpen(true)}>
                권한 추가
              </Button>
            </div>
          </div>
        </div>
      </form>
      <div css={sayongjaListViewCss.panelFooter}>
        <Button styleType="outlined" variant="secondary" onClick={handleDelete} disabled={isDeleting}>
          사용자 삭제
        </Button>
        <Button type="submit" form={formId} disabled={isUpdating}>
          저장
        </Button>
      </div>
      <Modal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        title="권한 추가"
        menus={[
          {
            id: 'permissions',
            label: '권한 목록',
            content: (
              <div css={sayongjaListViewCss.panelSection}>
                <label css={sayongjaListViewCss.panelLabel}>추가할 권한 선택</label>
                <select
                  css={sayongjaListViewCss.toolbarSelect}
                  value={selectedPermissionNanoId}
                  onChange={(e) => setSelectedPermissionNanoId(e.target.value)}
                >
                  <option value="">권한을 선택하세요</option>
                  {availablePermissions.map((permission) => (
                    <option key={permission.nanoId} value={permission.nanoId}>
                      {permission.name}
                    </option>
                  ))}
                </select>
                {permissionsQuery.isError && (
                  <p css={sayongjaListViewCss.helperText}>권한 목록을 불러오지 못했습니다.</p>
                )}
                <div css={sayongjaListViewCss.sectionActions}>
                  <Button
                    onClick={handlePermissionLink}
                    disabled={!selectedPermissionNanoId || permissionsQuery.isLoading}
                  >
                    연결
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}

type MultiSelectionPanelProps = {
  sayongjas: SayongjaListItem[];
};

function MultiSelectionPanel({ sayongjas }: MultiSelectionPanelProps) {
  const displayList = useMemo(() => sayongjas.slice(0, 6), [sayongjas]);
  const overflowCount = Math.max(sayongjas.length - displayList.length, 0);

  return (
    <>
      <div css={sayongjaListViewCss.panelHeader}>
        <h2 css={sayongjaListViewCss.panelTitle}>{sayongjas.length}명의 사용자가 선택되었습니다</h2>
        <p css={sayongjaListViewCss.panelSubtitle}>여러 사용자 기능은 준비 중입니다.</p>
      </div>
      <div css={sayongjaListViewCss.panelBody}>
        <div css={sayongjaListViewCss.panelSection}>
          <span css={sayongjaListViewCss.panelLabel}>선택된 사용자</span>
          <div css={sayongjaListViewCss.chipList}>
            {displayList.map((user) => (
              <span key={user.nanoId} css={sayongjaListViewCss.chip}>
                {user.name}
              </span>
            ))}
          </div>
          {overflowCount > 0 && (
            <p css={sayongjaListViewCss.helperText}>외 {overflowCount}명의 사용자가 더 선택되어 있습니다.</p>
          )}
        </div>
        <div css={sayongjaListViewCss.panelSection}>
          <span css={sayongjaListViewCss.panelLabel}>다중 선택 기능</span>
          <p css={sayongjaListViewCss.panelText}>여러 사용자 선택 시 기능을 준비 중입니다.</p>
        </div>
      </div>
    </>
  );
}
