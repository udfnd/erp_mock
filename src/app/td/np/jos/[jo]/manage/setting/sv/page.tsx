'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { z } from 'zod';

import { apiClient } from '@/global';
import {
  type JojikDetailResponse,
  type UpdateJojikRequest,
  useJojikQuery,
  useUpdateJojikMutation,
  useUpdateJojikSchoolsMutation,
} from '@/api/jojik';
import LabeledInput from '@/app/(erp)/td/g/_components/LabeledInput';
import { Copy, Delete, Plus } from '@/common/icons';
import { Checkbox } from '@/design';
import { Button, Chip, Textfield } from '@/design';

import * as styles from './page.style.css';

type PageProps = {
  params: {
    jo: string;
  };
};

type FeedbackState = { type: 'success' | 'error'; message: string } | null;

type BasicFormState = {
  name: string;
  intro: string;
};

type BasicState = {
  form: BasicFormState;
  feedback: FeedbackState;
};

type BasicAction =
  | { type: 'update'; field: keyof BasicFormState; value: string }
  | { type: 'reset'; payload: BasicFormState }
  | { type: 'feedback'; payload: FeedbackState };

const basicReducer = (state: BasicState, action: BasicAction): BasicState => {
  switch (action.type) {
    case 'update':
      if (state.form[action.field] === action.value) return state;
      return { form: { ...state.form, [action.field]: action.value }, feedback: null };
    case 'reset':
      return { form: action.payload, feedback: null };
    case 'feedback':
      return { ...state, feedback: action.payload };
    default:
      return state;
  }
};

type SchoolState = {
  schools: string[];
  input: string;
  dirty: boolean;
  feedback: FeedbackState;
};

type SchoolAction =
  | { type: 'reset'; payload: string[] }
  | { type: 'set-input'; value: string }
  | { type: 'add'; value: string }
  | { type: 'remove'; value: string }
  | { type: 'feedback'; payload: FeedbackState };

const schoolReducer = (state: SchoolState, action: SchoolAction): SchoolState => {
  switch (action.type) {
    case 'reset':
      return { schools: action.payload, input: '', dirty: false, feedback: null };
    case 'set-input':
      return { ...state, input: action.value };
    case 'add':
      if (state.schools.includes(action.value)) {
        return {
          ...state,
          input: '',
          feedback: { type: 'error', message: '이미 추가된 학교입니다.' },
        };
      }
      return {
        schools: [...state.schools, action.value],
        input: '',
        dirty: true,
        feedback: null,
      };
    case 'remove':
      return {
        ...state,
        schools: state.schools.filter((school) => school !== action.value),
        dirty: true,
        feedback: null,
      };
    case 'feedback':
      return { ...state, feedback: action.payload };
    default:
      return state;
  }
};

type OpenSettingsState = {
  openFileNanoIds: string[];
  canAccessBasicInfoNanoId: string;
  canAccessOpenFileNanoId: string;
  canHadaLinkRequestNanoId: string;
  dirty: boolean;
  feedback: FeedbackState;
};

type OpenSettingsAction =
  | {
      type: 'reset';
      payload: {
        openFileNanoIds: string[];
        canAccessBasicInfoNanoId: string;
        canAccessOpenFileNanoId: string;
        canHadaLinkRequestNanoId: string;
      };
    }
  | { type: 'toggle-open-file'; nanoId: string }
  | { type: 'set-basic-info'; nanoId: string }
  | { type: 'set-open-file'; nanoId: string }
  | { type: 'set-hada'; nanoId: string }
  | { type: 'feedback'; payload: FeedbackState };

