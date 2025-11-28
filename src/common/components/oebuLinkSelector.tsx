'use client';

import { useCallback, useMemo, useState } from 'react';

import { Button } from './Button';
import { SelectorModal, type SelectorModalMenu } from './selectorModal';
import { Textfield } from './Textfield';
import { cssObj } from './OebuLinkSelector.style';
import { EditIcon, LinkOnIcon } from '@/common/icons';
import type { OebuLinkListItem } from '@/domain/oebu-link/api';
import { useCreateOebuLinkMutation } from '@/domain/oebu-link/api';
import {
  OebuLinkListSection,
  type UseOebuLinkListViewSectionsResult,
  useOebuLinkListViewSections,
} from '@/domain/oebu-link/section';

export type OebuLinkSelectorProps = {
  jojikNanoId: string;
  isAuthenticated: boolean;
  maxSelectable: number;
  onComplete: (selected: OebuLinkListItem[]) => void;
  buttonLabel?: string;
};

const createSelectableOebuLink = (payload: OebuLinkListItem): OebuLinkListItem => ({
  ...payload,
});

type CreateFormProps = {
  jojikNanoId: string;
  iconOptions: { label: string; value: string }[];
  onCreated: (link: OebuLinkListItem) => void;
  onAfterMutation?: () => Promise<unknown> | void;
};

