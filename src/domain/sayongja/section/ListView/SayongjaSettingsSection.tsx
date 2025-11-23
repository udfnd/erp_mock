'use client';

import { type FormEvent, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useBatchlinkPermissionSayongjaMutation,
  useGetPermissionsQuery,
} from '@/domain/permission/api';
import {
  useCreateSayongjaMutation,
  useDeleteSayongjaMutation,
  useGetSayongjaDetailQuery,
  useGetSayongjaPermissionsQuery,
  useUpdateSayongjaMutation,
} from '@/domain/sayongja/api';
import type { SayongjaListItem, UpdateSayongjaRequest } from '@/domain/sayongja/api';

import { cssObj } from './styles';
import type { SayongjaSettingsSectionProps } from './useSayongjaListViewSections';
import { Magic, Plus } from '@/common/icons';

const HWALSEONG_OPTIONS = [
  { label: '활성', value: 'true' },
  { label: '비활성', value: 'false' },
];

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 100;
const PASSWORD_MIN_MESSAGE = '비밀번호는 최소 8자 이상 입력해 주세요. (15자 권장)';
const PASSWORD_MAX_MESSAGE = '비밀번호는 100자 내로 설정할 수 있어요.';
const PASSWORD_MISMATCH_HELPER_TEXT = '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.';

const getPasswordLengthMessages = (value: string) => {
  const length = value.length;
  const messages: string[] = [];

  if (length > 0 && length < PASSWORD_MIN_LENGTH) {
    messages.push(PASSWORD_MIN_MESSAGE);
  }

  if (length > PASSWORD_MAX_LENGTH) {
    messages.push(PASSWORD_MAX_MESSAGE);
  }

  return messages;
};

const getPasswordHelperText = (value: string) => {
  const messages = getPasswordLengthMessages(value);
  return messages.length ? messages.join('\n') : '';
};

const getPasswordConfirmHelperText = (password: string, confirm: string) => {
  const messages: string[] = [];

  if (confirm.length > PASSWORD_MAX_LENGTH) {
    messages.push(PASSWORD_MAX_MESSAGE);
  }

  if (password && confirm && password !== confirm) {
    messages.push(PASSWORD_MISMATCH_HELPER_TEXT);
  }

  return messages.length ? messages.join('\n') : '';
};

const generateRandomPassword = (length = 12) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*';
  const charactersLength = chars.length;
  return Array.from({ length }, () => chars[Math.floor(Math.random() * charactersLength)]).join('');
};

export type SayongjaSettingsSectionComponentProps = SayongjaSettingsSectionProps & {
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
};