const openSettingsReducer = (
  state: OpenSettingsState,
  action: OpenSettingsAction,
): OpenSettingsState => {
  switch (action.type) {
    case 'reset':
      return {
        openFileNanoIds: action.payload.openFileNanoIds,
        canAccessBasicInfoNanoId: action.payload.canAccessBasicInfoNanoId,
        canAccessOpenFileNanoId: action.payload.canAccessOpenFileNanoId,
        canHadaLinkRequestNanoId: action.payload.canHadaLinkRequestNanoId,
        dirty: false,
        feedback: null,
      };
    case 'toggle-open-file': {
      const exists = state.openFileNanoIds.includes(action.nanoId);
      return {
        ...state,
        openFileNanoIds: exists
          ? state.openFileNanoIds.filter((id) => id !== action.nanoId)
          : [...state.openFileNanoIds, action.nanoId],
        dirty: true,
        feedback: null,
      };
    }
    case 'set-basic-info':
      if (state.canAccessBasicInfoNanoId === action.nanoId) return state;
      return {
        ...state,
        canAccessBasicInfoNanoId: action.nanoId,
        dirty: true,
        feedback: null,
      };
    case 'set-open-file':
      if (state.canAccessOpenFileNanoId === action.nanoId) return state;
      return {
        ...state,
        canAccessOpenFileNanoId: action.nanoId,
        dirty: true,
        feedback: null,
      };
    case 'set-hada':
      if (state.canHadaLinkRequestNanoId === action.nanoId) return state;
      return {
        ...state,
        canHadaLinkRequestNanoId: action.nanoId,
        dirty: true,
        feedback: null,
      };
    case 'feedback':
      return { ...state, feedback: action.payload };
    default:
      return state;
  }
};

type SangtaeOption = { nanoId: string; name: string };

const sangtaeSchema = z.object({ nanoId: z.string(), name: z.string() });
const sangtaeResponseSchema = z.object({ sangtaes: z.array(sangtaeSchema) });

type SangtaeResponse = z.infer<typeof sangtaeResponseSchema>;

const useCanAccessOpenFileSangtaesQuery = () =>
  useQuery<SangtaeResponse>({
    queryKey: ['canAccessOpenFileSangtaes'],
    queryFn: async () => {
      const res = await apiClient.get('/T/dl/can-access-open-file-sangtaes');
      return sangtaeResponseSchema.parse(res.data);
    },
  });

const useCanHadaLinkRequestSangtaesQuery = () =>
  useQuery<SangtaeResponse>({
    queryKey: ['canHadaLinkRequestSangtaes'],
    queryFn: async () => {
      const res = await apiClient.get('/T/dl/can-hada-link-request-sangtaes');
      return sangtaeResponseSchema.parse(res.data);
    },
  });

type JojikDetailWithSchools = JojikDetailResponse & {
  schools?: { name: string; nanoId: string }[];
};

