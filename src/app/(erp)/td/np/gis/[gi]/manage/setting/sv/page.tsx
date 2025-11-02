'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import {
  useEmploymentCategoriesQuery,
  useGigwanQuery,
  useUpdateGigwanNameMutation,
  useUpdateGigwanIntroMutation,
  useUpsertGigwanAddressMutation,
  useUpsertEmploymentCategoriesMutation,
  useUpsertWorkTypeCustomSangtaesMutation,
  useWorkTypeCustomSangtaesQuery,
} from '@/api/gigwan';
import LabeledInput from '@/app/(erp)/td/g/_components/LabeledInput';
import { Delete, Plus, Edit } from '@/components/icons';
import { Button, IconButton, Textfield } from '@/design';

import * as styles from './page.style.css';

type FeedbackState = { type: 'success' | 'error'; message: string } | null;

type EmploymentStatusForm = {
  nanoId: string | null;
  name: string;
  localId: string;
  isHwalseong: boolean;
};

type EmploymentCategoryForm = {
  nanoId: string;
  name: string;
  statuses: EmploymentStatusForm[];
};

type WorkTypeStatusForm = {
  nanoId: string | null;
  name: string;
  localId: string;
  isHwalseong: boolean;
  isNew?: boolean;
};

type BasicFormState = {
  name: string;
  intro: string;
  juso: string;
};

type BasicState = {
  form: BasicFormState;
  nameFeedback: FeedbackState;
  introFeedback: FeedbackState;
  jusoFeedback: FeedbackState;
};

type BasicAction =
  | { type: 'update'; field: keyof BasicFormState; value: string }
  | { type: 'reset'; payload: BasicFormState }
  | { type: 'feedback-name'; payload: FeedbackState }
  | { type: 'feedback-intro'; payload: FeedbackState }
  | { type: 'feedback-juso'; payload: FeedbackState };

const basicReducer = (state: BasicState, action: BasicAction): BasicState => {
  switch (action.type) {
    case 'update': {
      const next = { ...state.form, [action.field]: action.value };
      if (action.field === 'name') return { ...state, form: next, nameFeedback: null };
      if (action.field === 'intro') return { ...state, form: next, introFeedback: null };
      if (action.field === 'juso') return { ...state, form: next, jusoFeedback: null };
      return { ...state, form: next };
    }
    case 'reset':
      return {
        form: action.payload,
        nameFeedback: null,
        introFeedback: null,
        jusoFeedback: null,
      };
    case 'feedback-name':
      return { ...state, nameFeedback: action.payload };
    case 'feedback-intro':
      return { ...state, introFeedback: action.payload };
    case 'feedback-juso':
      return { ...state, jusoFeedback: action.payload };
    default:
      return state;
  }
};

type EmploymentState = {
  categories: EmploymentCategoryForm[];
  dirty: boolean;
  feedback: FeedbackState;
  editing: Record<string, boolean>;
};

type EmploymentAction =
  | { type: 'reset'; payload: EmploymentCategoryForm[] }
  | { type: 'change-status'; categoryId: string; statusLocalId: string; value: string }
  | { type: 'add-status'; categoryId: string; status: EmploymentStatusForm }
  | { type: 'remove-status'; categoryId: string; statusLocalId: string }
  | { type: 'toggle-edit'; statusLocalId: string; value?: boolean }
  | { type: 'feedback'; payload: FeedbackState };

const employmentReducer = (state: EmploymentState, action: EmploymentAction): EmploymentState => {
  switch (action.type) {
    case 'reset':
      return { categories: action.payload, dirty: false, feedback: null, editing: {} };
    case 'change-status':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.nanoId === action.categoryId
            ? {
                ...category,
                statuses: category.statuses.map((status) =>
                  status.localId === action.statusLocalId
                    ? { ...status, name: action.value }
                    : status,
                ),
              }
            : category,
        ),
        dirty: true,
        feedback: null,
      };
    case 'add-status':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.nanoId === action.categoryId
            ? { ...category, statuses: [...category.statuses, action.status] }
            : category,
        ),
        dirty: true,
        feedback: null,
        editing: { ...state.editing, [action.status.localId]: true },
      };
    case 'remove-status': {
      const { [action.statusLocalId]: _removed, ...restEditing } = state.editing;
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.nanoId === action.categoryId
            ? {
                ...category,
                statuses: category.statuses.filter(
                  (status) => status.localId !== action.statusLocalId,
                ),
              }
            : category,
        ),
        dirty: true,
        feedback: null,
        editing: restEditing,
      };
    }
    case 'toggle-edit':
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.statusLocalId]:
            action.value ?? !state.editing[action.statusLocalId],
        },
      };
    case 'feedback':
      return { ...state, feedback: action.payload };
    default:
      return state;
  }
};

