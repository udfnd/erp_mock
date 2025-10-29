'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import {
  useEmploymentCategoriesQuery,
  useGigwanQuery,
  useUpdateGigwanMutation,
  useUpsertEmploymentCategoriesMutation,
  useUpsertWorkTypeCustomSangtaesMutation,
  useWorkTypeCustomSangtaesQuery,
} from '@/api/gigwan';
import LabeledInput from '@/app/(erp)/td/g/_components/LabeledInput';
import { Delete, Plus } from '@/components/icons';
import { Button, Chip, IconButton, Textfield } from '@/design';

import * as styles from './page.style.css';

type PageProps = {
  params: {
    gi: string;
  };
};

type FeedbackState = { type: 'success' | 'error'; message: string } | null;

type EmploymentStatusForm = {
  nanoId: string | null;
  name: string;
  localId: string;
};

type EmploymentCategoryForm = {
  nanoId: string;
  name: string;
  statuses: EmploymentStatusForm[];
};

type WorkTypeStatusForm = {
  nanoId: string;
  name: string;
  localId: string;
  isNew?: boolean;
};

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
      return {
        form: { ...state.form, [action.field]: action.value },
        feedback: null,
      };
    case 'reset':
      return { form: action.payload, feedback: null };
    case 'feedback':
      return { ...state, feedback: action.payload };
    default:
      return state;
  }
};

type EmploymentState = {
  categories: EmploymentCategoryForm[];
  dirty: boolean;
  feedback: FeedbackState;
};

type EmploymentAction =
  | { type: 'reset'; payload: EmploymentCategoryForm[] }
  | { type: 'change-status'; categoryId: string; statusLocalId: string; value: string }
  | { type: 'add-status'; categoryId: string; status: EmploymentStatusForm }
  | { type: 'remove-status'; categoryId: string; statusLocalId: string }
  | { type: 'feedback'; payload: FeedbackState };

