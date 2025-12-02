'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { Button, IconButton } from '@/common/components';
import { DeleteIcon, EditIcon, PlusIcon } from '@/common/icons';
import {
  type JaewonCategorySangtaeCategory,
  useGetJaewonCategorySangtaesQuery,
  useUpsertJaewonCategorySangtaesMutation,
} from '@/domain/jaewonsaeng/api';
import { createLocalId } from '@/domain/gigwan/section/local-id';
import { cssObj } from './JaewonCategorySangtaeSection.style';

type JaewonCategorySangtaeSectionProps = {
  jojikNanoId: string;
};

type JaewonCategorySangtaeFormValue = {
  nanoId: string | null;
  name: string;
  isHwalseong: boolean;
  isGibon?: boolean;
  localId: string;
};

type JaewonCategoryFormValue = {
  nanoId: string;
  name: string;
  sangtaes: JaewonCategorySangtaeFormValue[];
};

type JaewonCategoryFormValues = {
  categories: JaewonCategoryFormValue[];
};

const mapCategoriesToFormValues = (
  categories: JaewonCategorySangtaeCategory[] = [],
): JaewonCategoryFormValues => ({
  categories: categories.map((category) => ({
    nanoId: category.nanoId,
    name: category.name,
    sangtaes: category.sangtaes.map((sangtae) => ({
      nanoId: sangtae.nanoId,
      name: sangtae.name,
      isHwalseong: sangtae.isHwalseong,
      isGibon: sangtae.isGibon,
      localId: sangtae.nanoId ?? createLocalId(),
    })),
  })),
});

const INITIAL_VALUES: JaewonCategoryFormValues = { categories: [] };

type EditingState = Record<string, boolean>;

type EditingAction =
  | { type: 'toggle'; localId: string }
  | { type: 'remove'; localId: string }
  | { type: 'reset' };

const editingReducer = (state: EditingState, action: EditingAction): EditingState => {
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

export function JaewonCategorySangtaeSection({ jojikNanoId }: JaewonCategorySangtaeSectionProps) {
  const queryClient = useQueryClient();
  const { data, error } = useGetJaewonCategorySangtaesQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
  });
  const upsertMutation = useUpsertJaewonCategorySangtaesMutation(jojikNanoId);

  const initialValues = useMemo(
    () => (data ? mapCategoriesToFormValues(data.categories) : INITIAL_VALUES),
    [data],
  );

  const [editingMap, dispatchEditing] = useReducer(editingReducer, {});

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const categoriesPayload = (value.categories ?? []).map((category) => {
        const seen = new Set<string>();
        const sangtaes: Array<
          | { name: string; isHwalseong: boolean; isGibon?: boolean }
          | { nanoId: string; name: string; isHwalseong: boolean; isGibon?: boolean }
        > = [];

        for (const sangtae of category.sangtaes) {
          const name = sangtae.name.trim();
          if (!name) continue;

          if (sangtae.nanoId && !sangtae.nanoId.startsWith('local-')) {
            if (seen.has(sangtae.nanoId)) continue;
            seen.add(sangtae.nanoId);
            sangtaes.push({
              nanoId: sangtae.nanoId,
              name,
              isHwalseong: sangtae.isHwalseong,
              isGibon: sangtae.isGibon,
            });
          } else {
            sangtaes.push({ name, isHwalseong: sangtae.isHwalseong, isGibon: sangtae.isGibon });
          }
        }

        return { nanoId: category.nanoId, sangtaes };
      });

      try {
        const updated = await upsertMutation.mutateAsync({
          categories: categoriesPayload,
        });

        const nextValues = mapCategoriesToFormValues(updated.categories);
        form.reset(nextValues);
        dispatchEditing({ type: 'reset' });

        await queryClient.invalidateQueries({
          queryKey: ['jaewonCategorySangtaes', jojikNanoId],
        });
      } catch {}
    },
  });

  useEffect(() => {
    form.reset(initialValues);
    dispatchEditing({ type: 'reset' });
  }, [form, initialValues]);

  const { categories, isDirty } = useStore(form.store, (state) => {
    const values = state.values as JaewonCategoryFormValues;
    return {
      categories: values.categories ?? [],
      isDirty: state.isDirty,
    };
  });

  const hasEmptySangtae = useMemo(
    () =>
      categories.some((category) =>
        category.sangtaes.some((sangtae) => sangtae.name.trim().length === 0),
      ),
    [categories],
  );

  const handleSave = useCallback(async () => {
    if (!isDirty || hasEmptySangtae) return;
    await form.handleSubmit();
  }, [form, hasEmptySangtae, isDirty]);

  const toggleEdit = (localId: string) => {
    dispatchEditing({ type: 'toggle', localId });
  };

  const isSaving = upsertMutation.isPending;

  return (
    <section css={cssObj.card}>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>재원 상태 카테고리상태 설정</h2>
          <p css={cssObj.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
        </div>
      </div>

      <div css={cssObj.cardBody}>
        {error ? <p>재원 카테고리 상태 정보를 불러오지 못했습니다.</p> : null}

        <form.Field name="categories" mode="array">
          {(categoriesField) => (
            <>
              {categoriesField.state.value.map((category, categoryIndex) => (
                <div key={category.nanoId} css={cssObj.categorySection}>
                  <span css={cssObj.categoryLabel}>{category.name}</span>
                  <form.Field name={`categories[${categoryIndex}].sangtaes`} mode="array">
                    {(sangtaesField) => (
                      <div css={cssObj.statusList}>
                        {sangtaesField.state.value.map((sangtae, sangtaeIndex) => (
                          <form.Field
                            key={sangtae.localId}
                            name={`categories[${categoryIndex}].sangtaes[${sangtaeIndex}].name`}
                          >
                            {(field) => {
                              const currentSangtae = sangtaesField.state.value[sangtaeIndex];
                              const localId =
                                currentSangtae?.localId ?? `${category.nanoId}-${sangtaeIndex}`;
                              const isEditing = Boolean(editingMap[localId]);
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
                                      onClick={() => toggleEdit(localId)}
                                      aria-label={`${value || '상태'} ${isEditing ? '편집 종료' : '수정'}`}
                                      title={isEditing ? '편집 종료' : '수정'}
                                    >
                                      <EditIcon width={16} height={16} />
                                    </IconButton>
                                    <IconButton
                                      styleType="normal"
                                      size="small"
                                      onClick={() => {
                                        void sangtaesField.removeValue(sangtaeIndex);
                                        dispatchEditing({ type: 'remove', localId });
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
                          size="small"
                          styleType="outlined"
                          variant="secondary"
                          iconRight={<PlusIcon width={16} height={16} />}
                          onClick={() => {
                            const localId = createLocalId();
                            sangtaesField.pushValue({
                              nanoId: null,
                              name: '',
                              isHwalseong: true,
                              isGibon: false,
                              localId,
                            });
                            dispatchEditing({ type: 'toggle', localId });
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
          disabled={!isDirty || hasEmptySangtae || isSaving || categories.length === 0}
          onClick={handleSave}
        >
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </section>
  );
}