const CreateOebuLinkForm = ({
  jojikNanoId,
  iconOptions,
  onCreated,
  onAfterMutation,
}: CreateFormProps) => {
  const createMutation = useCreateOebuLinkMutation();
  const [name, setName] = useState('');
  const [titleName, setTitleName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIconNanoId, setLinkIconNanoId] = useState('none');

  const isSaving = createMutation.isPending;

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedTitle = titleName.trim();
    const trimmedUrl = linkUrl.trim();

    if (!trimmedName || !trimmedTitle || !trimmedUrl) return;

    const response = await createMutation.mutateAsync({
      jojikNanoId,
      name: trimmedName,
      titleName: trimmedTitle,
      linkUrl: trimmedUrl,
      linkIconNanoId: linkIconNanoId === 'none' ? null : linkIconNanoId,
    });

    const newLink = createSelectableOebuLink({
      nanoId: response.nanoId,
      name: response.name,
      titleName: response.titleName,
      linkUrl: response.linkUrl,
      linkIcon: response.linkIcon,
      createdAt: response.createdAt,
      createdBy: response.createdBy,
    });

    onCreated(newLink);
    setName('');
    setTitleName('');
    setLinkUrl('');
    setLinkIconNanoId('none');
    await onAfterMutation?.();
  };

  return (
    <div css={cssObj.formContainer}>
      <div css={cssObj.textfieldContainer}>
        <h3 css={cssObj.formTitle}>외부 링크 정보</h3>
        <div css={cssObj.formRow}>
          <Textfield
            singleLine
            required
            label="외부 링크 이름"
            placeholder="외부 링크 이름"
            helperText="이름은 최대 100자까지 입력 가능합니다."
            value={name}
            onValueChange={setName}
            maxLength={100}
          />
          <Textfield
            singleLine
            required
            label="표시 이름"
            placeholder="표시 이름을 입력하세요"
            value={titleName}
            onValueChange={setTitleName}
            maxLength={100}
          />
          <Textfield
            singleLine
            required
            label="링크 URL"
            placeholder="https://example.com"
            value={linkUrl}
            onValueChange={setLinkUrl}
          />
          <div css={cssObj.formRow}>
            <label css={cssObj.iconSelectLabel} htmlFor="oebu-link-icon">
              아이콘
            </label>
            <select
              id="oebu-link-icon"
              css={cssObj.iconSelect}
              value={linkIconNanoId}
              onChange={(event) => setLinkIconNanoId(event.target.value)}
            >
              {[
                { label: '아이콘 없음', value: 'none' },
                ...iconOptions.filter((option) => option.value !== 'all'),
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Button
        css={cssObj.addButton}
        size="small"
        onClick={handleSubmit}
        disabled={!name.trim() || !titleName.trim() || !linkUrl.trim() || isSaving}
      >
        생성 및 추가
      </Button>
    </div>
  );
};

export function OebuLinkSelector({
  jojikNanoId,
  isAuthenticated,
  maxSelectable,
  onComplete,
  buttonLabel = '외부 링크를 선택하세요',
}: OebuLinkSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listView = useOebuLinkListViewSections({ jojikNanoId, isAuthenticated });
  const {
    listSectionProps,
    settingsSectionProps,
    sortOptions,
    iconFilterOptions,
  }: UseOebuLinkListViewSectionsResult = listView;

  const selectedLinks = settingsSectionProps.selectedLinks;

  const applyLimit = useCallback(
    (links: OebuLinkListItem[]) => links.slice(0, Math.max(maxSelectable, 0)),
    [maxSelectable],
  );

  const handleSelectedChange = useCallback(
    (links: OebuLinkListItem[]) => {
      const limited = applyLimit(links);
      listSectionProps.handlers.onSelectedLinksChange(limited);
    },
    [applyLimit, listSectionProps.handlers],
  );

  const handleModalComplete = () => {
    onComplete(applyLimit(selectedLinks));
    setIsModalOpen(false);
  };

  const handleCreated = useCallback(
    async (created: OebuLinkListItem) => {
      await settingsSectionProps.onAfterMutation?.();
      const combined = applyLimit([created, ...settingsSectionProps.selectedLinks]);
      handleSelectedChange(combined);
    },
    [applyLimit, handleSelectedChange, settingsSectionProps],
  );

  const summaryContent = (
    <div css={cssObj.selectionSummary}>
      <div css={cssObj.selectionHeader}>
        <h3 css={cssObj.selectionTitle}>외부 링크 {maxSelectable}개 선택</h3>
      </div>
      {selectedLinks.length ? (
        <div css={cssObj.selectionList}>
          {selectedLinks.map((link) => (
            <div key={link.nanoId} css={cssObj.selectionItem}>
              <span css={cssObj.selectionName}>{link.name}</span>
              <span css={cssObj.selectionDetail}>{link.titleName}</span>
              <span css={cssObj.selectionDetail}>{link.linkUrl}</span>
            </div>
          ))}
        </div>
      ) : (
        <div />
      )}
    </div>
  );

  const menus: SelectorModalMenu[] = useMemo(
    () => [
      {
        id: 'create',
        label: '새로운 외부 링크 추가',
        content: (
          <CreateOebuLinkForm
            jojikNanoId={jojikNanoId}
            iconOptions={iconFilterOptions}
            onCreated={handleCreated}
            onAfterMutation={settingsSectionProps.onAfterMutation}
          />
        ),
      },
      {
        id: 'drive',
        label: '내 드라이브에서 선택',
        content: (
          <div css={cssObj.listViewContainer}>
            <OebuLinkListSection
              {...listSectionProps}
              handlers={{
                ...listSectionProps.handlers,
                onSelectedLinksChange: handleSelectedChange,
              }}
              sortOptions={sortOptions}
              iconFilterOptions={iconFilterOptions}
            />
          </div>
        ),
      },
    ],
    [
      handleCreated,
      handleSelectedChange,
      iconFilterOptions,
      jojikNanoId,
      listSectionProps,
      settingsSectionProps.onAfterMutation,
      sortOptions,
    ],
  );

  return (
    <>
      <button type="button" css={cssObj.triggerButton} onClick={() => setIsModalOpen(true)}>
        <span css={cssObj.triggerIcon}>
          <LinkOnIcon width={20} height={20} />
        </span>
        <span css={cssObj.triggerLabel}>{buttonLabel}</span>
        <span css={cssObj.triggerIcon}>
          <EditIcon width={20} height={20} />
        </span>
      </button>

      <SelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleModalComplete}
        title="외부 링크 선택"
        menus={menus}
        selectedCount={selectedLinks.length}
        selectionLimit={maxSelectable}
        summaryContent={summaryContent}
        disableComplete={selectedLinks.length === 0}
      />
    </>
  );
}
