'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';

import { Button, IconButton, LabeledInput } from '@/common/components';
import { Delete, Plus } from '@/common/icons';
import {
  useUpsertWorkTypeCustomSangtaesMutation,
  useWorkTypeCustomSangtaesQuery,
} from '@/domain/gigwan/api';

import { cssObj } from '../style';
import { createLocalId } from './local-id';
import { FeedbackState } from './types';

type WorkTypeStatusesSectionProps = {
  gigwanNanoId: string;
};

type WorkTypeStatusForm = {
  nanoId: string | null;
  name: string;
  localId: string;
  isHwalseong: boolean;
};

type WorkTypeFormValues = {
  statuses: WorkTypeStatusForm[];
};

export function WorkTypeStatusesSection({ gigwanNanoId }: WorkTypeStatusesSectionProps) {
  const queryClient = useQueryClient();

  const { data: workTypeStatusesData, error: workTypeError } = useWorkTypeCustomSangtaesQuery(
    gigwanNanoId,
    { enabled: Boolean(gigwanNanoId) },
  );
  const upsertWorkTypeStatusesMutation = useUpsertWorkTypeCustomSangtaesMutation(gigwanNanoId);

  const form = useForm<WorkTypeFormValues>({
    defaultValues: { statuses: [] },
    onSubmit: async ({ value, formApi }) => {
      const seen = new Set<string>();
      const sangtaes: Array<
        | { name: string; isHwalseong: boolean }
        | { nanoId: string; name: string; isHwalseong: boolean }
      > = [];

      for (const status of value.statuses ?? []) {
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
        formApi.reset({
          statuses: data.sangtaes.map((status) => ({
            nanoId: status.nanoId,
            name: status.name,
            localId: status.nanoId,
            isHwalseong: status.isHwalseong,
          })),
        });
        setFeedback({ type: 'success', message: '근무 형태 커스텀 상태가 저장되었습니다.' });
        await queryClient.invalidateQueries({
          queryKey: ['workTypeCustomSangtaes', gigwanNanoId],
        });
      } catch {
        setFeedback({ type: 'error', message: '근무 형태 상태 저장에 실패했습니다.' });
      }
    },
  });

  const { values, isDirty } = useStore(form.store, (state) => ({
    values: state.values,
    isDirty: state.isDirty,
  }));
  const statuses = values.statuses ?? [];

  const [feedback, setFeedback] = useState<FeedbackState>(null);

  useEffect(() => {
    if (!workTypeStatusesData) return;

    form.reset({
      statuses: workTypeStatusesData.sangtaes.map((status) => ({
        nanoId: status.nanoId,
        name: status.name,
        localId: status.nanoId ?? createLocalId(),
        isHwalseong: status.isHwalseong,
      })),
    });
    setFeedback(null);
  }, [form, workTypeStatusesData]);

  const handleAddWorkTypeStatus = useCallback(() => {
    form.pushFieldValue('statuses', {
      nanoId: null,
      name: '',
      localId: createLocalId(),
      isHwalseong: true,
    });
    setFeedback(null);
  }, [form]);

  const handleRemoveWorkTypeStatus = useCallback(
    (statusIndex: number) => {
      void form.removeFieldValue('statuses', statusIndex);
      setFeedback(null);
    },
    [form],
  );

  const workTypeHasEmptyStatus = useMemo(
    () => statuses.some((status) => status.name.trim().length === 0),
    [statuses],
  );

  const handleSaveWorkTypeStatuses = useCallback(async () => {
    if (!isDirty || workTypeHasEmptyStatus) return;
    setFeedback(null);
    await form.handleSubmit();
  }, [form, isDirty, workTypeHasEmptyStatus]);

  const workTypeIsSaving = upsertWorkTypeStatusesMutation.isPending;

  return (
    <section css={cssObj.card}>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>근무 형태 커스텀 상태</h2>
          <p css={cssObj.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
        </div>
      </div>

      <div css={cssObj.cardBody}>
        {workTypeError ? <p css={cssObj.errorText}>근무 형태 상태를 불러오지 못했습니다.</p> : null}
        <div css={cssObj.statusList}>
          <span css={cssObj.categoryLabel}>재직상태</span>
          {statuses.map((status, statusIndex) => (
            <form.Field key={status.localId} name={`statuses[${statusIndex}].name`}>
              {(field) => {
                const value = String(field.state.value ?? '');
                return (
                  <div css={cssObj.statusItem}>
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
                      onClick={() => handleRemoveWorkTypeStatus(statusIndex)}
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
          onClick={handleAddWorkTypeStatus}
        >
          추가
        </Button>
      </div>
      <footer css={cssObj.cardFooter}>
        {feedback ? <span css={cssObj.feedback[feedback.type]}>{feedback.message}</span> : null}
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
