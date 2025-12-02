'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { Button, IconButton } from '@/common/components';
import { DeleteIcon, EditIcon, PlusIcon } from '@/common/icons';
import {
  gigwanQueryKeys,
  useUpsertWorkTypeCustomSangtaesMutation,
  useWorkTypeCustomSangtaesQuery,
} from '@/domain/gigwan/api';
import type { WorkTypeSangtae } from '@/domain/gigwan/api';

import { cssObj } from './styles';
import { createLocalId } from '../local-id';

type WorkTypeStatusesSectionProps = {
  gigwanNanoId: string;
};

type WorkTypeStatusFormValue = {
  nanoId: string | null;
  name: string;
  localId: string;
  isHwalseong: boolean;
};

type WorkTypeFormValues = {
  statuses: WorkTypeStatusFormValue[];
};

const mapWorkTypeSangtaesToFormValues = (sangtaes: WorkTypeSangtae[]): WorkTypeFormValues => ({
  statuses: sangtaes.map((status) => ({
    nanoId: status.nanoId,
    name: status.name,
    isHwalseong: status.isHwalseong,
    localId: status.nanoId ?? createLocalId(),
  })),
});

const INITIAL_VALUES: WorkTypeFormValues = { statuses: [] };

type WorkTypeEditingState = Record<string, boolean>;

type WorkTypeEditingAction =
  | { type: 'toggle'; localId: string }
  | { type: 'remove'; localId: string }
  | { type: 'reset' };

const workTypeEditingReducer = (
  state: WorkTypeEditingState,
  action: WorkTypeEditingAction,
): WorkTypeEditingState => {
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

type WorkTypeStatusesFormProps = {
  gigwanNanoId: string;
  initialValues: WorkTypeFormValues;
  workTypeError: unknown;
};

function WorkTypeStatusesForm({ gigwanNanoId, initialValues, workTypeError }: WorkTypeStatusesFormProps) {
  const queryClient = useQueryClient();
  const upsertWorkTypeStatusesMutation = useUpsertWorkTypeCustomSangtaesMutation(gigwanNanoId);
  const [editingState, dispatchEditingState] = useReducer(workTypeEditingReducer, {});

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const seen = new Set<string>();
      const sangtaes: Array<
        | { name: string; isHwalseong: boolean }
        | { nanoId: string; name: string; isHwalseong: boolean }
      > = [];

      for (const status of value.statuses) {
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

      try {
        const data = await upsertWorkTypeStatusesMutation.mutateAsync({ sangtaes });
        const nextValues = mapWorkTypeSangtaesToFormValues(data.sangtaes);
        form.reset(nextValues);
        dispatchEditingState({ type: 'reset' });
        await queryClient.invalidateQueries({
          queryKey: gigwanQueryKeys.workTypeCustomSangtaes(gigwanNanoId),
        });
      } catch {}
    },
  });

  const { statuses, isDirty } = useStore(form.store, (state) => {
    const v = state.values as WorkTypeFormValues;
    return {
      statuses: v.statuses ?? [],
      isDirty: state.isDirty,
    };
  });

  useEffect(() => {
    form.reset(initialValues);
    dispatchEditingState({ type: 'reset' });
  }, [form, initialValues]);

  const workTypeHasEmptyStatus = useMemo(
    () => statuses.some((s) => s.name.trim().length === 0),
    [statuses],
  );

  const workTypeIsSaving = upsertWorkTypeStatusesMutation.isPending;

  const handleSaveWorkTypeStatuses = useCallback(async () => {
    if (!isDirty || workTypeHasEmptyStatus) return;
    await form.handleSubmit();
  }, [form, isDirty, workTypeHasEmptyStatus]);

  const toggleEditWorkTypeStatus = (localId: string) => {
    dispatchEditingState({ type: 'toggle', localId });
  };

  return (
    <>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>근무 형태 커스텀 상태</h2>
          <p css={cssObj.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
        </div>
      </div>

      <div css={cssObj.cardBody}>
        {workTypeError ? <p css={cssObj.errorText}>근무 형태 상태를 불러오지 못했습니다.</p> : null}

        <form.Field name="statuses" mode="array">
          {(statusesField) => (
            <>
              <span css={cssObj.categoryLabel}>근무 형태</span>
              <div css={cssObj.statusList}>
                {statusesField.state.value.map((status, statusIndex) => (
                  <form.Field key={status.localId} name={`statuses[${statusIndex}].name`}>
                    {(field) => {
                      const currentStatus = statusesField.state.value[statusIndex];
                      const localId = currentStatus?.localId ?? `${statusIndex}`;
                      const isEditing = Boolean(editingState[localId]);
                      const value = String(field.state.value ?? '');
                      return (
                        <div css={cssObj.statusField} role="group">
                          {isEditing ? (
                            <input
                              css={cssObj.statusInputField}
                              placeholder="근무 형태 상태 이름"
                              value={value}
                              onChange={(event) => {
                                field.handleChange(event.target.value);
                              }}
                              onBlur={field.handleBlur}
                              maxLength={20}
                              autoFocus
                            />
                          ) : (
                            <span css={cssObj.statusValue}>{value.trim() || '새 상태'}</span>
                          )}
                          <div css={cssObj.statusActions}>
                            <IconButton
                              styleType="normal"
                              size="small"
                              onClick={() => toggleEditWorkTypeStatus(localId)}
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
                                dispatchEditingState({ type: 'remove', localId });
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
              </div>
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
                    localId,
                    isHwalseong: true,
                  });
                  dispatchEditingState({ type: 'toggle', localId });
                }}
              >
                추가
              </Button>
            </>
          )}
        </form.Field>
      </div>

      <footer css={cssObj.cardFooter}>
        <Button
          size="small"
          styleType="solid"
          variant="primary"
          disabled={!isDirty || workTypeHasEmptyStatus || workTypeIsSaving || statuses.length === 0}
          onClick={handleSaveWorkTypeStatuses}
        >
          {workTypeIsSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </>
  );
}

export function WorkTypeStatusesSection({ gigwanNanoId }: WorkTypeStatusesSectionProps) {
  const { data: workTypeStatusesData, error: workTypeError } = useWorkTypeCustomSangtaesQuery(
    gigwanNanoId,
    { enabled: Boolean(gigwanNanoId) },
  );

  const initialValues = useMemo<WorkTypeFormValues>(() => {
    if (!workTypeStatusesData) return INITIAL_VALUES;
    return mapWorkTypeSangtaesToFormValues(workTypeStatusesData.sangtaes);
  }, [workTypeStatusesData]);

  const formKey = `${gigwanNanoId}:${
    workTypeStatusesData?.sangtaes?.map((sangtae) => sangtae.nanoId).join('|') ?? 'empty'
  }`;

  return (
    <section css={cssObj.card}>
      <WorkTypeStatusesForm
        key={formKey}
        gigwanNanoId={gigwanNanoId}
        initialValues={initialValues}
        workTypeError={workTypeError}
      />
    </section>
  );
}
