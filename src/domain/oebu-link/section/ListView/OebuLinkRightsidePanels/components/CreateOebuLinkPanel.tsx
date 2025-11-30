'use client';

import { type FormEvent, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import { useCreateOebuLinkMutation } from '@/domain/oebu-link/api';

import type { LinkIconOption } from '../../linkIconOptions';
import { cssObj } from '../../styles';
import { IconSelect } from './IconSelect';
import { PlusIcon } from '@/common/icons';

type CreatePanelProps = {
  jojikNanoId: string;
  iconOptions: LinkIconOption[];
  onAfterMutation: () => Promise<unknown> | void;
  onExit?: () => void;
};

export function CreateOebuLinkPanel({
  jojikNanoId,
  iconOptions,
  onAfterMutation,
  onExit,
}: CreatePanelProps) {
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
        <h2 css={cssObj.panelTitle}>링크 생성</h2>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <p css={cssObj.quickActionText}>링크 기본 속성</p>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            label="링크 이름(별명) 입력"
            placeholder="링크 이름(별명)을 입력해주세요"
            helperText="30자 이내의 이름을 입력해 주세요."
            value={name}
            onValueChange={setName}
            maxLength={30}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            label="링크 주소"
            placeholder="링크 주소를 입력해주세요"
            value={linkUrl}
            onValueChange={setLinkUrl}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            label="링크 표기 제목 입력"
            placeholder="링크를 표기할 제목을 입력해주세요"
            helperText="30자 이내의 이름을 입력해 주세요."
            value={titleName}
            onValueChange={setTitleName}
            maxLength={30}
          />
        </div>
        <div css={cssObj.panelSection}>
          <label css={cssObj.panelLabel}>링크 아이콘 선택</label>
          <IconSelect value={linkIconNanoId} onChange={setLinkIconNanoId} options={iconOptions} />
        </div>
        <div css={cssObj.buttonRow}>
          <Button type="submit" size="small" iconRight={<PlusIcon />} disabled={isSaving} isFull>
            주소 생성하기
          </Button>
        </div>
      </form>
    </>
  );
}
