'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, IconButton, LabeledInput } from '@/common/components';
import { Delete, Plus } from '@/common/icons';
import {
  useUpsertWorkTypeCustomSangtaesMutation,
  useWorkTypeCustomSangtaesQuery,
} from '@/domain/gigwan/api';
import type { WorkTypeSangtae } from '@/domain/gigwan/api';

import { css } from './styles';
import { createLocalId } from '../local-id';
import { type FeedbackState } from '../types';

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

export function WorkTypeStatusesSection({ gigwanNanoId }: WorkTypeStatusesSectionProps) {
  const queryClient = useQueryClient();

  const { data: workTypeStatusesData, error: workTypeError } = useWorkTypeCustomSangtaesQuery(
    gigwanNanoId,
    { enabled: Boolean(gigwanNanoId) },
  );
  const upsertWorkTypeStatusesMutation = useUpsertWorkTypeCustomSangtaesMutation(gigwanNanoId);

  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const form = useForm({
    defaultValues: INITIAL_VALUES,
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
        setFeedback({ type: 'success', message: '근무 형태 커스텀 상태가 저장되었습니다.' });
        await queryClient.invalidateQueries({ queryKey: ['workTypeCustomSangtaes', gigwanNanoId] });
      } catch {
        setFeedback({ type: 'error', message: '근무 형태 상태 저장에 실패했습니다.' });
      }
    },
  });

  useEffect(() => {
    if (!workTypeStatusesData) return;
    const nextValues = mapWorkTypeSangtaesToFormValues(workTypeStatusesData.sangtaes);
    form.reset(nextValues);
  }, [workTypeStatusesData, form]);

  const { statuses, isDirty } = useStore(form.store, (state) => {
    const v = state.values as WorkTypeFormValues;
    return {
      statuses: v.statuses ?? [],
      isDirty: state.isDirty,
    };
  });

  const workTypeHasEmptyStatus = useMemo(
    () => statuses.some((s) => s.name.trim().length === 0),
    [statuses],
  );

  const workTypeIsSaving = upsertWorkTypeStatusesMutation.isPending;

  const handleSaveWorkTypeStatuses = useCallback(async () => {
    if (!isDirty || workTypeHasEmptyStatus) return;
    setFeedback(null);
    await form.handleSubmit();
  }, [form, isDirty, workTypeHasEmptyStatus]);

  return (
    <section css={css.card}>
      <div css={css.cardHeader}>
        <div css={css.cardTitleGroup}>
          <h2 css={css.cardTitle}>근무 형태 커스텀 상태</h2>
          <p css={css.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
        </div>
      </div>

      <div css={css.cardBody}>
        {workTypeError ? <p css={css.errorText}>근무 형태 상태를 불러오지 못했습니다.</p> : null}

        <form.Field name="statuses" mode="array">
          {(statusesField) => (
            <>
              <span css={css.categoryLabel}>재직상태</span>
              <div css={css.statusList}>
                {statusesField.state.value.map((status, statusIndex) => (
                  <form.Field key={status.localId} name={`statuses[${statusIndex}].name`}>
                    {(field) => {
                      const value = String(field.state.value ?? '');
                      return (
                        <div css={css.statusItem}>
                          <LabeledInput
                            placeholder="근무 형태 상태 이름"
                            value={value}
                            onValueChange={(v) => {
                              setFeedback(null);
                              field.handleChange(v);
                            }}
                            onBlur={field.handleBlur}
                            maxLength={20}
                          />
                          <IconButton
                            styleType="normal"
                            size="small"
                            onClick={() => {
                              void statusesField.removeValue(statusIndex);
                              setFeedback(null);
                            }}
                            aria-label={`${value || '상태'} 삭제`}
                          >
                            <Delete width={16} height={16} />
                          </IconButton>
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
                iconRight={<Plus width={16} height={16} />}
                onClick={() => {
                  statusesField.pushValue({
                    nanoId: null,
                    name: '',
                    localId: createLocalId(),
                    isHwalseong: true,
                  });
                  setFeedback(null);
                }}
              >
                추가
              </Button>
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
          disabled={!isDirty || workTypeHasEmptyStatus || workTypeIsSaving || statuses.length === 0}
          onClick={handleSaveWorkTypeStatuses}
        >
          {workTypeIsSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </section>
  );
}
