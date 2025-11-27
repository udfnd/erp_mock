'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useMemo, useReducer } from 'react';

import { Button, IconButton } from '@/common/components';
import { DeleteIcon, EditIcon, PlusIcon } from '@/common/icons';
import {
  gigwanQueryKeys,
  useEmploymentCategoriesQuery,
  useUpsertEmploymentCategoriesMutation,
} from '@/domain/gigwan/api';
import type { EmploymentCategory } from '@/domain/gigwan/api/gigwan.schema';

import { cssObj } from './styles';
import { createLocalId } from '../local-id';

type EmploymentCategoriesSectionProps = {
  gigwanNanoId: string;
};

type EmploymentStatusFormValue = {
  nanoId: string | null;
  name: string;
  isHwalseong: boolean;
  localId: string;
};

type EmploymentCategoryFormValue = {
  nanoId: string;
  name: string;
  statuses: EmploymentStatusFormValue[];
};

type EmploymentCategoriesFormValues = {
  categories: EmploymentCategoryFormValue[];
};

const mapCategoriesToFormValues = (
  categories: EmploymentCategory[],
): EmploymentCategoriesFormValues => ({
  categories: categories.map((category) => ({
    nanoId: category.nanoId,
    name: category.name,
    statuses: category.sangtaes.map((status) => ({
      nanoId: status.nanoId,
      name: status.name,
      isHwalseong: status.isHwalseong,
      localId: status.nanoId ?? createLocalId(),
    })),
  })),
});

type EmploymentEditingState = Record<string, boolean>;

type EmploymentEditingAction =
  | { type: 'toggle'; localId: string }
  | { type: 'remove'; localId: string }
  | { type: 'reset' };

const employmentEditingReducer = (
  state: EmploymentEditingState,
  action: EmploymentEditingAction,
): EmploymentEditingState => {
  switch (action.type) {
    case 'toggle':
      return { ...state, [action.localId]: !state[action.localId] };
    case 'remove': {
      if (!state[action.localId]) return state;
      const nextState = { ...state };
      delete nextState[action.localId];
      return nextState;
    }
    case 'reset':
      return {};
    default:
      return state;
  }
};

const INITIAL_VALUES: EmploymentCategoriesFormValues = { categories: [] };

type EmploymentCategoriesFormProps = {
  gigwanNanoId: string;
  initialValues: EmploymentCategoriesFormValues;
  employmentError: unknown;
};