type WorkTypeState = {
  statuses: WorkTypeStatusForm[];
  dirty: boolean;
  feedback: FeedbackState;
};

type WorkTypeAction =
  | { type: 'reset'; payload: WorkTypeStatusForm[] }
  | { type: 'change'; statusLocalId: string; value: string }
  | { type: 'add'; status: WorkTypeStatusForm }
  | { type: 'remove'; statusLocalId: string }
  | { type: 'feedback'; payload: FeedbackState };

const workTypeReducer = (state: WorkTypeState, action: WorkTypeAction): WorkTypeState => {
  switch (action.type) {
    case 'reset':
      return { statuses: action.payload, dirty: false, feedback: null };
    case 'change':
      return {
        statuses: state.statuses.map((status) =>
          status.localId === action.statusLocalId ? { ...status, name: action.value } : status,
        ),
        dirty: true,
        feedback: null,
      };
    case 'add':
      return { statuses: [...state.statuses, action.status], dirty: true, feedback: null };
    case 'remove':
      return {
        statuses: state.statuses.filter((status) => status.localId !== action.statusLocalId),
        dirty: true,
        feedback: null,
      };
    case 'feedback':
      return { ...state, feedback: action.payload };
    default:
      return state;
  }
};

let localIdCounter = 0;
const createLocalId = () => {
  localIdCounter += 1;
  return `local-${Date.now()}-${localIdCounter}`;
};

