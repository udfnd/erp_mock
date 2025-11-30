'use client';

import { type FormEvent, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useDeleteOebuLinkMutation,
  useGetOebuLinkDetailQuery,
  useUpdateOebuLinkMutation,
} from '@/domain/oebu-link/api';

import type { LinkIconOption } from '../../linkIconOptions';
import { cssObj } from '../../styles';
import { IconSelect } from './IconSelect';

export type SingleSelectionPanelProps = {
  oebuLinkNanoId: string;
  oebuLinkName: string;
  iconOptions: LinkIconOption[];
  onAfterMutation: () => Promise<unknown> | void;
};

export type MultiSelectionPanelProps = { oebuLinks: { nanoId: string; name: string }[] };

export function SingleSelectionPanel({
  oebuLinkNanoId,
  oebuLinkName,
  iconOptions,
  onAfterMutation,
}: SingleSelectionPanelProps) {
  const { data: detailData, isLoading } = useGetOebuLinkDetailQuery(oebuLinkNanoId, {
    enabled: Boolean(oebuLinkNanoId),
  });
  const updateMutation = useUpdateOebuLinkMutation(oebuLinkNanoId);
  const deleteMutation = useDeleteOebuLinkMutation(oebuLinkNanoId);

  const [nameInput, setNameInput] = useState<string | null>(null);
  const [titleNameInput, setTitleNameInput] = useState<string | null>(null);
  const [linkUrlInput, setLinkUrlInput] = useState<string | null>(null);
  const [linkIconInput, setLinkIconInput] = useState<string | null>(null);

  const originalName = detailData?.name ?? '';
  const originalTitleName = detailData?.titleName ?? '';
  const originalLinkUrl = detailData?.linkUrl ?? '';
  const originalIcon = detailData?.linkIcon ?? 'none';

  const currentName = nameInput ?? originalName;
  const currentTitleName = titleNameInput ?? originalTitleName;
  const currentLinkUrl = linkUrlInput ?? originalLinkUrl;
  const currentIcon = linkIconInput ?? originalIcon;

  const isSaving = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const formId = 'oebu-link-detail-form';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = currentName.trim();
    const trimmedTitle = currentTitleName.trim();
    const trimmedUrl = currentLinkUrl.trim();
    if (!trimmedName || !trimmedTitle || !trimmedUrl) {
      return;
    }

    await updateMutation.mutateAsync({
      name: trimmedName,
      titleName: trimmedTitle,
      linkUrl: trimmedUrl,
      linkIconNanoId: currentIcon === 'none' ? null : currentIcon,
    });

    setNameInput(null);
    setTitleNameInput(null);
    setLinkUrlInput(null);
    setLinkIconInput(null);

    onAfterMutation();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
    onAfterMutation();
  };

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{oebuLinkName} 설정</h2>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <p css={cssObj.panelSubtitle}>링크 기본 속성</p>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            label="링크 이름(별명) 입력"
            placeholder="링크 이름(별명)을 입력해주세요"
            helperText="30자 이내의 이름을 입력해 주세요."
            value={currentName}
            onValueChange={(v) => setNameInput(v)}
            maxLength={30}
            disabled={isLoading}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            label="링크 주소"
            placeholder="링크 주소를 입력해주세요"
            value={currentLinkUrl}
            onValueChange={(v) => setLinkUrlInput(v)}
            disabled={isLoading}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            label="링크 표기 제목 입력"
            placeholder="링크를 표기할 제목을 입력해주세요"
            helperText="30자 이내의 이름을 입력해 주세요."
            value={currentTitleName}
            onValueChange={(v) => setTitleNameInput(v)}
            maxLength={30}
            disabled={isLoading}
          />
        </div>
        <div css={cssObj.panelSection}>
          <label css={cssObj.panelLabel}>아이콘</label>
          <IconSelect
            value={currentIcon}
            onChange={(v) => setLinkIconInput(v)}
            options={iconOptions}
          />
        </div>
        <div css={cssObj.saveButtonContainer}>
          <Button type="submit" size="small" variant="secondary" disabled={isSaving || isLoading}>
            저장
          </Button>
        </div>
        <div css={cssObj.buttonRow}>
          <Button
            type="button"
            variant="red"
            size="small"
            onClick={handleDelete}
            isFull
            disabled={isDeleting}
          >
            링크 삭제
          </Button>
        </div>
      </form>
    </>
  );
}

export function MultiSelectionPanel({ oebuLinks }: MultiSelectionPanelProps) {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>여러 외부 링크 선택됨</h2>
        <p css={cssObj.panelSubtitle}>선택된 항목 중 하나를 클릭하여 상세 정보를 확인하세요.</p>
      </div>
      <div css={cssObj.panelBody}>
        <ul css={cssObj.panelList}>
          {oebuLinks.map((link) => (
            <li key={link.nanoId}>{link.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
