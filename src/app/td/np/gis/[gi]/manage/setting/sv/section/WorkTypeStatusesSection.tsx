'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

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

type WorkTypeState = {
  statuses: WorkTypeStatusForm[];
  dirty: boolean;
  feedback: FeedbackState;
};

type WorkTypeAction =
  | { type: 'reset'; payload: WorkTypeStatusForm[] }
  | { type: 'change'; statusLocalId: string; value: string }
  | { type: 'add'; status: WorkTypeStatusForm }
  | { type: 'remove'; statusLocalId: string }
  | { type: 'feedback'; payload: FeedbackState };

const workTypeReducer = (state: WorkTypeState, action: WorkTypeAction): WorkTypeState => {
  switch (action.type) {
    case 'reset':
      return { statuses: action.payload, dirty: false, feedback: null };
    case 'change':
      return {
        statuses: state.statuses.map((status) =>
          status.localId === action.statusLocalId ? { ...status, name: action.value } : status,
        ),
        dirty: true,
        feedback: null,
      };
    case 'add':
      return { statuses: [...state.statuses, action.status], dirty: true, feedback: null };
    case 'remove':
      return {
        statuses: state.statuses.filter((status) => status.localId !== action.statusLocalId),
        dirty: true,
        feedback: null,
      };
    case 'feedback':
      return { ...state, feedback: action.payload };
    default:
      return state;
  }
};

export function WorkTypeStatusesSection({ gigwanNanoId }: WorkTypeStatusesSectionProps) {
  const queryClient = useQueryClient();

  const { data: workTypeStatusesData, error: workTypeError } = useWorkTypeCustomSangtaesQuery(
    gigwanNanoId,
    { enabled: Boolean(gigwanNanoId) },
  );
  const upsertWorkTypeStatusesMutation = useUpsertWorkTypeCustomSangtaesMutation(gigwanNanoId);

  const [workTypeState, dispatchWorkType] = useReducer(workTypeReducer, {
    statuses: [],
    dirty: false,
    feedback: null,
  });

  useEffect(() => {
    if (!workTypeStatusesData) return;

    dispatchWorkType({
      type: 'reset',
      payload: workTypeStatusesData.sangtaes.map((status) => ({
        nanoId: status.nanoId,
        name: status.name,
        localId: status.nanoId ?? createLocalId(),
        isHwalseong: status.isHwalseong,
      })),
    });
  }, [workTypeStatusesData]);

  const handleWorkTypeStatusChange = useCallback((statusLocalId: string, value: string) => {
    dispatchWorkType({ type: 'change', statusLocalId, value });
  }, []);

  const handleAddWorkTypeStatus = useCallback(() => {
    const local = createLocalId();
    dispatchWorkType({
      type: 'add',
      status: { nanoId: null, name: '', localId: local, isHwalseong: true },
    });
  }, []);

  const handleRemoveWorkTypeStatus = useCallback((statusLocalId: string) => {
    dispatchWorkType({ type: 'remove', statusLocalId });
  }, []);

  const workTypeHasEmptyStatus = useMemo(
    () => workTypeState.statuses.some((status) => status.name.trim().length === 0),
    [workTypeState.statuses],
  );

  const handleSaveWorkTypeStatuses = useCallback(() => {
    if (!workTypeState.dirty || workTypeHasEmptyStatus) return;

    const seen = new Set<string>();
    const sangtaes: Array<
      | { name: string; isHwalseong: boolean }
      | { nanoId: string; name: string; isHwalseong: boolean }
    > = [];

    for (const status of workTypeState.statuses) {
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

    upsertWorkTypeStatusesMutation.mutate(
      { sangtaes },
      {
        onSuccess: (data) => {
          dispatchWorkType({
            type: 'reset',
            payload: data.sangtaes.map((status) => ({
              nanoId: status.nanoId,
              name: status.name,
              localId: status.nanoId,
              isHwalseong: status.isHwalseong,
            })),
          });
          dispatchWorkType({
            type: 'feedback',
            payload: { type: 'success', message: '근무 형태 커스텀 상태가 저장되었습니다.' },
          });
          queryClient.invalidateQueries({ queryKey: ['workTypeCustomSangtaes', gigwanNanoId] });
        },
        onError: () => {
          dispatchWorkType({
            type: 'feedback',
            payload: { type: 'error', message: '근무 형태 상태 저장에 실패했습니다.' },
          });
        },
      },
    );
  }, [
    gigwanNanoId,
    queryClient,
    upsertWorkTypeStatusesMutation,
    workTypeHasEmptyStatus,
    workTypeState.dirty,
    workTypeState.statuses,
  ]);

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
          {workTypeState.statuses.map((status) => (
            <div key={status.localId} css={cssObj.statusItem}>
              <LabeledInput
                placeholder="근무 형태 상태 이름"
                value={status.name}
                onValueChange={(value) => handleWorkTypeStatusChange(status.localId, value)}
                maxLength={20}
              />
              <IconButton
                styleType="normal"
                size="small"
                onClick={() => handleRemoveWorkTypeStatus(status.localId)}
                aria-label={`${status.name || '상태'} 삭제`}
              >
                <Delete width={16} height={16} />
              </IconButton>
            </div>
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
        {workTypeState.feedback ? (
          <span css={cssObj.feedback[workTypeState.feedback.type]}>
            {workTypeState.feedback.message}
          </span>
        ) : null}
        <Button
          size="small"
          styleType="solid"
          variant="primary"
          disabled={
            !workTypeState.dirty ||
            workTypeHasEmptyStatus ||
            workTypeIsSaving ||
            workTypeState.statuses.length === 0
          }
          onClick={handleSaveWorkTypeStatuses}
        >
          {workTypeIsSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </section>
  );
}