const employmentReducer = (state: EmploymentState, action: EmploymentAction): EmploymentState => {
  switch (action.type) {
    case 'reset':
      return { categories: action.payload, dirty: false, feedback: null };
    case 'change-status':
      return {
        categories: state.categories.map((category) =>
          category.nanoId === action.categoryId
            ? {
                ...category,
                statuses: category.statuses.map((status) =>
                  status.localId === action.statusLocalId ? { ...status, name: action.value } : status,
                ),
              }
            : category,
        ),
        dirty: true,
        feedback: null,
      };
    case 'add-status':
      return {
        categories: state.categories.map((category) =>
          category.nanoId === action.categoryId
            ? { ...category, statuses: [...category.statuses, action.status] }
            : category,
        ),
        dirty: true,
        feedback: null,
      };
    case 'remove-status':
      return {
        categories: state.categories.map((category) =>
          category.nanoId === action.categoryId
            ? {
                ...category,
                statuses: category.statuses.filter((status) => status.localId !== action.statusLocalId),
              }
            : category,
        ),
        dirty: true,
        feedback: null,
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

export default function GigwanSettingServicePage({ params }: PageProps) {
  const gigwanNanoId = params.gi;
  const queryClient = useQueryClient();

  const {
    data: gigwan,
    isLoading: isGigwanLoading,
    isFetching: isGigwanFetching,
  } = useGigwanQuery(gigwanNanoId, {
    enabled: Boolean(gigwanNanoId),
  });
  const updateGigwanMutation = useUpdateGigwanMutation(gigwanNanoId);

  const [basicState, dispatchBasic] = useReducer(basicReducer, {
    form: { name: '', intro: '' },
    feedback: null,
  });

  useEffect(() => {
    if (!gigwan) return;
    dispatchBasic({ type: 'reset', payload: { name: gigwan.name, intro: gigwan.intro ?? '' } });
  }, [gigwan]);

  const handleBasicChange = useCallback((field: 'name' | 'intro', value: string) => {
    dispatchBasic({ type: 'update', field, value });
  }, []);

  const isBasicDirty = useMemo(() => {
    if (!gigwan)
      return basicState.form.name.trim().length > 0 || basicState.form.intro.trim().length > 0;
    return (
      basicState.form.name !== gigwan.name || (gigwan.intro ?? '') !== basicState.form.intro
    );
  }, [basicState.form, gigwan]);

  const isBasicValid = basicState.form.name.trim().length > 0;

  const handleSaveBasic = useCallback(() => {
    if (!isBasicDirty || !isBasicValid) return;
    updateGigwanMutation.mutate(
      {
        name: basicState.form.name.trim(),
        intro: basicState.form.intro.trim(),
      },
      {
        onSuccess: () => {
          dispatchBasic({
            type: 'feedback',
            payload: { type: 'success', message: '기관 기본 설정이 저장되었습니다.' },
          });
          queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] });
        },
        onError: () => {
          dispatchBasic({
            type: 'feedback',
            payload: { type: 'error', message: '저장에 실패했습니다. 다시 시도해주세요.' },
          });
        },
      },
    );
  }, [
    basicState.form,
    gigwanNanoId,
    isBasicDirty,
    isBasicValid,
    queryClient,
    updateGigwanMutation,
  ]);

  const {
    data: employmentCategoriesData,
    isLoading: isEmploymentLoading,
    isFetching: isEmploymentFetching,
    error: employmentError,
  } = useEmploymentCategoriesQuery(gigwanNanoId, {
    enabled: Boolean(gigwanNanoId),
  });
  const upsertEmploymentCategoriesMutation = useUpsertEmploymentCategoriesMutation(gigwanNanoId);

  const [employmentState, dispatchEmployment] = useReducer(employmentReducer, {
    categories: [],
    dirty: false,
    feedback: null,
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
    const newStatus: EmploymentStatusForm = {
      nanoId: null,
      name: '',
      localId: createLocalId(),
    };
    dispatchEmployment({
      type: 'add-status',
      categoryId: categoryNanoId,
      status: newStatus,
    });
  }, []);

  const handleRemoveEmploymentStatus = useCallback((categoryNanoId: string, statusLocalId: string) => {
    dispatchEmployment({
      type: 'remove-status',
      categoryId: categoryNanoId,
      statusLocalId,
    });
  }, []);

  const employmentHasEmptyStatus = employmentState.categories.some((category) =>
    category.statuses.some((status) => status.name.trim().length === 0),
  );

  const handleSaveEmploymentCategories = useCallback(() => {
    if (!employmentState.dirty || employmentHasEmptyStatus) return;
    upsertEmploymentCategoriesMutation.mutate(
      {
        categories: employmentState.categories.map((category) => ({
          nanoId: category.nanoId,
          name: category.name,
          sangtaes: category.statuses.map((status) => ({
            nanoId: status.nanoId ?? null,
            name: status.name.trim(),
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
              })),
            })),
          });
          dispatchEmployment({
            type: 'feedback',
            payload: {
              type: 'success',
              message: '재직 카테고리 상태가 저장되었습니다.',
            },
          });
          queryClient.invalidateQueries({
            queryKey: ['employmentCategories', gigwanNanoId],
          });
        },
        onError: () => {
          dispatchEmployment({
            type: 'feedback',
            payload: {
              type: 'error',
              message: '재직 카테고리 상태 저장에 실패했습니다. 다시 시도해주세요.',
            },
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
  } = useWorkTypeCustomSangtaesQuery(gigwanNanoId, {
    enabled: Boolean(gigwanNanoId),
  });
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
      status: {
        nanoId: '',
        name: '',
        localId,
        isNew: true,
      },
    });
  }, []);

  const handleRemoveWorkTypeStatus = useCallback((statusLocalId: string) => {
    dispatchWorkType({ type: 'remove', statusLocalId });
  }, []);

  const workTypeHasEmptyStatus = workTypeState.statuses.some(
    (status) => status.name.trim().length === 0,
  );

  const handleSaveWorkTypeStatuses = useCallback(() => {
    if (!workTypeState.dirty || workTypeHasEmptyStatus) return;
    upsertWorkTypeStatusesMutation.mutate(
      {
        statuses: workTypeState.statuses.map((status) => ({
          nanoId: status.nanoId && !status.nanoId.startsWith('local-') ? status.nanoId : status.localId,
          name: status.name.trim(),
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
            })),
          });
          dispatchWorkType({
            type: 'feedback',
            payload: {
              type: 'success',
              message: '근무 형태 커스텀 상태가 저장되었습니다.',
            },
          });
          queryClient.invalidateQueries({
            queryKey: ['workTypeCustomSangtaes', gigwanNanoId],
          });
        },
        onError: () => {
          dispatchWorkType({
            type: 'feedback',
            payload: {
              type: 'error',
              message: '근무 형태 상태 저장에 실패했습니다. 다시 시도해주세요.',
            },
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

  const basicIsSaving = updateGigwanMutation.isPending;
  const employmentIsSaving = upsertEmploymentCategoriesMutation.isPending;
  const workTypeIsSaving = upsertWorkTypeStatusesMutation.isPending;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>기관 설정</h1>
        <p className={styles.pageDescription}>
          기관 기본 정보와 재직 상태, 근무 형태 커스텀 상태를 관리합니다.
        </p>
      </header>
      <div className={styles.cardGrid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <h2 className={styles.cardTitle}>기관 기본 설정</h2>
              <p className={styles.cardSubtitle}>
                기관 이름과 설명을 수정하고 주소 정보를 확인할 수 있습니다.
              </p>
            </div>
            <Chip size="sm" variant="outlined" disabled>
              기관 코드 {gigwanNanoId}
            </Chip>
          </div>
          <div className={styles.cardBody}>
            <LabeledInput
              label="기관 이름"
              placeholder="기관 이름을 입력하세요"
              value={basicState.form.name}
              onValueChange={(value) => handleBasicChange('name', value)}
              required
              maxLength={50}
              helperText="50자 이내로 입력해주세요"
            />
            <Textfield
              label="기관 소개"
              placeholder="기관의 특징이나 안내 문구를 입력하세요"
              value={basicState.form.intro}
              onValueChange={(value) => handleBasicChange('intro', value)}
              rows={4}
              maxLength={300}
              helperText="최대 300자까지 입력할 수 있습니다"
            />
            <LabeledInput
              label="기관 주소"
              placeholder="주소 정보를 불러오는 중입니다"
              value={gigwan?.address ?? ''}
              disabled
              helperText="주소 변경은 별도 메뉴에서 진행됩니다"
            />
          </div>
          <footer className={styles.cardFooter}>
            {basicState.feedback ? (
              <span className={styles.feedback[basicState.feedback.type]}>
                {basicState.feedback.message}
              </span>
            ) : (
              <span className={styles.statusText}>
                {isGigwanLoading || isGigwanFetching ? '기관 정보를 불러오는 중입니다.' : '변경 후 저장을 눌러주세요.'}
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

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <h2 className={styles.cardTitle}>사용자 재직 카테고리 상태</h2>
              <p className={styles.cardSubtitle}>
                조직에서 사용하는 재직 상태 라벨을 카테고리별로 관리합니다.
              </p>
            </div>
          </div>
          <div className={styles.cardBody}>
            {employmentError ? (
              <p className={styles.errorText}>재직 카테고리 정보를 불러오지 못했습니다.</p>
            ) : null}
            {employmentState.categories.map((category) => (
              <div key={category.nanoId} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryLabel}>{category.name}</span>
                  <Button
                    size="small"
                    styleType="text"
                    variant="secondary"
                    iconLeft={<Plus width={16} height={16} />}
                    onClick={() => handleAddEmploymentStatus(category.nanoId)}
                  >
                    상태 추가
                  </Button>
                </div>
                <div className={styles.statusList}>
                  {category.statuses.map((status) => (
                    <div key={status.localId} className={styles.statusItem}>
                      <LabeledInput
                        placeholder="상태 이름"
                        value={status.name}
                        onValueChange={(value) =>
                          handleEmploymentStatusChange(category.nanoId, status.localId, value)
                        }
                        containerClassName={styles.statusInput}
                        maxLength={20}
                      />
                      <IconButton
                        styleType="normal"
                        size="small"
                        onClick={() => handleRemoveEmploymentStatus(category.nanoId, status.localId)}
                        disabled={category.statuses.length <= 1}
                        aria-label={`${status.name || '상태'} 삭제`}
                      >
                        <Delete width={16} height={16} />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <footer className={styles.cardFooter}>
            {employmentState.feedback ? (
              <span className={styles.feedback[employmentState.feedback.type]}>
                {employmentState.feedback.message}
              </span>
            ) : (
              <span className={styles.statusText}>
                {isEmploymentLoading || isEmploymentFetching
                  ? '재직 카테고리를 불러오는 중입니다.'
                  : '카테고리별 상태명을 수정할 수 있습니다.'}
              </span>
            )}
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
              <p className={styles.cardSubtitle}>
                근무 형태에 맞는 사용자 정의 상태를 구성합니다.
              </p>
            </div>
          </div>
          <div className={styles.cardBody}>
            {workTypeError ? (
              <p className={styles.errorText}>근무 형태 상태를 불러오지 못했습니다.</p>
            ) : null}
            <div className={styles.statusList}>
              {workTypeState.statuses.map((status) => (
                <div key={status.localId} className={styles.statusItem}>
                  <LabeledInput
                    placeholder="근무 형태 상태 이름"
                    value={status.name}
                    onValueChange={(value) => handleWorkTypeStatusChange(status.localId, value)}
                    containerClassName={styles.statusInput}
                    maxLength={20}
                  />
                  <IconButton
                    styleType="normal"
                    size="small"
                    onClick={() => handleRemoveWorkTypeStatus(status.localId)}
                    disabled={workTypeState.statuses.length <= 1}
                    aria-label={`${status.name || '상태'} 삭제`}
                  >
                    <Delete width={16} height={16} />
                  </IconButton>
                </div>
              ))}
            </div>
            <div className={styles.addButtonWrapper}>
              <Button
                size="small"
                styleType="text"
                variant="secondary"
                iconLeft={<Plus width={16} height={16} />}
                onClick={handleAddWorkTypeStatus}
              >
                상태 추가
              </Button>
            </div>
          </div>
          <footer className={styles.cardFooter}>
            {workTypeState.feedback ? (
              <span className={styles.feedback[workTypeState.feedback.type]}>
                {workTypeState.feedback.message}
              </span>
            ) : (
              <span className={styles.statusText}>
                {isWorkTypeLoading || isWorkTypeFetching
                  ? '근무 형태 상태를 불러오는 중입니다.'
                  : '근무 형태 상태명을 자유롭게 구성할 수 있습니다.'}
              </span>
            )}
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
    </div>
  );
}
