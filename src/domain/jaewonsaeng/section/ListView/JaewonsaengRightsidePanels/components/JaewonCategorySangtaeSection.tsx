'use client';

import { useMemo, useState } from 'react';
import { useEffect } from 'react';

import { Button, IconButton, Textfield } from '@/common/components';
import { DeleteIcon, EditIcon, PlusIcon } from '@/common/icons';
import {
  JaewonCategorySangtae,
  useGetJaewonCategorySangtaesQuery,
  useUpsertJaewonCategorySangtaesMutation,
} from '@/domain/jaewonsaeng/api';

import { cssObj } from '../../styles';

type JaewonCategorySangtaeSectionProps = {
  jojikNanoId: string;
};

type EditableSangtae = JaewonCategorySangtae & { localId: string };

const toEditable = (sangtaes: JaewonCategorySangtae[] = []): EditableSangtae[] =>
  sangtaes.map((item) => ({ ...item, localId: item.nanoId }));

const createEmptySangtae = (): EditableSangtae => ({
  name: '',
  nanoId: '',
  isHwalseong: true,
  localId: `local-${crypto.randomUUID?.() ?? Math.random()}`,
});

export function JaewonCategorySangtaeSection({ jojikNanoId }: JaewonCategorySangtaeSectionProps) {
  const { data } = useGetJaewonCategorySangtaesQuery(jojikNanoId, { enabled: Boolean(jojikNanoId) });
  const upsertMutation = useUpsertJaewonCategorySangtaesMutation(jojikNanoId);

  const [editingMap, setEditingMap] = useState<Record<string, boolean>>({});
  const [sangtaes, setSangtaes] = useState<EditableSangtae[]>(() => toEditable(data?.sangtaes));

  useEffect(() => {
    setSangtaes(toEditable(data?.sangtaes));
  }, [data?.sangtaes]);

  const initialKey = useMemo(
    () => data?.sangtaes.map((s) => `${s.nanoId}:${s.name}:${s.isHwalseong}`).join('|') ?? 'empty',
    [data?.sangtaes],
  );

  const handleAdd = () => {
    setSangtaes((prev) => [...prev, createEmptySangtae()]);
  };

  const toggleEdit = (localId: string) => {
    setEditingMap((prev) => ({ ...prev, [localId]: !prev[localId] }));
  };

  const handleChange = (localId: string, field: keyof EditableSangtae, value: string | boolean) => {
    setSangtaes((prev) =>
      prev.map((item) => (item.localId === localId ? { ...item, [field]: value } : item)),
    );
  };

  const handleDelete = (localId: string) => {
    setSangtaes((prev) => prev.filter((item) => item.localId !== localId));
  };

  const handleSave = async () => {
    const payload = {
      sangtaes: sangtaes.map((item) => ({
        nanoId: item.nanoId || undefined,
        name: item.name.trim(),
        isHwalseong: item.isHwalseong,
      })),
    };

    await upsertMutation.mutateAsync(payload);
    setEditingMap({});
  };

  const isDirty = initialKey !==
    (sangtaes.map((s) => `${s.nanoId}:${s.name}:${s.isHwalseong}`).join('|') ?? '');

  return (
    <div css={cssObj.panelBody}>
      <span css={cssObj.panelSubtitle}>재원 상태 카테고리상태 설정</span>
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
        {sangtaes.length === 0 && <p css={cssObj.helperText}>추가된 상태가 없습니다.</p>}
        {sangtaes.map((item) => {
          const isEditing = editingMap[item.localId] ?? false;
          return (
            <div key={item.localId} css={cssObj.panelLabelSection}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Textfield
                  value={item.name}
                  disabled={!isEditing}
                  placeholder="상태 이름"
                  onChange={(e) => handleChange(item.localId, 'name', e.target.value)}
                />
                <label css={cssObj.panelLabel} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={item.isHwalseong}
                    onChange={(e) => handleChange(item.localId, 'isHwalseong', e.target.checked)}
                  />
                  활성
                </label>
                <IconButton
                  size="small"
                  variant="secondary"
                  icon={isEditing ? <PlusIcon /> : <EditIcon />}
                  aria-label="edit"
                  onClick={() => toggleEdit(item.localId)}
                />
                <IconButton
                  size="small"
                  variant="secondary"
                  icon={<DeleteIcon />}
                  aria-label="delete"
                  onClick={() => handleDelete(item.localId)}
                />
              </div>
            </div>
          );
        })}
        <div css={cssObj.panelFooter}>
          <Button
            size="small"
            styleType="solid"
            variant="primary"
            disabled={!isDirty || upsertMutation.isPending}
            onClick={handleSave}
          >
            {upsertMutation.isPending ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
