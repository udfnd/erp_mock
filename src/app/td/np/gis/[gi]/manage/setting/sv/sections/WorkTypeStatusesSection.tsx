'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';

import { Button, IconButton, LabeledInput } from '@/common/components';
import { Delete, Plus } from '@/common/icons';
import {
  useUpsertWorkTypeCustomSangtaesMutation,
  useWorkTypeCustomSangtaesQuery,
} from '@/domain/gigwan/api';

import * as styles from '../style';
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

  const {
    data: workTypeStatusesData,
    error: workTypeError,
  } = useWorkTypeCustomSangtaesQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });
  const upsertWorkTypeStatusesMutation = useUpsertWorkTypeCustomSangtaesMutation(gigwanNanoId);

  const [workTypeFeedback, setWorkTypeFeedback] = useState<FeedbackState>(null);

  const workTypeForm = useForm<WorkTypeFormValues>({
    defaultValues: { statuses: [] },
    onSubmit: async ({ value, formApi }) => {
      if (value.statuses.length === 0) return;

      setWorkTypeFeedback(null);

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

      try {
        const data = await upsertWorkTypeStatusesMutation.mutateAsync({ sangtaes });
        formApi.reset({
          statuses: data.sangtaes.map((status) => ({
            nanoId: status.nanoId ?? null,
            name: status.name,
            localId: status.nanoId ?? createLocalId(),
            isHwalseong: status.isHwalseong,
          })),
        });
        setWorkTypeFeedback({
          type: 'success',
          message: '근무 형태 커스텀 상태가 저장되었습니다.',
        });
        await queryClient.invalidateQueries({ queryKey: ['workTypeCustomSangtaes', gigwanNanoId] });
      } catch {
        setWorkTypeFeedback({
          type: 'error',
          message: '근무 형태 상태 저장에 실패했습니다.',
        });
      }
    },
  });

  useEffect(() => {
    if (!workTypeStatusesData) return;

    workTypeForm.reset({
      statuses: workTypeStatusesData.sangtaes.map((status) => ({
        nanoId: status.nanoId ?? null,
        name: status.name,
        localId: status.nanoId ?? createLocalId(),
        isHwalseong: status.isHwalseong,
      })),
    });
    setWorkTypeFeedback(null);
  }, [workTypeForm, workTypeStatusesData]);

  const workTypeValues = workTypeForm.state.values;
  const workTypeHasEmptyStatus = workTypeValues.statuses.some(
    (status) => status.name.trim().length === 0,
  );
  const workTypeIsSaving =
    workTypeForm.state.isSubmitting || upsertWorkTypeStatusesMutation.isPending;

  const handleAddWorkTypeStatus = () => {
    const localId = createLocalId();
    workTypeForm.setFieldValue('statuses', (prev) => [
      ...prev,
      { nanoId: null, name: '', localId, isHwalseong: true },
    ]);
    setWorkTypeFeedback(null);
  };

  const handleRemoveWorkTypeStatus = (statusLocalId: string) => {
    workTypeForm.setFieldValue('statuses', (prev) =>
      prev.filter((status) => status.localId !== statusLocalId),
    );
    setWorkTypeFeedback(null);
  };

  return (
    <section css={styles.card}>
      <div css={styles.cardHeader}>
        <div css={styles.cardTitleGroup}>
          <h2 css={styles.cardTitle}>근무 형태 커스텀 상태</h2>
          <p css={styles.cardSubtitle}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
        </div>
      </div>

      <div css={styles.cardBody}>
        {workTypeError ? (
          <p css={styles.errorText}>근무 형태 상태를 불러오지 못했습니다.</p>
        ) : null}
        <div css={styles.statusList}>
          <span css={styles.categoryLabel}>재직상태</span>
          {workTypeValues.statuses.map((status, index) => (
            <workTypeForm.Field
              key={status.localId}
              name={`statuses.${index}` as const}
              validators={{
                onChange: ({ value }) =>
                  value.name.trim().length === 0 ? '상태 이름을 입력해주세요.' : undefined,
              }}
            >
              {(field) => {
                const current = field.state.value as WorkTypeStatusForm;
                const error = field.state.meta.errors[0] as string | undefined;

                return (
                  <div key={current.localId} css={styles.statusItem}>
                    <LabeledInput
                      placeholder="근무 형태 상태 이름"
                      value={current.name}
                      onValueChange={(value) => {
                        setWorkTypeFeedback(null);
                        field.handleChange({ ...current, name: value });
                      }}
                      onBlur={field.handleBlur}
                      maxLength={20}
                      helperText={error}
                      status={error ? 'error' : 'normal'}
                    />
                    <IconButton
                      styleType="normal"
                      size="small"
                      onClick={() => handleRemoveWorkTypeStatus(current.localId)}
                      aria-label={`${current.name || '상태'} 삭제`}
                    >
                      <Delete width={16} height={16} />
                    </IconButton>
                  </div>
                );
              }}
            </workTypeForm.Field>
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
      <footer css={styles.cardFooter}>
        {workTypeFeedback ? (
          <span css={styles.feedback[workTypeFeedback.type]}>
            {workTypeFeedback.message}
          </span>
        ) : null}
        <Button
          size="small"
          styleType="solid"
          variant="primary"
          disabled={
            !workTypeForm.state.isDirty ||
            workTypeHasEmptyStatus ||
            workTypeIsSaving ||
            workTypeValues.statuses.length === 0
          }
          onClick={() => {
            void workTypeForm.handleSubmit();
          }}
        >
          {workTypeIsSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </section>
  );
}