export default function JoManageSettingPage() {
  const queryClient = useQueryClient();
  const { jo: jojikNanoId } = useParams<{ jo: string }>();

  const {
    data: jojik,
    isLoading: isJojikLoading,
    isFetching: isJojikFetching,
    error: jojikError,
  } = useJojikQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
  });
  const updateJojikMutation = useUpdateJojikMutation(jojikNanoId);
  const updateJojikSchoolsMutation = useUpdateJojikSchoolsMutation(jojikNanoId);

  const { data: openFileSangtaesData, isLoading: isOpenFileSangtaesLoading } =
    useCanAccessOpenFileSangtaesQuery();
  const { data: hadaSangtaesData, isLoading: isHadaSangtaesLoading } =
    useCanHadaLinkRequestSangtaesQuery();

  const [basicState, dispatchBasic] = useReducer(basicReducer, {
    form: { name: '', intro: '' },
    feedback: null,
  });

  const [schoolState, dispatchSchool] = useReducer(schoolReducer, {
    schools: [],
    input: '',
    dirty: false,
    feedback: null,
  });

  const [openState, dispatchOpenState] = useReducer(openSettingsReducer, {
    openFileNanoIds: [],
    canAccessBasicInfoNanoId: '',
    canAccessOpenFileNanoId: '',
    canHadaLinkRequestNanoId: '',
    dirty: false,
    feedback: null,
  });

  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [savingTarget, setSavingTarget] = useState<'basic' | 'open' | null>(null);

  useEffect(() => {
    if (!jojik) return;
    dispatchBasic({
      type: 'reset',
      payload: { name: jojik.name, intro: jojik.intro ?? '' },
    });

    const jojikWithSchools = jojik as JojikDetailWithSchools;
    dispatchSchool({
      type: 'reset',
      payload: (jojikWithSchools.schools ?? []).map((school) => school.name),
    });

    dispatchOpenState({
      type: 'reset',
      payload: {
        openFileNanoIds: (jojik.openFiles ?? []).map((file) => file.nanoId),
        canAccessBasicInfoNanoId: jojik.openSangtaeNanoId ?? '',
        canAccessOpenFileNanoId: jojik.canAccessOpenFileSangtaeNanoId ?? '',
        canHadaLinkRequestNanoId: jojik.canHadaLinkRequestSangtaeNanoId ?? '',
      },
    });
  }, [jojik]);

  const handleBasicChange = useCallback((field: keyof BasicFormState, value: string) => {
    dispatchBasic({ type: 'update', field, value });
  }, []);

  const isBasicDirty = useMemo(() => {
    if (!jojik) {
      return basicState.form.name.trim().length > 0 || basicState.form.intro.trim().length > 0;
    }
    return basicState.form.name !== jojik.name || (jojik.intro ?? '') !== basicState.form.intro;
  }, [basicState.form, jojik]);

  const isBasicValid = basicState.form.name.trim().length > 0;

  const handleSaveBasic = useCallback(() => {
    if (!isBasicDirty || !isBasicValid) return;
    const openFileNanoIds = (jojik?.openFiles ?? []).map((file) => file.nanoId);
    const payload: UpdateJojikRequest = {
      name: basicState.form.name.trim(),
      intro: basicState.form.intro.trim(),
      openFileNanoIds,
    };
    if (jojik?.openSangtaeNanoId) {
      payload.openSangtaeNanoId = jojik.openSangtaeNanoId;
    }
    if (jojik?.canAccessOpenFileSangtaeNanoId) {
      payload.canAccessOpenFileSangtaeNanoId = jojik.canAccessOpenFileSangtaeNanoId;
    }
    if (jojik?.canHadaLinkRequestSangtaeNanoId) {
      payload.canHadaLinkRequestSangtaeNanoId = jojik.canHadaLinkRequestSangtaeNanoId;
    }

    setSavingTarget('basic');
    updateJojikMutation.mutate(payload, {
      onSuccess: (data) => {
        dispatchBasic({
          type: 'reset',
          payload: { name: data.name, intro: data.intro ?? '' },
        });
        dispatchBasic({
          type: 'feedback',
          payload: { type: 'success', message: '조직 기본 설정이 저장되었습니다.' },
        });
        dispatchOpenState({
          type: 'reset',
          payload: {
            openFileNanoIds: (data.openFiles ?? []).map((file) => file.nanoId),
            canAccessBasicInfoNanoId: data.openSangtaeNanoId ?? '',
            canAccessOpenFileNanoId: data.canAccessOpenFileSangtaeNanoId ?? '',
            canHadaLinkRequestNanoId: data.canHadaLinkRequestSangtaeNanoId ?? '',
          },
        });
        queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
      },
      onError: () => {
        dispatchBasic({
          type: 'feedback',
          payload: { type: 'error', message: '저장에 실패했습니다. 다시 시도해주세요.' },
        });
      },
      onSettled: () => {
        setSavingTarget(null);
      },
    });
  }, [
    basicState.form,
    isBasicDirty,
    isBasicValid,
    jojik,
    jojikNanoId,
    queryClient,
    updateJojikMutation,
  ]);

  const handleSchoolInputChange = useCallback((value: string) => {
    dispatchSchool({ type: 'set-input', value });
  }, []);

  const handleAddSchool = useCallback(() => {
    const trimmed = schoolState.input.trim();
    if (!trimmed) return;
    dispatchSchool({ type: 'add', value: trimmed });
  }, [schoolState.input]);

  const handleRemoveSchool = useCallback((value: string) => {
    dispatchSchool({ type: 'remove', value });
  }, []);

  const handleSaveSchools = useCallback(() => {
    if (!schoolState.dirty) return;
    updateJojikSchoolsMutation.mutate(
      { schools: schoolState.schools },
      {
        onSuccess: (data) => {
          dispatchSchool({
            type: 'reset',
            payload: data.schools.map((school) => school.name),
          });
          dispatchSchool({
            type: 'feedback',
            payload: { type: 'success', message: '관련 학교가 저장되었습니다.' },
          });
          queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
        onError: () => {
          dispatchSchool({
            type: 'feedback',
            payload: { type: 'error', message: '관련 학교 저장에 실패했습니다.' },
          });
        },
      },
    );
  }, [
    jojikNanoId,
    queryClient,
    schoolState.dirty,
    schoolState.schools,
    updateJojikSchoolsMutation,
  ]);

  const handleToggleOpenFile = useCallback((nanoId: string) => {
    dispatchOpenState({ type: 'toggle-open-file', nanoId });
  }, []);

  const handleChangeBasicInfoAccess = useCallback((nanoId: string) => {
    dispatchOpenState({ type: 'set-basic-info', nanoId });
  }, []);

  const handleChangeOpenFileAccess = useCallback((nanoId: string) => {
    dispatchOpenState({ type: 'set-open-file', nanoId });
  }, []);

  const handleChangeHadaAccess = useCallback((nanoId: string) => {
    dispatchOpenState({ type: 'set-hada', nanoId });
  }, []);

  const openFileOptions = useMemo(() => jojik?.openFiles ?? [], [jojik?.openFiles]);

  const isOpenSettingsValid =
    Boolean(openState.canAccessBasicInfoNanoId) &&
    Boolean(openState.canAccessOpenFileNanoId) &&
    Boolean(openState.canHadaLinkRequestNanoId);

  const handleSaveOpenSettings = useCallback(() => {
    if (!openState.dirty || !isOpenSettingsValid) return;

    const payload: UpdateJojikRequest = {
      openFileNanoIds: openState.openFileNanoIds,
      openSangtaeNanoId: openState.canAccessBasicInfoNanoId,
      canAccessOpenFileSangtaeNanoId: openState.canAccessOpenFileNanoId,
      canHadaLinkRequestSangtaeNanoId: openState.canHadaLinkRequestNanoId,
    };

    setSavingTarget('open');
    updateJojikMutation.mutate(payload, {
      onSuccess: (data) => {
        dispatchOpenState({
          type: 'reset',
          payload: {
            openFileNanoIds: (data.openFiles ?? []).map((file) => file.nanoId),
            canAccessBasicInfoNanoId: data.openSangtaeNanoId ?? '',
            canAccessOpenFileNanoId: data.canAccessOpenFileSangtaeNanoId ?? '',
            canHadaLinkRequestNanoId: data.canHadaLinkRequestSangtaeNanoId ?? '',
          },
        });
        dispatchOpenState({
          type: 'feedback',
          payload: { type: 'success', message: '오픈 파일 및 접근 설정이 저장되었습니다.' },
        });
        dispatchBasic({
          type: 'reset',
          payload: { name: data.name, intro: data.intro ?? '' },
        });
        queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
      },
      onError: () => {
        dispatchOpenState({
          type: 'feedback',
          payload: { type: 'error', message: '오픈 설정 저장에 실패했습니다.' },
        });
      },
      onSettled: () => {
        setSavingTarget(null);
      },
    });
  }, [
    dispatchBasic,
    isOpenSettingsValid,
    jojikNanoId,
    openState.canAccessBasicInfoNanoId,
    openState.canAccessOpenFileNanoId,
    openState.canHadaLinkRequestNanoId,
    openState.dirty,
    openState.openFileNanoIds,
    queryClient,
    updateJojikMutation,
  ]);

  const linkRequestUrl = jojik?.jaewonsaengLinkRequestUrl ?? '';

  const handleCopyLink = useCallback(async () => {
    if (!linkRequestUrl) return;
    try {
      await navigator.clipboard.writeText(linkRequestUrl);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  }, [linkRequestUrl]);

  const copyMessage =
    copyStatus === 'success'
      ? '링크를 복사했습니다.'
      : copyStatus === 'error'
        ? '링크 복사에 실패했습니다. 다시 시도해주세요.'
        : null;

  const basicIsSaving = updateJojikMutation.isPending && savingTarget === 'basic';
  const openIsSaving = updateJojikMutation.isPending && savingTarget === 'open';
  const schoolsIsSaving = updateJojikSchoolsMutation.isPending;

  return (
    <div css={styles.page}>
      <header css={styles.header}>
        <h1 css={styles.pageTitle}>조직 설정</h1>
        <p css={styles.pageDescription}>
          조직 기본 정보와 관련 학교, 오픈 파일 접근 정책을 관리합니다.
        </p>
      </header>
      <div css={styles.cardGrid}>
        <section css={styles.card}>
          <div css={styles.cardHeader}>
            <div css={styles.cardTitleGroup}>
              <h2 css={styles.cardTitle}>조직 기본 설정</h2>
              <p css={styles.cardSubtitle}>조직 이름과 소개, 재원생 링크를 관리할 수 있습니다.</p>
            </div>
            <Chip size="sm" variant="outlined" disabled>
              조직 코드 {jojikNanoId}
            </Chip>
          </div>
          <div css={styles.cardBody}>
            {jojikError ? <p css={styles.errorText}>조직 정보를 불러오지 못했습니다.</p> : null}
            <LabeledInput
              label="조직 이름"
              placeholder="조직 이름을 입력하세요"
              required
              maxLength={50}
              value={basicState.form.name}
              onValueChange={(value) => handleBasicChange('name', value)}
            />
            <Textfield
              label="조직 소개"
              placeholder="조직 소개를 입력하세요"
              maxLength={300}
              value={basicState.form.intro}
              onValueChange={(value) => handleBasicChange('intro', value)}
            />
            <div css={styles.linkField}>
              <span css={styles.fieldLabel}>재원생 링크 요청 URL</span>
              <div css={styles.linkRow}>
                <LabeledInput
                  value={jojik?.jaewonsaengLinkRequestUrl ?? ''}
                  readOnly
                  containerClassName={styles.linkInput}
                  placeholder="재원생 링크 요청 URL이 없습니다"
                />
                <Button
                  size="small"
                  styleType="text"
                  variant="secondary"
                  iconLeft={<Copy width={16} height={16} />}
                  onClick={handleCopyLink}
                  disabled={!linkRequestUrl}
                >
                  {copyStatus === 'success' ? '복사됨' : '복사'}
                </Button>
              </div>
              {copyMessage ? (
                <span
                  css={copyStatus === 'error' ? styles.feedback.error : styles.feedback.success}
                >
                  {copyMessage}
                </span>
              ) : null}
            </div>
          </div>
          <footer css={styles.cardFooter}>
            {basicState.feedback ? (
              <span css={styles.feedback[basicState.feedback.type]}>
                {basicState.feedback.message}
              </span>
            ) : (
              <span css={styles.statusText}>
                {isJojikLoading || isJojikFetching
                  ? '조직 정보를 불러오는 중입니다.'
                  : '조직 이름과 소개를 수정할 수 있습니다.'}
              </span>
            )}
            <Button
              size="small"
              styleType="solid"
              variant="primary"
              disabled={!isBasicDirty || !isBasicValid || basicIsSaving}
              onClick={handleSaveBasic}
            >
              {basicIsSaving ? '저장 중...' : '저장'}
            </Button>
          </footer>
        </section>

        <section css={styles.card}>
          <div css={styles.cardHeader}>
            <div css={styles.cardTitleGroup}>
              <h2 css={styles.cardTitle}>관련 학교 설정</h2>
              <p css={styles.cardSubtitle}>조직과 연계된 학교를 추가하거나 제거할 수 있습니다.</p>
            </div>
          </div>
          <div css={styles.cardBody}>
            <div css={styles.inputRow}>
              <LabeledInput
                label="학교 이름"
                placeholder="학교 이름을 입력하세요"
                value={schoolState.input}
                onValueChange={handleSchoolInputChange}
                maxLength={50}
                containerClassName={styles.schoolInput}
              />
              <Button
                size="small"
                styleType="solid"
                variant="secondary"
                iconLeft={<Plus width={16} height={16} />}
                onClick={handleAddSchool}
                disabled={!schoolState.input.trim()}
              >
                추가
              </Button>
            </div>
            {schoolState.feedback?.type === 'error' ? (
              <span css={styles.feedback.error}>{schoolState.feedback.message}</span>
            ) : null}
            <div css={styles.chipList}>
              {schoolState.schools.length > 0 ? (
                schoolState.schools.map((school) => (
                  <Chip
                    key={school}
                    size="sm"
                    variant="outlined"
                    iconRight={<Delete width={14} height={14} />}
                    onClick={() => handleRemoveSchool(school)}
                  >
                    {school}
                  </Chip>
                ))
              ) : (
                <span css={styles.emptyText}>등록된 학교가 없습니다.</span>
              )}
            </div>
          </div>
          <footer css={styles.cardFooter}>
            {schoolState.feedback && schoolState.feedback.type === 'success' ? (
              <span css={styles.feedback.success}>{schoolState.feedback.message}</span>
            ) : (
              <span css={styles.statusText}>
                {schoolState.schools.length > 0
                  ? '등록된 학교를 클릭하여 제거할 수 있습니다.'
                  : '추가하고 싶은 학교 이름을 입력 후 추가 버튼을 눌러주세요.'}
              </span>
            )}
            <Button
              size="small"
              styleType="solid"
              variant="primary"
              disabled={!schoolState.dirty || schoolsIsSaving}
              onClick={handleSaveSchools}
            >
              {schoolsIsSaving ? '저장 중...' : '저장'}
            </Button>
          </footer>
        </section>

        <section css={clsx(styles.card, styles.cardWide)}>
          <div css={styles.cardHeader}>
            <div css={styles.cardTitleGroup}>
              <h2 css={styles.cardTitle}>오픈 파일 · 컨텐츠 설정</h2>
              <p css={styles.cardSubtitle}>
                조직 정보와 오픈 파일 접근 범위를 조정하고, 필요한 파일만 공개하세요.
              </p>
            </div>
          </div>
          <div css={styles.cardBody}>
            <div css={styles.selectGroupGrid}>
              <div css={styles.selectGroup}>
                <span css={styles.fieldLabel}>조직 기본 정보 공개 범위</span>
                <select
                  css={styles.select}
                  value={openState.canAccessBasicInfoNanoId}
                  onChange={(event) => handleChangeBasicInfoAccess(event.target.value)}
                  disabled={isOpenFileSangtaesLoading}
                >
                  <option value="">선택하세요</option>
                  {(openFileSangtaesData?.sangtaes ?? []).map((option: SangtaeOption) => (
                    <option key={option.nanoId} value={option.nanoId}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <span css={styles.fieldDescription}>
                  조직 소개, 기본 정보 등의 공개 범위를 지정합니다.
                </span>
              </div>
              <div css={styles.selectGroup}>
                <span css={styles.fieldLabel}>오픈 파일 접근 권한</span>
                <select
                  css={styles.select}
                  value={openState.canAccessOpenFileNanoId}
                  onChange={(event) => handleChangeOpenFileAccess(event.target.value)}
                  disabled={isOpenFileSangtaesLoading}
                >
                  <option value="">선택하세요</option>
                  {(openFileSangtaesData?.sangtaes ?? []).map((option: SangtaeOption) => (
                    <option key={option.nanoId} value={option.nanoId}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <span css={styles.fieldDescription}>
                  첨부된 오픈 파일을 조회할 수 있는 대상을 선택하세요.
                </span>
              </div>
              <div css={styles.selectGroup}>
                <span css={styles.fieldLabel}>하다 링크 요청 승인 대상</span>
                <select
                  css={styles.select}
                  value={openState.canHadaLinkRequestNanoId}
                  onChange={(event) => handleChangeHadaAccess(event.target.value)}
                  disabled={isHadaSangtaesLoading}
                >
                  <option value="">선택하세요</option>
                  {(hadaSangtaesData?.sangtaes ?? []).map((option: SangtaeOption) => (
                    <option key={option.nanoId} value={option.nanoId}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <span css={styles.fieldDescription}>
                  하다 링크 요청을 처리할 수 있는 사용자를 선택하세요.
                </span>
              </div>
            </div>

            <div css={styles.openFileSection}>
              <span css={styles.sectionTitle}>공개할 오픈 파일 선택</span>
              <span css={styles.sectionDescription}>
                공개할 파일만 선택하면 해당 권한을 가진 사용자에게만 노출됩니다.
              </span>
              <div css={styles.openFileList}>
                {openFileOptions.length > 0 ? (
                  openFileOptions.map((file) => (
                    <label key={file.nanoId} css={styles.openFileItem}>
                      <Checkbox
                        checked={openState.openFileNanoIds.includes(file.nanoId)}
                        onChange={() => handleToggleOpenFile(file.nanoId)}
                        ariaLabel={`${file.name} 공개 여부`}
                      />
                      <span css={styles.openFileName}>{file.name}</span>
                    </label>
                  ))
                ) : (
                  <span css={styles.emptyText}>연결된 오픈 파일이 없습니다.</span>
                )}
              </div>
            </div>
          </div>
          <footer css={styles.cardFooter}>
            {openState.feedback ? (
              <span css={styles.feedback[openState.feedback.type]}>
                {openState.feedback.message}
              </span>
            ) : (
              <span css={styles.statusText}>
                {isOpenFileSangtaesLoading || isHadaSangtaesLoading
                  ? '접근 권한 옵션을 불러오는 중입니다.'
                  : '공개 범위와 파일 선택을 조정한 후 저장을 눌러주세요.'}
              </span>
            )}
            <Button
              size="small"
              styleType="solid"
              variant="primary"
              disabled={!openState.dirty || !isOpenSettingsValid || openIsSaving}
              onClick={handleSaveOpenSettings}
            >
              {openIsSaving ? '저장 중...' : '저장'}
            </Button>
          </footer>
        </section>
      </div>
    </div>
  );
}
