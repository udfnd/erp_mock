'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';

import { Button, IconButton } from '@/common/components';
import { Delete, Edit, Plus } from '@/common/icons';
import {
  useEmploymentCategoriesQuery,
  useUpsertEmploymentCategoriesMutation,
} from '@/domain/gigwan/api';

import { cssObj } from '../style';
import { createLocalId } from './local-id';
import { FeedbackState } from './types';

type EmploymentCategoriesSectionProps = {
  gigwanNanoId: string;
};

type EmploymentStatusForm = {
  nanoId: string | null;
  name: string;
  isHwalseong: boolean;
};

type EmploymentCategoryForm = {
  nanoId: string;
  name: string;
  statuses: EmploymentStatusForm[];
};

export function EmploymentCategoriesSection({ gigwanNanoId }: EmploymentCategoriesSectionProps) {
  const queryClient = useQueryClient();

  const { data: employmentCategoriesData, error: employmentError } = useEmploymentCategoriesQuery(
    gigwanNanoId,
    { enabled: Boolean(gigwanNanoId) },
  );
  const upsertEmploymentCategoriesMutation = useUpsertEmploymentCategoriesMutation(gigwanNanoId);

  const form = useForm({
    defaultValues: { categories: [] as EmploymentCategoryForm[] },
  });

  const { values, isDirty } = useStore(form.store, (state) => ({
    values: state.values,
    isDirty: state.isDirty,
  }));

  console.log(form.state.values);

  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [employmentEditing, setEmploymentEditing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!employmentCategoriesData) return;

    form.reset({
      categories: employmentCategoriesData.categories.map((category) => ({
        nanoId: category.nanoId,
        name: category.name,
        statuses: category.sangtaes.map((status) => ({
          nanoId: status.nanoId,
          name: status.name,
          isHwalseong: status.isHwalseong,
        })),
      })),
    });
  }, [employmentCategoriesData, form]);

  const toggleEditEmploymentStatus = useCallback((statusLocalId: number) => {
    setEmploymentEditing((prev) => ({ ...prev, [statusLocalId]: !prev[statusLocalId] }));
    setFeedback(null);
  }, []);

  const employmentHasEmptyStatus = useMemo(
    () =>
      (values.categories ?? []).some((category) =>
        category.statuses.some((status) => status.name.trim().length === 0),
      ),
    [values.categories],
  );

  const handleSaveEmploymentCategories = useCallback(async () => {
    if (!isDirty || employmentHasEmptyStatus) return;

    const categoriesPayload = (values.categories ?? []).map((category) => {
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

      form.reset({
        categories: data.categories.map((category) => ({
          nanoId: category.nanoId,
          name: category.name,
          statuses: category.sangtaes.map((status) => ({
            nanoId: status.nanoId,
            name: status.name,
            localId: status.nanoId,
            isHwalseong: status.isHwalseong,
          })),
        })),
      });

      setEmploymentEditing({});
      setFeedback({ type: 'success', message: '재직 카테고리 상태가 저장되었습니다.' });
      await queryClient.invalidateQueries({ queryKey: ['employmentCategories', gigwanNanoId] });
    } catch {
      setFeedback({ type: 'error', message: '재직 카테고리 상태 저장에 실패했습니다.' });
    }
  }, [
    values.categories,
    isDirty,
    employmentHasEmptyStatus,
    upsertEmploymentCategoriesMutation,
    form,
    queryClient,
    gigwanNanoId,
  ]);

  const employmentIsSaving = upsertEmploymentCategoriesMutation.isPending;

  return (
    <section css={cssObj.card}>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>사용자 재직 카테고리 상태</h2>
          <p css={cssObj.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
        </div>
      </div>

      <div css={cssObj.cardBody}>
        {employmentError ? (
          <p css={cssObj.errorText}>재직 카테고리 정보를 불러오지 못했습니다.</p>
        ) : null}

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
                            key={statusIndex}
                            name={`categories[${categoryIndex}].statuses[${statusIndex}].name`}
                          >
                            {(field) => {
                              const isEditing = Boolean(employmentEditing[statusIndex]);
                              const value = String(field.state.value ?? '');
                              return (
                                <div css={cssObj.statusField} role="group">
                                  {isEditing ? (
                                    <input
                                      css={cssObj.statusInputField}
                                      value={value}
                                      onChange={(e) => {
                                        setFeedback(null);
                                        field.handleChange(e.target.value);
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
                                      onClick={() => toggleEditEmploymentStatus(statusIndex)}
                                      aria-label={`${value || '상태'} ${
                                        isEditing ? '편집 종료' : '수정'
                                      }`}
                                      title={isEditing ? '편집 종료' : '수정'}
                                    >
                                      <Edit width={16} height={16} />
                                    </IconButton>
                                    <IconButton
                                      styleType="normal"
                                      size="small"
                                      onClick={() => {
                                        void statusesField.removeValue(statusIndex);
                                        setEmploymentEditing((prev) => {
                                          const next = { ...prev };
                                          delete next[statusIndex];
                                          return next;
                                        });
                                        setFeedback(null);
                                      }}
                                      aria-label={`${value || '상태'} 삭제`}
                                      title="삭제"
                                    >
                                      <Delete width={16} height={16} />
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
                          iconRight={<Plus width={16} height={16} />}
                          onClick={() => {
                            const local = createLocalId();
                            statusesField.pushValue({
                              nanoId: null,
                              name: '',
                              isHwalseong: true,
                            });
                            setEmploymentEditing((prev) => ({ ...prev, [local]: true }));
                            setFeedback(null);
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
        {feedback ? <span css={cssObj.feedback[feedback.type]}>{feedback.message}</span> : null}
        <Button
          size="small"
          styleType="solid"
          variant="primary"
          disabled={
            !isDirty ||
            employmentHasEmptyStatus ||
            employmentIsSaving ||
            (values.categories ?? []).length === 0
          }
          onClick={handleSaveEmploymentCategories}
        >
          {employmentIsSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </section>
  );
}
