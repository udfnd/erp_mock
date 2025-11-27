'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useEffect, useMemo } from 'react';

import { Button, IconButton, Toggle } from '@/common/components';
import { DeleteIcon, PlusIcon } from '@/common/icons';
import {
  gigwanQueryKeys,
  useEmploymentCategoriesQuery,
  useUpsertEmploymentCategoriesMutation,
} from '@/domain/gigwan/api';
import type { EmploymentCategory } from '@/domain/gigwan/api/gigwan.schema';

import { css } from './styles';
import { createLocalId } from '../local-id';
import { useFeedback } from '../useFeedback';

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

const INITIAL_VALUES: EmploymentCategoriesFormValues = { categories: [] };

export function EmploymentCategoriesSection({ gigwanNanoId }: EmploymentCategoriesSectionProps) {
  const queryClient = useQueryClient();
  const { data: employmentCategoriesData, error: employmentError } = useEmploymentCategoriesQuery(
    gigwanNanoId,
    { enabled: Boolean(gigwanNanoId) },
  );
  const upsertEmploymentCategoriesMutation = useUpsertEmploymentCategoriesMutation(gigwanNanoId);

  const { feedback, showError, showSuccess, clearFeedback } = useFeedback();

  const form = useForm({
    defaultValues: INITIAL_VALUES,
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
        showSuccess('재직 카테고리 상태가 저장되었습니다.');
        await queryClient.invalidateQueries({
          queryKey: gigwanQueryKeys.employmentCategories(gigwanNanoId),
        });
      } catch {
        showError('재직 카테고리 상태 저장에 실패했습니다.');
      }
    },
  });

  const { categories, isDirty } = useStore(form.store, (state) => {
    const v = state.values as EmploymentCategoriesFormValues;
    return {
      categories: v.categories ?? [],
      isDirty: state.isDirty,
    };
  });

  const categoriesFromApi = useMemo(
    () => employmentCategoriesData?.categories ?? [],
    [employmentCategoriesData?.categories],
  );

  useEffect(() => {
    if (!employmentCategoriesData || categoriesFromApi.length === 0 || isDirty) return;
    const nextValues = mapCategoriesToFormValues(categoriesFromApi);
    form.reset(nextValues);
  }, [categoriesFromApi, employmentCategoriesData, form, isDirty]);

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
    clearFeedback();
    await form.handleSubmit();
  }, [clearFeedback, employmentHasEmptyStatus, form, isDirty]);

  return (
    <section css={css.card}>
      <div css={css.cardHeader}>
        <div css={css.cardTitleGroup}>
          <h2 css={css.cardTitle}>사용자 재직 카테고리 상태</h2>
          <p css={css.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
        </div>
      </div>

      <div css={css.cardBody}>
        {employmentError ? (
          <p css={css.errorText}>재직 카테고리 정보를 불러오지 못했습니다.</p>
        ) : null}

        <form.Field name="categories" mode="array">
          {(categoriesField) => (
            <>
              {categoriesField.state.value.length === 0 && categoriesFromApi.length === 0 ? (
                <p css={css.emptyText}>불러온 재직 카테고리가 없습니다.</p>
              ) : (
                categoriesField.state.value.map((category, categoryIndex) => (
                  <div key={category.nanoId} css={css.categorySection}>
                    <span css={css.categoryLabel}>{category.name}</span>

                    <form.Field name={`categories[${categoryIndex}].statuses`} mode="array">
                      {(statusesField) => (
                        <div css={css.statusList}>
                          {statusesField.state.value.map((status, statusIndex) => {
                            const localId = status.localId ?? `${category.nanoId}-${statusIndex}`;

                            return (
                              <div key={localId} css={css.statusField} role="group">
                                <form.Field
                                  name={`categories[${categoryIndex}].statuses[${statusIndex}].name`}
                                >
                                  {(field) => {
                                    const value = String(field.state.value ?? '');
                                    return (
                                      <input
                                        css={css.statusInputField}
                                        value={value}
                                        onChange={(event) => {
                                          clearFeedback();
                                          field.handleChange(event.target.value);
                                        }}
                                        onBlur={field.handleBlur}
                                        placeholder="상태 이름"
                                        maxLength={20}
                                      />
                                    );
                                  }}
                                </form.Field>

                                <form.Field
                                  name={`categories[${categoryIndex}].statuses[${statusIndex}].isHwalseong`}
                                  validators={{}}
                                >
                                  {(field) => {
                                    const isActive = Boolean(field.state.value);
                                    return (
                                      <div css={css.statusToggleGroup}>
                                        <Toggle
                                          size="sm"
                                          active={isActive}
                                          onChange={(checked) => {
                                            clearFeedback();
                                            field.handleChange(checked);
                                          }}
                                          aria-label={`${status.name || '상태'} ${
                                            isActive ? '비활성' : '활성'
                                          } 토글`}
                                        />
                                        <span css={css.statusToggleLabel}>
                                          {isActive ? '활성' : '비활성'}
                                        </span>
                                      </div>
                                    );
                                  }}
                                </form.Field>

                                <div css={css.statusActions}>
                                  <IconButton
                                    styleType="normal"
                                    size="small"
                                    onClick={() => {
                                      void statusesField.removeValue(statusIndex);
                                      clearFeedback();
                                    }}
                                    aria-label={`${status.name || '상태'} 삭제`}
                                    title="삭제"
                                  >
                                    <DeleteIcon width={16} height={16} />
                                  </IconButton>
                                </div>
                              </div>
                            );
                          })}

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
                              clearFeedback();
                            }}
                          >
                            추가
                          </Button>
                        </div>
                      )}
                    </form.Field>
                  </div>
                ))
              )}
            </>
          )}
        </form.Field>
      </div>

      <footer css={css.cardFooter}>
        {feedback ? <span css={css.feedback[feedback.type]}>{feedback.message}</span> : null}
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
    </section>
  );
}