export default function GigwanSettingServicePage() {
  const { gi } = useParams<{ gi: string }>();
  const gigwanNanoId = Array.isArray(gi) ? gi[0] : gi;

  const queryClient = useQueryClient();

  const {
    data: gigwan,
    isLoading: isGigwanLoading,
    isFetching: isGigwanFetching,
  } = useGigwanQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });

  const updateNameMutation = useUpdateGigwanNameMutation(gigwanNanoId);
  const updateIntroMutation = useUpdateGigwanIntroMutation(gigwanNanoId);
  const upsertJusoMutation = useUpsertGigwanAddressMutation(gigwanNanoId);

  const [basicState, dispatchBasic] = useReducer(basicReducer, {
    form: { name: '', intro: '', juso: '' },
    nameFeedback: null,
    introFeedback: null,
    jusoFeedback: null,
  });

  useEffect(() => {
    if (!gigwan) return;
    dispatchBasic({
      type: 'reset',
      payload: {
        name: gigwan.name ?? '',
        intro: gigwan.intro ?? '',
        juso: gigwan.juso?.juso ?? '',
      },
    });
  }, [gigwan]);

  const handleBasicChange = useCallback((field: 'name' | 'intro' | 'juso', value: string) => {
    dispatchBasic({ type: 'update', field, value });
  }, []);

  const nameDirty = useMemo(
    () => (gigwan ? basicState.form.name !== (gigwan.name ?? '') : basicState.form.name !== ''),
    [basicState.form.name, gigwan],
  );
  const introDirty = useMemo(
    () => (gigwan ? basicState.form.intro !== (gigwan.intro ?? '') : basicState.form.intro !== ''),
    [basicState.form.intro, gigwan],
  );
  const jusoDirty = useMemo(
    () =>
      gigwan
        ? basicState.form.juso !== (gigwan.juso?.juso ?? '')
        : basicState.form.juso !== '',
    [basicState.form.juso, gigwan],
  );

  const nameValid = basicState.form.name.trim().length > 0;
  const introValid = basicState.form.intro.trim().length > 0;
  const jusoValid = basicState.form.juso.trim().length > 0;

  const handleSaveName = useCallback(async () => {
    if (!nameDirty || !nameValid) return;
    try {
      await updateNameMutation.mutateAsync({ name: basicState.form.name.trim() });
      dispatchBasic({
        type: 'feedback-name',
        payload: { type: 'success', message: '이름이 저장되었습니다.' },
      });
      await queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] });
    } catch {
      dispatchBasic({
        type: 'feedback-name',
        payload: { type: 'error', message: '이름 저장에 실패했습니다. 다시 시도해주세요.' },
      });
    }
  }, [gigwanNanoId, nameDirty, nameValid, basicState.form.name, queryClient, updateNameMutation]);

  const handleSaveIntro = useCallback(async () => {
    if (!introDirty || !introValid) return;
    try {
      await updateIntroMutation.mutateAsync({ intro: basicState.form.intro.trim() });
      dispatchBasic({
        type: 'feedback-intro',
        payload: { type: 'success', message: '소개가 저장되었습니다.' },
      });
      await queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] });
    } catch {
      dispatchBasic({
        type: 'feedback-intro',
        payload: { type: 'error', message: '소개 저장에 실패했습니다. 다시 시도해주세요.' },
      });
    }
  }, [
    gigwanNanoId,
    introDirty,
    introValid,
    basicState.form.intro,
    queryClient,
    updateIntroMutation,
  ]);

  const handleSaveJuso = useCallback(async () => {
    if (!jusoDirty || !jusoValid) return;
    try {
      await upsertJusoMutation.mutateAsync({ address: basicState.form.juso.trim() });
      dispatchBasic({
        type: 'feedback-juso',
        payload: { type: 'success', message: '주소가 저장되었습니다.' },
      });
      await queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] });
    } catch {
      dispatchBasic({
        type: 'feedback-juso',
        payload: { type: 'error', message: '주소 저장에 실패했습니다. 다시 시도해주세요.' },
      });
    }
  }, [gigwanNanoId, jusoDirty, jusoValid, basicState.form.juso, queryClient, upsertJusoMutation]);

  const {
    data: employmentCategoriesData,
    isLoading: isEmploymentLoading,
    isFetching: isEmploymentFetching,
    error: employmentError,
  } = useEmploymentCategoriesQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });
  const upsertEmploymentCategoriesMutation = useUpsertEmploymentCategoriesMutation(gigwanNanoId);

  const [employmentState, dispatchEmployment] = useReducer(employmentReducer, {
    categories: [],
    dirty: false,
    feedback: null,
    editing: {},
  });

  useEffect(() => {
    if (!employmentCategoriesData) return;
    dispatchEmployment({
      type: 'reset',
      payload: employmentCategoriesData.categories.map((category) => ({
        nanoId: category.nanoId,
        name: category.name,
        statuses: category.sangtaes.map((status) => ({
          nanoId: status.nanoId,
          name: status.name,
          localId: status.nanoId ?? createLocalId(),
          isHwalseong: status.isHwalseong,
        })),
      })),
    });
  }, [employmentCategoriesData]);

  const handleEmploymentStatusChange = useCallback(
    (categoryNanoId: string, statusLocalId: string, value: string) => {
      dispatchEmployment({
        type: 'change-status',
        categoryId: categoryNanoId,
        statusLocalId,
        value,
      });
    },
    [],
  );

  const handleAddEmploymentStatus = useCallback((categoryNanoId: string) => {
    const newLocalId = createLocalId();
    const newStatus: EmploymentStatusForm = {
      nanoId: null,
      name: '',
      localId: newLocalId,
      isHwalseong: false,
    };
    dispatchEmployment({ type: 'add-status', categoryId: categoryNanoId, status: newStatus });
  }, []);

  const handleRemoveEmploymentStatus = useCallback(
    (categoryNanoId: string, statusLocalId: string, canRemove: boolean) => {
      if (!canRemove) return;
      dispatchEmployment({ type: 'remove-status', categoryId: categoryNanoId, statusLocalId });
    },
    [],
  );

  const toggleEditEmploymentStatus = useCallback((statusLocalId: string, canEdit: boolean) => {
    if (!canEdit) return;
    dispatchEmployment({ type: 'toggle-edit', statusLocalId });
  }, []);

  const employmentHasEmptyStatus = employmentState.categories.some((category) =>
    category.statuses.some(
      (status) => !status.isHwalseong && status.name.trim().length === 0,
    ),
  );

  const handleSaveEmploymentCategories = useCallback(() => {
    if (!employmentState.dirty || employmentHasEmptyStatus) return;
    upsertEmploymentCategoriesMutation.mutate(
      {
        categories: employmentState.categories.map((category) => ({
          nanoId: category.nanoId,
          sangtaes: category.statuses.map((status) => ({
            ...(status.nanoId ? { nanoId: status.nanoId } : {}),
            name: status.name.trim(),
            isHwalseong: status.isHwalseong,
          })),
        })),
      },
      {
        onSuccess: (data) => {
          dispatchEmployment({
            type: 'reset',
            payload: data.categories.map((category) => ({
              nanoId: category.nanoId,
              name: category.name,
              statuses: category.sangtaes.map((status) => ({
                nanoId: status.nanoId,
                name: status.name,
                localId: status.nanoId ?? createLocalId(),
                isHwalseong: status.isHwalseong,
              })),
            })),
          });
          dispatchEmployment({
            type: 'feedback',
            payload: { type: 'success', message: '재직 카테고리 상태가 저장되었습니다.' },
          });
          queryClient.invalidateQueries({ queryKey: ['employmentCategories', gigwanNanoId] });
        },
        onError: () => {
          dispatchEmployment({
            type: 'feedback',
            payload: { type: 'error', message: '재직 카테고리 상태 저장에 실패했습니다.' },
          });
        },
      },
    );
  }, [
    employmentState.categories,
    employmentState.dirty,
    employmentHasEmptyStatus,
    gigwanNanoId,
    queryClient,
    upsertEmploymentCategoriesMutation,
  ]);

  const {
    data: workTypeStatusesData,
    isLoading: isWorkTypeLoading,
    isFetching: isWorkTypeFetching,
    error: workTypeError,
  } = useWorkTypeCustomSangtaesQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });
  const upsertWorkTypeStatusesMutation = useUpsertWorkTypeCustomSangtaesMutation(gigwanNanoId);

  const [workTypeState, dispatchWorkType] = useReducer(workTypeReducer, {
    statuses: [],
    dirty: false,
    feedback: null,
  });

  useEffect(() => {
    if (!workTypeStatusesData) return;
    dispatchWorkType({
      type: 'reset',
      payload: workTypeStatusesData.sangtaes.map((status) => ({
        nanoId: status.nanoId,
        name: status.name,
        localId: status.nanoId ?? createLocalId(),
        isHwalseong: status.isHwalseong,
      })),
    });
  }, [workTypeStatusesData]);

  const handleWorkTypeStatusChange = useCallback((statusLocalId: string, value: string) => {
    dispatchWorkType({ type: 'change', statusLocalId, value });
  }, []);

  const handleAddWorkTypeStatus = useCallback(() => {
    const localId = createLocalId();
    dispatchWorkType({
      type: 'add',
      status: { nanoId: null, name: '', localId, isHwalseong: false, isNew: true },
    });
  }, []);

  const handleRemoveWorkTypeStatus = useCallback(
    (statusLocalId: string, canRemove: boolean) => {
      if (!canRemove) return;
      dispatchWorkType({ type: 'remove', statusLocalId });
    },
    [],
  );

  const workTypeHasEmptyStatus = workTypeState.statuses.some(
    (status) => !status.isHwalseong && status.name.trim().length === 0,
  );

  const handleSaveWorkTypeStatuses = useCallback(() => {
    if (!workTypeState.dirty || workTypeHasEmptyStatus) return;
    upsertWorkTypeStatusesMutation.mutate(
      {
        sangtaes: workTypeState.statuses.map((status) => ({
          ...(status.nanoId ? { nanoId: status.nanoId } : {}),
          name: status.name.trim(),
          isHwalseong: status.isHwalseong,
        })),
      },
      {
        onSuccess: (data) => {
          dispatchWorkType({
            type: 'reset',
            payload: data.sangtaes.map((status) => ({
              nanoId: status.nanoId,
              name: status.name,
              localId: status.nanoId ?? createLocalId(),
              isHwalseong: status.isHwalseong,
            })),
          });
          dispatchWorkType({
            type: 'feedback',
            payload: { type: 'success', message: '근무 형태 커스텀 상태가 저장되었습니다.' },
          });
          queryClient.invalidateQueries({ queryKey: ['workTypeCustomSangtaes', gigwanNanoId] });
        },
        onError: () => {
          dispatchWorkType({
            type: 'feedback',
            payload: { type: 'error', message: '근무 형태 상태 저장에 실패했습니다.' },
          });
        },
      },
    );
  }, [
    gigwanNanoId,
    queryClient,
    upsertWorkTypeStatusesMutation,
    workTypeState.dirty,
    workTypeHasEmptyStatus,
    workTypeState.statuses,
  ]);

  const employmentIsSaving = upsertEmploymentCategoriesMutation.isPending;
  const workTypeIsSaving = upsertWorkTypeStatusesMutation.isPending;

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleGroup}>
            <h2 className={styles.cardTitle}>기관 기본 설정</h2>
          </div>
        </div>

        <div className={styles.cardBody}>
          <LabeledInput
            label="기관 이름"
            placeholder="기관 이름을 입력하세요"
            value={basicState.form.name}
            onValueChange={(value) => handleBasicChange('name', value)}
            required
            maxLength={50}
            helperText="50자 이내"
          />
          <div className={styles.cardFooter}>
            {basicState.nameFeedback && (
              <span className={styles.feedback[basicState.nameFeedback.type]}>
                {basicState.nameFeedback.message}
              </span>
            )}
            <Button
              size="small"
              styleType="solid"
              variant="primary"
              disabled={!nameDirty || !nameValid || updateNameMutation.isPending}
              onClick={handleSaveName}
            >
              {updateNameMutation.isPending ? '저장 중...' : '저장'}
            </Button>
          </div>

          <Textfield
            label="기관 소개"
            placeholder="기관의 특징이나 안내 문구를 입력하세요"
            value={basicState.form.intro}
            onValueChange={(value) => handleBasicChange('intro', value)}
            rows={4}
            maxLength={300}
            helperText="최대 300자"
          />
          <div className={styles.cardFooter}>
            {basicState.introFeedback && (
              <span className={styles.feedback[basicState.introFeedback.type]}>
                {basicState.introFeedback.message}
              </span>
            )}
            <Button
              size="small"
              styleType="solid"
              variant="primary"
              disabled={!introDirty || !introValid || updateIntroMutation.isPending}
              onClick={handleSaveIntro}
            >
              {updateIntroMutation.isPending ? '저장 중...' : '저장'}
            </Button>
          </div>

          <LabeledInput
            label="기관 주소"
            placeholder="기관 주소를 입력하세요"
            value={basicState.form.juso}
            onValueChange={(value) => handleBasicChange('juso', value)}
            maxLength={200}
            helperText="저장 시 반영"
          />
          <div className={styles.cardFooter}>
            {basicState.jusoFeedback && (
              <span className={styles.feedback[basicState.jusoFeedback.type]}>
                {basicState.jusoFeedback.message}
              </span>
            )}
            <Button
              size="small"
              styleType="solid"
              variant="primary"
              disabled={!jusoDirty || !jusoValid || upsertJusoMutation.isPending}
              onClick={handleSaveJuso}
            >
              {upsertJusoMutation.isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </section>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleGroup}>
            <h2 className={styles.cardTitle}>사용자 재직 카테고리 상태</h2>
            <p className={styles.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
          </div>
        </div>
        <div className={styles.cardBody}>
          {employmentError ? (
            <p className={styles.errorText}>재직 카테고리 정보를 불러오지 못했습니다.</p>
          ) : null}
          {employmentState.categories.map((category) => (
            <div key={category.nanoId} className={styles.categorySection}>
              <span className={styles.categoryLabel}>{category.name}</span>

              <div className={styles.statusList}>
            {category.statuses.map((status) => {
                  const canEdit = !status.isHwalseong;
                  const isEditing =
                    canEdit && Boolean(employmentState.editing[status.localId]);
                  return (
                    <div key={status.localId} className={styles.statusField} role="group">
                      {isEditing ? (
                        <input
                          className={styles.statusInputField}
                          value={status.name}
                          onChange={(e) =>
                            handleEmploymentStatusChange(
                              category.nanoId,
                              status.localId,
                              e.target.value,
                            )
                          }
                          placeholder="상태 이름"
                          maxLength={20}
                          autoFocus
                        />
                      ) : (
                        <span className={styles.statusValue}>
                          {status.name?.trim() || '새 상태'}
                        </span>
                      )}

                      <div className={styles.statusActions}>
                        <IconButton
                          styleType="normal"
                          size="small"
                          disabled={!canEdit}
                          onClick={() => toggleEditEmploymentStatus(status.localId, canEdit)}
                          aria-label={`${status.name || '상태'} ${isEditing ? '편집 종료' : '수정'}`}
                          title={isEditing ? '편집 종료' : '수정'}
                        >
                          <Edit width={16} height={16} />
                        </IconButton>
                        <IconButton
                          styleType="normal"
                          size="small"
                          disabled={status.isHwalseong}
                          onClick={() =>
                            handleRemoveEmploymentStatus(
                              category.nanoId,
                              status.localId,
                              !status.isHwalseong,
                            )
                          }
                          aria-label={`${status.name || '상태'} 삭제`}
                          title="삭제"
                        >
                          <Delete width={16} height={16} />
                        </IconButton>
                      </div>
                    </div>
                  );
                })}

                <Button
                  size="medium"
                  styleType="outlined"
                  variant="secondary"
                  iconRight={<Plus width={16} height={16} />}
                  onClick={() => handleAddEmploymentStatus(category.nanoId)}
                >
                  추가
                </Button>
              </div>
            </div>
          ))}
        </div>
        <footer className={styles.cardFooter}>
          <Button
            size="small"
            styleType="solid"
            variant="primary"
            disabled={
              !employmentState.dirty ||
              employmentHasEmptyStatus ||
              employmentIsSaving ||
              employmentState.categories.length === 0
            }
            onClick={handleSaveEmploymentCategories}
          >
            {employmentIsSaving ? '저장 중...' : '저장'}
          </Button>
        </footer>
      </section>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleGroup}>
            <h2 className={styles.cardTitle}>근무 형태 커스텀 상태</h2>
            <p className={styles.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
          </div>
        </div>
        <div className={styles.cardBody}>
          {workTypeError ? (
            <p className={styles.errorText}>근무 형태 상태를 불러오지 못했습니다.</p>
          ) : null}
          <div className={styles.statusList}>
            <span className={styles.categoryLabel}>재직상태</span>
            {workTypeState.statuses.map((status) => (
              <div key={status.localId} className={styles.statusItem}>
                <LabeledInput
                  placeholder="근무 형태 상태 이름"
                  value={status.name}
                  onValueChange={(value) => handleWorkTypeStatusChange(status.localId, value)}
                  containerClassName={styles.statusInput}
                  maxLength={20}
                  disabled={status.isHwalseong}
                />
                <IconButton
                  styleType="normal"
                  size="small"
                  disabled={status.isHwalseong}
                  onClick={() => handleRemoveWorkTypeStatus(status.localId, !status.isHwalseong)}
                  aria-label={`${status.name || '상태'} 삭제`}
                >
                  <Delete width={16} height={16} />
                </IconButton>
              </div>
            ))}
          </div>
          <Button
            size="medium"
            styleType="outlined"
            variant="secondary"
            iconRight={<Plus width={16} height={16} />}
            onClick={handleAddWorkTypeStatus}
          >
            추가
          </Button>
        </div>
        <footer className={styles.cardFooter}>
          <Button
            size="small"
            styleType="solid"
            variant="primary"
            disabled={
              !workTypeState.dirty ||
              workTypeHasEmptyStatus ||
              workTypeIsSaving ||
              workTypeState.statuses.length === 0
            }
            onClick={handleSaveWorkTypeStatuses}
          >
            {workTypeIsSaving ? '저장 중...' : '저장'}
          </Button>
        </footer>
      </section>
    </div>
  );
}
