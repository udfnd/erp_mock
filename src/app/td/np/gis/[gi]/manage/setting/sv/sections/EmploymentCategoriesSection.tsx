'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';

import { Button, IconButton } from '@/common/components';
import { Delete, Edit, Plus } from '@/common/icons';
import {
  useEmploymentCategoriesQuery,
  useUpsertEmploymentCategoriesMutation,
} from '@/domain/gigwan/api';

import * as styles from '../style';
import { createLocalId } from './local-id';
import { FeedbackState } from './types';

type EmploymentCategoriesSectionProps = {
  gigwanNanoId: string;
};

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

type EmploymentFormValues = {
  categories: EmploymentCategoryForm[];
};

export function EmploymentCategoriesSection({ gigwanNanoId }: EmploymentCategoriesSectionProps) {
  const queryClient = useQueryClient();

  const {
    data: employmentCategoriesData,
    error: employmentError,
  } = useEmploymentCategoriesQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });
  const upsertEmploymentCategoriesMutation = useUpsertEmploymentCategoriesMutation(gigwanNanoId);

  const [employmentEditing, setEmploymentEditing] = useState<Record<string, boolean>>({});
  const [employmentFeedback, setEmploymentFeedback] = useState<FeedbackState>(null);

  const employmentForm = useForm<EmploymentFormValues>({
    defaultValues: { categories: [] },
    onSubmit: async ({ value, formApi }) => {
      if (value.categories.length === 0) return;

      setEmploymentFeedback(null);

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
            sangtaes.push({
              nanoId: status.nanoId,
              name,
              isHwalseong: status.isHwalseong,
            });
          } else {
            sangtaes.push({
              name,
              isHwalseong: status.isHwalseong,
            });
          }
        }

        return { nanoId: category.nanoId, sangtaes };
      });

      try {
        const data = await upsertEmploymentCategoriesMutation.mutateAsync({
          categories: categoriesPayload,
        });
        formApi.reset({
          categories: data.categories.map((category) => ({
            nanoId: category.nanoId,
            name: category.name,
            statuses: category.sangtaes.map((status) => ({
              nanoId: status.nanoId ?? null,
              name: status.name,
              localId: status.nanoId ?? createLocalId(),
              isHwalseong: status.isHwalseong,
            })),
          })),
        });
        setEmploymentEditing({});
        setEmploymentFeedback({
          type: 'success',
          message: '재직 카테고리 상태가 저장되었습니다.',
        });
        await queryClient.invalidateQueries({ queryKey: ['employmentCategories', gigwanNanoId] });
      } catch {
        setEmploymentFeedback({
          type: 'error',
          message: '재직 카테고리 상태 저장에 실패했습니다.',
        });
      }
    },
  });

  useEffect(() => {
    if (!employmentCategoriesData) return;

    employmentForm.reset({
      categories: employmentCategoriesData.categories.map((category) => ({
        nanoId: category.nanoId,
        name: category.name,
        statuses: category.sangtaes.map((status) => ({
          nanoId: status.nanoId ?? null,
          name: status.name,
          localId: status.nanoId ?? createLocalId(),
          isHwalseong: status.isHwalseong,
        })),
      })),
    });
    setEmploymentEditing({});
    setEmploymentFeedback(null);
  }, [employmentCategoriesData, employmentForm]);

  const employmentValues = employmentForm.state.values;
  const employmentHasEmptyStatus = employmentValues.categories.some((category) =>
    category.statuses.some((status) => status.name.trim().length === 0),
  );
  const employmentIsSaving =
    employmentForm.state.isSubmitting || upsertEmploymentCategoriesMutation.isPending;

  const handleAddEmploymentStatus = (categoryIndex: number) => {
    const localId = createLocalId();
    const newStatus: EmploymentStatusForm = {
      nanoId: null,
      name: '',
      localId,
      isHwalseong: true,
    };

    employmentForm.setFieldValue('categories', (prev) =>
      prev.map((category, index) =>
        index === categoryIndex
          ? { ...category, statuses: [...category.statuses, newStatus] }
          : category,
      ),
    );
    setEmploymentEditing((prev) => ({ ...prev, [localId]: true }));
    setEmploymentFeedback(null);
  };

  const handleRemoveEmploymentStatus = (categoryIndex: number, statusLocalId: string) => {
    employmentForm.setFieldValue('categories', (prev) =>
      prev.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              statuses: category.statuses.filter((status) => status.localId !== statusLocalId),
            }
          : category,
      ),
    );
    setEmploymentEditing((prev) => {
      const next = { ...prev };
      delete next[statusLocalId];
      return next;
    });
    setEmploymentFeedback(null);
  };

  const toggleEditEmploymentStatus = (statusLocalId: string) => {
    setEmploymentEditing((prev) => ({ ...prev, [statusLocalId]: !prev[statusLocalId] }));
  };

  return (
    <section css={styles.card}>
      <div css={styles.cardHeader}>
        <div css={styles.cardTitleGroup}>
          <h2 css={styles.cardTitle}>사용자 재직 카테고리 상태</h2>
          <p css={styles.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
        </div>
      </div>

      <div css={styles.cardBody}>
        {employmentError ? (
          <p css={styles.errorText}>재직 카테고리 정보를 불러오지 못했습니다.</p>
        ) : null}
        {employmentValues.categories.map((category, categoryIndex) => (
          <div key={category.nanoId} css={styles.categorySection}>
            <span css={styles.categoryLabel}>{category.name}</span>

            <div css={styles.statusList}>
              {category.statuses.map((status, statusIndex) => (
                <employmentForm.Field
                  key={status.localId}
                  name={`categories.${categoryIndex}.statuses.${statusIndex}` as const}
                  validators={{
                    onChange: ({ value }) =>
                      value.name.trim().length === 0 ? '상태 이름을 입력해주세요.' : undefined,
                  }}
                >
                  {(field) => {
                    const current = field.state.value as EmploymentStatusForm;
                    const isEditing = Boolean(employmentEditing[current.localId]);

                    return (
                      <div key={current.localId} css={styles.statusField} role="group">
                        {isEditing ? (
                          <input
                            css={styles.statusInputField}
                            value={current.name}
                            onChange={(event) => {
                              setEmploymentFeedback(null);
                              field.handleChange({ ...current, name: event.target.value });
                            }}
                            onBlur={() => field.handleBlur()}
                            placeholder="상태 이름"
                            maxLength={20}
                            autoFocus
                          />
                        ) : (
                          <span css={styles.statusValue}>{current.name?.trim() || '새 상태'}</span>
                        )}

                        <div css={styles.statusActions}>
                          <IconButton
                            styleType="normal"
                            size="small"
                            onClick={() => {
                              setEmploymentFeedback(null);
                              toggleEditEmploymentStatus(current.localId);
                            }}
                            aria-label={`${current.name || '상태'} ${
                              isEditing ? '편집 종료' : '수정'
                            }`}
                            title={isEditing ? '편집 종료' : '수정'}
                          >
                            <Edit width={16} height={16} />
                          </IconButton>
                          <IconButton
                            styleType="normal"
                            size="small"
                            onClick={() =>
                              handleRemoveEmploymentStatus(categoryIndex, current.localId)
                            }
                            aria-label={`${current.name || '상태'} 삭제`}
                            title="삭제"
                          >
                            <Delete width={16} height={16} />
                          </IconButton>
                        </div>
                      </div>
                    );
                  }}
                </employmentForm.Field>
              ))}
              <Button
                size="medium"
                styleType="outlined"
                variant="secondary"
                iconRight={<Plus width={16} height={16} />}
                onClick={() => handleAddEmploymentStatus(categoryIndex)}
              >
                추가
              </Button>
            </div>
          </div>
        ))}
      </div>
      <footer css={styles.cardFooter}>
        {employmentFeedback ? (
          <span css={styles.feedback[employmentFeedback.type]}>
            {employmentFeedback.message}
          </span>
        ) : null}
        <Button
          size="small"
          styleType="solid"
          variant="primary"
          disabled={
            !employmentForm.state.isDirty ||
            employmentHasEmptyStatus ||
            employmentIsSaving ||
            employmentValues.categories.length === 0
          }
          onClick={() => {
            void employmentForm.handleSubmit();
          }}
        >
          {employmentIsSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </section>
  );
}