function EmploymentCategoriesForm({
  gigwanNanoId,
  initialValues,
  employmentError,
}: EmploymentCategoriesFormProps) {
  const queryClient = useQueryClient();
  const upsertEmploymentCategoriesMutation = useUpsertEmploymentCategoriesMutation(gigwanNanoId);
  const [employmentEditing, dispatchEmploymentEditing] = useReducer(employmentEditingReducer, {});

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const categoriesPayload = value.categories.map((category) => {
        const seen = new Set<string>();
        const sangtaes: Array<
          | { name: string; isHwalseong: boolean }
          | { nanoId: string; name: string; isHwalseong: boolean }
        > = [];

        for (const status of category.statuses) {
          const name = status.name.trim();
          if (!name) continue;

          if (status.nanoId && !status.nanoId.startsWith('local-')) {
            if (seen.has(status.nanoId)) continue;
            seen.add(status.nanoId);
            sangtaes.push({ nanoId: status.nanoId, name, isHwalseong: status.isHwalseong });
          } else {
            sangtaes.push({ name, isHwalseong: status.isHwalseong });
          }
        }

        return { nanoId: category.nanoId, sangtaes };
      });

      try {
        const data = await upsertEmploymentCategoriesMutation.mutateAsync({
          categories: categoriesPayload,
        });

        const nextValues = mapCategoriesToFormValues(data.categories);
        form.reset(nextValues);
        dispatchEmploymentEditing({ type: 'reset' });

        await queryClient.invalidateQueries({
          queryKey: gigwanQueryKeys.employmentCategories(gigwanNanoId),
        });
      } catch {}
    },
  });

  const { categories, isDirty } = useStore(form.store, (state) => {
    const v = state.values as EmploymentCategoriesFormValues;
    return {
      categories: v.categories ?? [],
      isDirty: state.isDirty,
    };
  });

  const employmentHasEmptyStatus = useMemo(
    () =>
      categories.some((category) =>
        category.statuses.some((status) => status.name.trim().length === 0),
      ),
    [categories],
  );

  const employmentIsSaving = upsertEmploymentCategoriesMutation.isPending;

  const handleSaveEmploymentCategories = useCallback(async () => {
    if (!isDirty || employmentHasEmptyStatus) return;
    await form.handleSubmit();
  }, [employmentHasEmptyStatus, form, isDirty]);

  const toggleEditEmploymentStatus = (localId: string) => {
    dispatchEmploymentEditing({ type: 'toggle', localId });
  };

  return (
    <>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>사용자 재직 카테고리 상태</h2>
          <p css={cssObj.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
        </div>
      </div>

      <div css={cssObj.cardBody}>
        {employmentError ? <p>재직 카테고리 정보를 불러오지 못했습니다.</p> : null}

        <form.Field name="categories" mode="array">
          {(categoriesField) => (
            <>
              {categoriesField.state.value.map((category, categoryIndex) => (
                <div key={category.nanoId} css={cssObj.categorySection}>
                  <span css={cssObj.categoryLabel}>{category.name}</span>

                  <form.Field name={`categories[${categoryIndex}].statuses`} mode="array">
                    {(statusesField) => (
                      <div css={cssObj.statusList}>
                        {statusesField.state.value.map((status, statusIndex) => (
                          <form.Field
                            key={status.localId}
                            name={`categories[${categoryIndex}].statuses[${statusIndex}].name`}
                          >
                            {(field) => {
                              const currentStatus = statusesField.state.value[statusIndex];
                              const localId =
                                currentStatus?.localId ?? `${category.nanoId}-${statusIndex}`;
                              const isEditing = Boolean(employmentEditing[localId]);
                              const value = String(field.state.value ?? '');
                              return (
                                <div css={cssObj.statusField} role="group">
                                  {isEditing ? (
                                    <input
                                      css={cssObj.statusInputField}
                                      value={value}
                                      onChange={(event) => {
                                        field.handleChange(event.target.value);
                                      }}
                                      onBlur={field.handleBlur}
                                      placeholder="상태 이름"
                                      maxLength={20}
                                      autoFocus
                                    />
                                  ) : (
                                    <span css={cssObj.statusValue}>
                                      {value.trim() || '새 상태'}
                                    </span>
                                  )}
                                  <div css={cssObj.statusActions}>
                                    <IconButton
                                      styleType="normal"
                                      size="small"
                                      onClick={() => toggleEditEmploymentStatus(localId)}
                                      aria-label={`${value || '상태'} ${isEditing ? '편집 종료' : '수정'}`}
                                      title={isEditing ? '편집 종료' : '수정'}
                                    >
                                      <EditIcon width={16} height={16} />
                                    </IconButton>
                                    <IconButton
                                      styleType="normal"
                                      size="small"
                                      onClick={() => {
                                        void statusesField.removeValue(statusIndex);
                                        dispatchEmploymentEditing({
                                          type: 'remove',
                                          localId,
                                        });
                                      }}
                                      aria-label={`${value || '상태'} 삭제`}
                                      title="삭제"
                                    >
                                      <DeleteIcon width={16} height={16} />
                                    </IconButton>
                                  </div>
                                </div>
                              );
                            }}
                          </form.Field>
                        ))}

                        <Button
                          size="medium"
                          styleType="outlined"
                          variant="secondary"
                          iconRight={<PlusIcon width={16} height={16} />}
                          onClick={() => {
                            const localId = createLocalId();
                            statusesField.pushValue({
                              nanoId: null,
                              name: '',
                              isHwalseong: true,
                              localId,
                            });
                            dispatchEmploymentEditing({ type: 'toggle', localId });
                          }}
                        >
                          추가
                        </Button>
                      </div>
                    )}
                  </form.Field>
                </div>
              ))}
            </>
          )}
        </form.Field>
      </div>

      <footer css={cssObj.cardFooter}>
        <Button
          size="small"
          styleType="solid"
          variant="primary"
          disabled={
            !isDirty || employmentHasEmptyStatus || employmentIsSaving || categories.length === 0
          }
          onClick={handleSaveEmploymentCategories}
        >
          {employmentIsSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </>
  );
}

export function EmploymentCategoriesSection({ gigwanNanoId }: EmploymentCategoriesSectionProps) {
  const { data: employmentCategoriesData, error: employmentError } = useEmploymentCategoriesQuery(
    gigwanNanoId,
    {
      enabled: Boolean(gigwanNanoId),
    },
  );

  const initialValues: EmploymentCategoriesFormValues = employmentCategoriesData
    ? mapCategoriesToFormValues(employmentCategoriesData.categories)
    : INITIAL_VALUES;

  const formKey = `${gigwanNanoId}:${
    employmentCategoriesData?.categories
      ?.map((c) => `${c.nanoId}:${c.sangtaes.length}`)
      .join('|') ?? 'empty'
  }`;

  return (
    <section css={cssObj.card}>
      <EmploymentCategoriesForm
        key={formKey}
        gigwanNanoId={gigwanNanoId}
        initialValues={initialValues}
        employmentError={employmentError}
      />
    </section>
  );
}