export function SayongjaSettingsSection({
  gigwanNanoId,
  selectedSayongjas,
  isCreating,
  onStartCreate,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
  employmentCategoryOptions,
  workTypeOptions,
}: SayongjaSettingsSectionComponentProps) {
  if (!gigwanNanoId) {
    return (
      <aside css={cssObj.settingsPanel}>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>기관이 선택되지 않았습니다</h2>
          <p css={cssObj.panelSubtitle}>URL의 기관 식별자를 확인해 주세요.</p>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.helperText}>기관 ID가 없으면 사용자 데이터를 불러올 수 없습니다.</p>
        </div>
      </aside>
    );
  }

  if (isCreating) {
    return (
      <aside css={cssObj.settingsPanel}>
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

  if (selectedSayongjas.length === 0) {
    return (
      <aside css={cssObj.settingsPanel}>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>사용자들 설정</h2>
        </div>
        <div css={cssObj.panelBody}>
          <span css={cssObj.panelSubtitle}>빠른 액션</span>
          <div>
            <Button variant="secondary" size="medium" iconLeft={<Magic />} onClick={onStartCreate}>
              사용자 생성 마법사
            </Button>
          </div>
        </div>
      </aside>
    );
  }

  if (selectedSayongjas.length === 1) {
    return (
      <aside css={cssObj.settingsPanel}>
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
    <aside css={cssObj.settingsPanel}>
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
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [employmentNanoId, setEmploymentNanoId] = useState('all');
  const [workTypeNanoId, setWorkTypeNanoId] = useState('all');
  const [isHwalseongValue, setIsHwalseongValue] = useState('true');

  const isSaving = createMutation.isPending;
  const formId = 'sayongja-create-form';
  const passwordHelperText = getPasswordHelperText(password);
  const passwordConfirmHelperText = getPasswordConfirmHelperText(password, passwordConfirm);
  const hasPasswordError = Boolean(passwordHelperText);
  const hasPasswordConfirmError = Boolean(passwordConfirmHelperText);

  const handleGeneratePassword = () => {
    const generated = generateRandomPassword();
    setPassword(generated);
    setPasswordConfirm(generated);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !employedAt || !loginId || !password || password !== passwordConfirm) {
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
      isHwalseong: isHwalseongValue === 'true',
    });

    setName('');
    setEmployedAt('');
    setLoginId('');
    setPassword('');
    setPasswordConfirm('');
    setEmploymentNanoId('all');
    setWorkTypeNanoId('all');
    setIsHwalseongValue('true');
    onAfterMutation();
    onExit?.();
  };

  const isCreateDisabled =
    isSaving ||
    !name.trim() ||
    !employedAt ||
    !loginId ||
    !password ||
    !passwordConfirm ||
    hasPasswordError ||
    hasPasswordConfirmError;

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>사용자 생성</h2>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>사용자 속성</h3>
          <Textfield
            singleLine
            label="이름"
            placeholder="이름을 입력해 주세요"
            value={name}
            onValueChange={setName}
            maxLength={60}
          />
          <Textfield
            singleLine
            label="아이디"
            placeholder="아이디를 입력해 주세요"
            value={loginId}
            onValueChange={setLoginId}
          />
          <Textfield
            singleLine
            type="date"
            label="입사일"
            value={employedAt}
            onValueChange={setEmployedAt}
          />
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>재직 상태</label>
            <select
              css={cssObj.toolbarSelect}
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
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>근무 형태</label>
            <select
              css={cssObj.toolbarSelect}
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
        </div>
        <div css={cssObj.panelLabelSection}>
          <h3 css={cssObj.panelSubtitle}>초기 비밀번호</h3>
          <Textfield
            singleLine
            type="password"
            label="비밀번호"
            value={password}
            onValueChange={setPassword}
            helperText={passwordHelperText}
            status={hasPasswordError ? 'negative' : 'normal'}
          />
          <Textfield
            singleLine
            type="password"
            label="비밀번호 확인"
            value={passwordConfirm}
            onValueChange={setPasswordConfirm}
            helperText={passwordConfirmHelperText}
            status={hasPasswordConfirmError ? 'negative' : 'normal'}
          />
        </div>
        <Button variant="assistive" size="small" onClick={handleGeneratePassword}>
          비밀번호 무작위 생성
        </Button>

        {createMutation.isError && (
          <p css={cssObj.helperText}>
            사용자 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
      </form>
      <div css={cssObj.panelFooter}>
        <Button
          type="submit"
          size="small"
          isFull
          form={formId}
          iconRight={<Plus />}
          disabled={isCreateDisabled}
        >
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
  const [isHwalseongValue, setIsHwalseongValue] = useState(isHwalseong ? 'true' : 'false');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPermissionTooltipOpen, setIsPermissionTooltipOpen] = useState(false);
  const [selectedPermissionNanoId, setSelectedPermissionNanoId] = useState<string>('');

  const permissionsQuery = useGetPermissionsQuery(
    { gigwanNanoId, pageNumber: 1, pageSize: 50 },
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

  const availablePermissions = permissionsQuery.data?.permissions ?? [];

  const handlePermissionLink = async () => {
    if (!selectedPermissionNanoId) return;
    await permissionLinkMutation.mutateAsync({ sayongjas: [{ nanoId: sayongjaNanoId }] });
    setIsPermissionTooltipOpen(false);
    setSelectedPermissionNanoId('');
    await onRefreshPermissions();
  };

  const handleGeneratePassword = () => {
    const generated = generateRandomPassword();
    setPassword(generated);
    setPasswordConfirm(generated);
  };

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
            onValueChange={setPassword}
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
          <div css={cssObj.sectionActions}>
            <Button type="submit" size="small" disabled={isPasswordSaveDisabled}>
              비밀번호 변경
            </Button>
          </div>
        </form>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>연결 객체들</h3>
          <div css={cssObj.panelLabel}>권한들</div>
          <div css={cssObj.permissionList}>
            {permissions.map((permission) => (
              <div key={permission.nanoId} css={cssObj.permissionItem}>
                <span css={cssObj.permissionName}>{permission.name}</span>
                <span css={cssObj.panelText}>{permission.role}</span>
              </div>
            ))}
            {!permissions.length && <p css={cssObj.helperText}>아직 연결된 권한이 없습니다.</p>}
          </div>

          <div css={[cssObj.sectionActions, cssObj.permissionActionContainer]}>
            <Button
              styleType="outlined"
              variant="assistive"
              isFull
              onClick={() => setIsPermissionTooltipOpen((prev) => !prev)}
              aria-expanded={isPermissionTooltipOpen}
              iconRight={<Plus />}
            >
              권한 추가
            </Button>
            {isPermissionTooltipOpen ? (
              <div css={cssObj.permissionTooltip}>
                <label css={cssObj.panelLabel}>추가할 권한 선택</label>
                <select
                  css={cssObj.toolbarSelect}
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
                  <p css={cssObj.helperText}>권한 목록을 불러오지 못했습니다.</p>
                )}

                <div css={cssObj.permissionTooltipActions}>
                  <Button
                    styleType="solid"
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setIsPermissionTooltipOpen(false);
                      setSelectedPermissionNanoId('');
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    size="small"
                    onClick={handlePermissionLink}
                    disabled={!selectedPermissionNanoId || permissionsQuery.isLoading}
                  >
                    연결
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {updateMutation.isError && (
          <p css={cssObj.helperText}>사용자 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
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

type MultiSelectionPanelProps = {
  sayongjas: SayongjaListItem[];
};

function MultiSelectionPanel({ sayongjas }: MultiSelectionPanelProps) {
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
