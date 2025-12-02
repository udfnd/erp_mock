'use client';

import { useForm, useStore } from '@tanstack/react-form';
import { useEffect, useMemo, useReducer } from 'react';

import { Button, IconButton, Textfield } from '@/common/components';
import { DeleteIcon, EditIcon, PlusIcon } from '@/common/icons';
import {
  JaewonCategorySangtae,
  useGetJaewonCategorySangtaesQuery,
  useUpsertJaewonCategorySangtaesMutation,
} from '@/domain/jaewonsaeng/api';
import { createLocalId } from '@/domain/gigwan/section/local-id';

import { cssObj } from '../../styles';

type JaewonCategorySangtaeSectionProps = {
  jojikNanoId: string;
};

type EditableSangtae = JaewonCategorySangtae & { localId: string };

type JaewonCategorySangtaeFormValues = {
  sangtaes: EditableSangtae[];
};

const toEditable = (sangtaes: JaewonCategorySangtae[] = []): EditableSangtae[] =>
  sangtaes.map((item) => ({ ...item, localId: item.nanoId ?? createLocalId() }));

const createEmptySangtae = (): EditableSangtae => ({
  name: '',
  nanoId: '',
  isHwalseong: true,
  localId: createLocalId(),
});

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
  const { data } = useGetJaewonCategorySangtaesQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
  });
  const upsertMutation = useUpsertJaewonCategorySangtaesMutation(jojikNanoId);

  const initialValues: JaewonCategorySangtaeFormValues = useMemo(
    () => ({ sangtaes: toEditable(data?.sangtaes) }),
    [data?.sangtaes],
  );

  const [editingMap, dispatchEditing] = useReducer(editingReducer, {});

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const payload = {
        sangtaes: value.sangtaes
          .map((item) => ({
            nanoId: item.nanoId || undefined,
            name: item.name.trim(),
            isHwalseong: item.isHwalseong,
          }))
          .filter((item) => item.name.length > 0),
      };

      await upsertMutation.mutateAsync(payload);
      dispatchEditing({ type: 'reset' });
      form.reset({ sangtaes: toEditable(data?.sangtaes) });
    },
  });

  useEffect(() => {
    form.reset(initialValues);
    dispatchEditing({ type: 'reset' });
  }, [form, initialValues]);

  const { sangtaes, isDirty } = useStore(form.store, (state) => {
    const values = state.values as JaewonCategorySangtaeFormValues;
    return { sangtaes: values.sangtaes ?? [], isDirty: state.isDirty };
  });

  const initialKey = useMemo(
    () => data?.sangtaes.map((s) => `${s.nanoId}:${s.name}:${s.isHwalseong}`).join('|') ?? 'empty',
    [data?.sangtaes],
  );

  const handleAdd = () => {
    form.setFieldValue('sangtaes', (prev = []) => [...prev, createEmptySangtae()]);
  };

  const toggleEdit = (localId: string) => {
    dispatchEditing({ type: 'toggle', localId });
  };

  const handleDelete = (localId: string) => {
    form.setFieldValue('sangtaes', (prev = []) => prev.filter((item) => item.localId !== localId));
    dispatchEditing({ type: 'remove', localId });
  };

  return (
    <div key={initialKey}>
      <span css={cssObj.panelSubtitle}>재원 상태 카테고리상태 설정</span>
      <p css={cssObj.desc}>사용중인 카테고리는 수정하거나 삭제할 수 없어요</p>
      <div css={cssObj.panelSection}>
        <div css={cssObj.sectionActions}>
          <Button
            size="small"
            styleType="outlined"
            variant="secondary"
            iconLeft={<PlusIcon width={16} height={16} />}
            onClick={handleAdd}
          >
            상태 추가
          </Button>
        </div>
        {sangtaes.map((item, index) => {
          const isEditing = editingMap[item.localId] ?? false;
          return (
            <div key={item.localId} css={cssObj.panelLabelSection}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <form.Field name={`sangtaes[${index}].name`}>
                  {(field) => (
                    <Textfield
                      value={field.state.value}
                      disabled={!isEditing}
                      placeholder="상태 이름"
                      onValueChange={field.handleChange}
                    />
                  )}
                </form.Field>
                <label
                  css={cssObj.panelLabel}
                  style={{ display: 'flex', gap: 4, alignItems: 'center' }}
                >
                  <input
                    type="checkbox"
                    checked={item.isHwalseong}
                    onChange={(e) =>
                      form.setFieldValue('sangtaes', (prev = []) =>
                        prev.map((s) =>
                          s.localId === item.localId ? { ...s, isHwalseong: e.target.checked } : s,
                        ),
                      )
                    }
                  />
                  활성
                </label>
                <IconButton
                  size="small"
                  styleType="background"
                  aria-label="edit"
                  onClick={() => toggleEdit(item.localId)}
                >
                  {isEditing ? <PlusIcon /> : <EditIcon />}
                </IconButton>
                <IconButton
                  size="small"
                  styleType="background"
                  aria-label="delete"
                  onClick={() => handleDelete(item.localId)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          );
        })}
        <div css={cssObj.sectionFooter}>
          <Button
            size="small"
            styleType="solid"
            variant="primary"
            disabled={!isDirty || upsertMutation.isPending}
            onClick={() => void form.handleSubmit()}
          >
            {upsertMutation.isPending ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
