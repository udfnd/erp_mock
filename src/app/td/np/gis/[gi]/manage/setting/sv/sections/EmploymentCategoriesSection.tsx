'use client';

import { useQueryClient } from '@tanstack/react-query';
import { startTransition, useCallback, useEffect, useMemo, useReducer, useState } from 'react';

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
                statuses: category.statuses.filter(
                  (status) => status.localId !== action.statusLocalId,
                ),
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

export function EmploymentCategoriesSection({ gigwanNanoId }: EmploymentCategoriesSectionProps) {
  const queryClient = useQueryClient();

  const {
    data: employmentCategoriesData,
    error: employmentError,
  } = useEmploymentCategoriesQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });
  const upsertEmploymentCategoriesMutation = useUpsertEmploymentCategoriesMutation(gigwanNanoId);

  const [employmentState, dispatchEmployment] = useReducer(employmentReducer, {
    categories: [],
    dirty: false,
    feedback: null,
  });

  const [employmentEditing, setEmploymentEditing] = useState<Record<string, boolean>>({});

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

    startTransition(() => {
      setEmploymentEditing({});
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
    const local = createLocalId();
    const newStatus: EmploymentStatusForm = {
      nanoId: null,
      name: '',
      localId: local,
      isHwalseong: true,
    };

    dispatchEmployment({ type: 'add-status', categoryId: categoryNanoId, status: newStatus });
    setEmploymentEditing((prev) => ({ ...prev, [local]: true }));
  }, []);

  const handleRemoveEmploymentStatus = useCallback(
    (categoryNanoId: string, statusLocalId: string) => {
      dispatchEmployment({ type: 'remove-status', categoryId: categoryNanoId, statusLocalId });
      setEmploymentEditing((prev) => {
        const next = { ...prev };
        delete next[statusLocalId];
        return next;
      });
    },
    [],
  );

  const toggleEditEmploymentStatus = useCallback((statusLocalId: string) => {
    setEmploymentEditing((prev) => ({ ...prev, [statusLocalId]: !prev[statusLocalId] }));
  }, []);

  const employmentHasEmptyStatus = useMemo(
    () =>
      employmentState.categories.some((category) =>
        category.statuses.some((status) => status.name.trim().length === 0),
      ),
    [employmentState.categories],
  );

  const handleSaveEmploymentCategories = useCallback(() => {
    if (!employmentState.dirty || employmentHasEmptyStatus) return;

    const categoriesPayload = employmentState.categories.map((category) => {
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

    upsertEmploymentCategoriesMutation.mutate(
      { categories: categoriesPayload },
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
                localId: status.nanoId,
                isHwalseong: status.isHwalseong,
              })),
            })),
          });
          setEmploymentEditing({});
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
    employmentHasEmptyStatus,
    employmentState.categories,
    employmentState.dirty,
    gigwanNanoId,
    queryClient,
    upsertEmploymentCategoriesMutation,
  ]);

  const employmentIsSaving = upsertEmploymentCategoriesMutation.isPending;

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
        {employmentState.categories.map((category) => (
          <div key={category.nanoId} css={styles.categorySection}>
            <span css={styles.categoryLabel}>{category.name}</span>

            <div css={styles.statusList}>
              {category.statuses.map((status) => {
                const isEditing = Boolean(employmentEditing[status.localId]);
                return (
                  <div key={status.localId} css={styles.statusField} role="group">
                    {isEditing ? (
                      <input
                        css={styles.statusInputField}
                        value={status.name}
                        onChange={(event) =>
                          handleEmploymentStatusChange(
                            category.nanoId,
                            status.localId,
                            event.target.value,
                          )
                        }
                        placeholder="상태 이름"
                        maxLength={20}
                        autoFocus
                      />
                    ) : (
                      <span css={styles.statusValue}>{status.name?.trim() || '새 상태'}</span>
                    )}

                    <div css={styles.statusActions}>
                      <IconButton
                        styleType="normal"
                        size="small"
                        onClick={() => toggleEditEmploymentStatus(status.localId)}
                        aria-label={`${status.name || '상태'} ${isEditing ? '편집 종료' : '수정'}`}
                        title={isEditing ? '편집 종료' : '수정'}
                      >
                        <Edit width={16} height={16} />
                      </IconButton>
                      <IconButton
                        styleType="normal"
                        size="small"
                        onClick={() => handleRemoveEmploymentStatus(category.nanoId, status.localId)}
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
      <footer css={styles.cardFooter}>
        {employmentState.feedback ? (
          <span css={styles.feedback[employmentState.feedback.type]}>
            {employmentState.feedback.message}
          </span>
        ) : null}
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
  );
}
