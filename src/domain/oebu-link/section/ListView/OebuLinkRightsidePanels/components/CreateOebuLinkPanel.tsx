'use client';

import { type FormEvent, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import { useCreateOebuLinkMutation } from '@/domain/oebu-link/api';

import type { LinkIconOption } from '../../linkIconOptions';
import { cssObj } from '../../styles';
import { IconSelect } from './IconSelect';

type CreatePanelProps = {
  jojikNanoId: string;
  iconOptions: LinkIconOption[];
  onAfterMutation: () => Promise<unknown> | void;
  onExit?: () => void;
};

export function CreateOebuLinkPanel({ jojikNanoId, iconOptions, onAfterMutation, onExit }: CreatePanelProps) {
  const createMutation = useCreateOebuLinkMutation();

  const [name, setName] = useState('');
  const [titleName, setTitleName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIconNanoId, setLinkIconNanoId] = useState('none');

  const formId = 'oebu-link-create-form';
  const isSaving = createMutation.isPending;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedTitle = titleName.trim();
    const trimmedUrl = linkUrl.trim();
    if (!trimmedName || !trimmedTitle || !trimmedUrl) {
      return;
    }

    await createMutation.mutateAsync({
      jojikNanoId,
      name: trimmedName,
      titleName: trimmedTitle,
      linkUrl: trimmedUrl,
      linkIconNanoId: linkIconNanoId === 'none' ? null : linkIconNanoId,
    });

    setName('');
    setTitleName('');
    setLinkUrl('');
    setLinkIconNanoId('none');
    onAfterMutation();
    onExit?.();
  };

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>새 외부 링크 생성</h2>
        <p css={cssObj.panelSubtitle}>선택된 조직에 새로운 외부 링크를 추가합니다.</p>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="외부 링크 이름"
            placeholder="외부 링크 이름"
            value={name}
            onValueChange={setName}
            maxLength={100}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="표시 이름"
            placeholder="표시 이름"
            value={titleName}
            onValueChange={setTitleName}
            maxLength={100}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="링크 URL"
            placeholder="https://example.com"
            value={linkUrl}
            onValueChange={setLinkUrl}
          />
        </div>
        <div css={cssObj.panelSection}>
          <label css={cssObj.panelLabel}>아이콘</label>
          <IconSelect value={linkIconNanoId} onChange={setLinkIconNanoId} options={iconOptions} />
        </div>
        <div css={cssObj.buttonRow}>
          {onExit && (
            <Button type="button" onClick={onExit} disabled={isSaving} size="medium" variant="secondary">
              취소
            </Button>
          )}
          <Button type="submit" size="medium" disabled={isSaving}>
            저장
          </Button>
        </div>
      </form>
    </>
  );
}
