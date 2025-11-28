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
        <h2 css={cssObj.panelTitle}>외부 링크 상세</h2>
        <p css={cssObj.panelSubtitle}>{oebuLinkName}</p>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="외부 링크 이름"
            value={currentName}
            onValueChange={(v) => setNameInput(v)}
            maxLength={100}
            disabled={isLoading}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="표시 이름"
            value={currentTitleName}
            onValueChange={(v) => setTitleNameInput(v)}
            maxLength={100}
            disabled={isLoading}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="링크 URL"
            value={currentLinkUrl}
            onValueChange={(v) => setLinkUrlInput(v)}
            disabled={isLoading}
          />
        </div>
        <div css={cssObj.panelSection}>
          <label css={cssObj.panelLabel}>아이콘</label>
          <IconSelect value={currentIcon} onChange={(v) => setLinkIconInput(v)} options={iconOptions} />
        </div>
        <div css={cssObj.buttonRow}>
          <Button type="submit" size="medium" disabled={isSaving || isLoading}>
            저장
          </Button>
          <Button
            type="button"
            css={cssObj.destructiveButton}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            삭제
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
