'use client';

import { type FormEvent, useMemo, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useCreateOebuLinkMutation,
  useDeleteOebuLinkMutation,
  useGetOebuLinkDetailQuery,
  useUpdateOebuLinkMutation,
} from '@/domain/oebu-link/api';

import { oebuLinkListViewCss } from './styles';
import type { OebuLinkSettingsSectionProps } from './useOebuLinkListViewSections';

function IconSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  const normalizedOptions = useMemo(
    () => [
      { label: '아이콘 없음', value: 'none' },
      ...options.filter((option) => option.value !== 'all'),
    ],
    [options],
  );

  return (
    <select
      css={oebuLinkListViewCss.toolbarSelect}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {normalizedOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type CreatePanelProps = {
  jojikNanoId: string;
  iconOptions: { label: string; value: string }[];
  onAfterMutation: () => Promise<unknown> | void;
  onExit?: () => void;
};

function CreateOebuLinkPanel({
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
      <div css={oebuLinkListViewCss.panelHeader}>
        <h2 css={oebuLinkListViewCss.panelTitle}>새 외부 링크 생성</h2>
        <p css={oebuLinkListViewCss.panelSubtitle}>선택된 조직에 새로운 외부 링크를 추가합니다.</p>
      </div>
      <form id={formId} css={oebuLinkListViewCss.panelBody} onSubmit={handleSubmit}>
        <div css={oebuLinkListViewCss.panelSection}>
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
        <div css={oebuLinkListViewCss.panelSection}>
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
        <div css={oebuLinkListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="링크 URL"
            placeholder="https://example.com"
            value={linkUrl}
            onValueChange={setLinkUrl}
          />
        </div>
        <div css={oebuLinkListViewCss.panelSection}>
          <label css={oebuLinkListViewCss.panelLabel}>아이콘</label>
          <IconSelect value={linkIconNanoId} onChange={setLinkIconNanoId} options={iconOptions} />
        </div>
        <div css={oebuLinkListViewCss.buttonRow}>
          {onExit && (
            <Button
              type="button"
              onClick={onExit}
              disabled={isSaving}
              size="medium"
              variant="secondary"
            >
              취소
            </Button>
          )}
          <Button type="submit" size="medium">
            저장
          </Button>
        </div>
      </form>
    </>
  );
}

type SingleSelectionPanelProps = {
  oebuLinkNanoId: string;
  oebuLinkName: string;
  iconOptions: { label: string; value: string }[];
  onAfterMutation: () => Promise<unknown> | void;
};

function SingleSelectionPanel({
  oebuLinkNanoId,
  oebuLinkName,
  iconOptions,
  onAfterMutation,
}: SingleSelectionPanelProps) {
  const { data: detailData } = useGetOebuLinkDetailQuery(oebuLinkNanoId, {
    enabled: Boolean(oebuLinkNanoId),
  });
  const updateMutation = useUpdateOebuLinkMutation(oebuLinkNanoId);
  const deleteMutation = useDeleteOebuLinkMutation(oebuLinkNanoId);

  // null = 아직 사용자가 직접 수정하지 않은 상태
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

    // 쿼리 refetch 후 detailData 값으로 다시 따라가도록 override 초기화
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
      <div css={oebuLinkListViewCss.panelHeader}>
        <h2 css={oebuLinkListViewCss.panelTitle}>외부 링크 상세</h2>
        <p css={oebuLinkListViewCss.panelSubtitle}>{oebuLinkName}</p>
      </div>
      <form id={formId} css={oebuLinkListViewCss.panelBody} onSubmit={handleSubmit}>
        <div css={oebuLinkListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="외부 링크 이름"
            value={currentName}
            onValueChange={(v) => setNameInput(v)}
            maxLength={100}
          />
        </div>
        <div css={oebuLinkListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="표시 이름"
            value={currentTitleName}
            onValueChange={(v) => setTitleNameInput(v)}
            maxLength={100}
          />
        </div>
        <div css={oebuLinkListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="링크 URL"
            value={currentLinkUrl}
            onValueChange={(v) => setLinkUrlInput(v)}
          />
        </div>
        <div css={oebuLinkListViewCss.panelSection}>
          <label css={oebuLinkListViewCss.panelLabel}>아이콘</label>
          <IconSelect
            value={currentIcon}
            onChange={(v) => setLinkIconInput(v)}
            options={iconOptions}
          />
        </div>
        <div css={oebuLinkListViewCss.buttonRow}>
          <Button type="submit" size="medium" disabled={isSaving}>
            저장
          </Button>
          <Button
            type="button"
            css={oebuLinkListViewCss.destructiveButton}
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

type MultiSelectionPanelProps = { oebuLinks: { nanoId: string; name: string }[] };

function MultiSelectionPanel({ oebuLinks }: MultiSelectionPanelProps) {
  return (
    <>
      <div css={oebuLinkListViewCss.panelHeader}>
        <h2 css={oebuLinkListViewCss.panelTitle}>여러 외부 링크 선택됨</h2>
        <p css={oebuLinkListViewCss.panelSubtitle}>
          선택된 항목 중 하나를 클릭하여 상세 정보를 확인하세요.
        </p>
      </div>
      <div css={oebuLinkListViewCss.panelBody}>
        <ul>
          {oebuLinks.map((link) => (
            <li key={link.nanoId}>{link.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function OebuLinkSettingsSection({
  jojikNanoId,
  selectedLinks,
  isCreating,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
  iconOptions,
}: OebuLinkSettingsSectionProps) {
  if (!jojikNanoId) {
    return (
      <aside css={oebuLinkListViewCss.settingsPanel}>
        <div css={oebuLinkListViewCss.panelHeader}>
          <h2 css={oebuLinkListViewCss.panelTitle}>조직이 선택되지 않았습니다</h2>
          <p css={oebuLinkListViewCss.panelSubtitle}>URL의 조직 식별자를 확인해 주세요.</p>
        </div>
        <div css={oebuLinkListViewCss.panelBody}>
          <p css={oebuLinkListViewCss.helperText}>
            조직 ID가 없으면 외부 링크 데이터를 불러올 수 없습니다.
          </p>
        </div>
      </aside>
    );
  }

  if (!isAuthenticated) {
    return (
      <aside css={oebuLinkListViewCss.settingsPanel}>
        <div css={oebuLinkListViewCss.panelHeader}>
          <h2 css={oebuLinkListViewCss.panelTitle}>로그인이 필요합니다</h2>
          <p css={oebuLinkListViewCss.panelSubtitle}>
            외부 링크를 보거나 수정하려면 인증이 필요합니다.
          </p>
        </div>
        <div css={oebuLinkListViewCss.panelBody}>
          <p css={oebuLinkListViewCss.helperText}>로그인 후 다시 시도해 주세요.</p>
        </div>
      </aside>
    );
  }

  if (isCreating) {
    return (
      <aside css={oebuLinkListViewCss.settingsPanel}>
        <CreateOebuLinkPanel
          jojikNanoId={jojikNanoId}
          iconOptions={iconOptions}
          onAfterMutation={onAfterMutation}
          onExit={isCreating ? onExitCreate : undefined}
        />
      </aside>
    );
  }

  if (selectedLinks.length === 0) {
    return (
      <aside css={oebuLinkListViewCss.settingsPanel}>
        <div css={oebuLinkListViewCss.panelHeader}>
          <h2 css={oebuLinkListViewCss.panelTitle}>외부 링크를 선택해 주세요</h2>
          <p css={oebuLinkListViewCss.panelSubtitle}>
            목록에서 항목을 선택하거나 상단의 추가 버튼으로 새 외부 링크를 만들어 보세요.
          </p>
        </div>
        <div css={oebuLinkListViewCss.panelBody}>
          <p css={oebuLinkListViewCss.helperText}>
            선택된 링크가 없어서 상세 정보를 표시할 수 없습니다.
          </p>
        </div>
      </aside>
    );
  }

  if (selectedLinks.length === 1) {
    const link = selectedLinks[0];
    return (
      <aside css={oebuLinkListViewCss.settingsPanel}>
        <SingleSelectionPanel
          key={link.nanoId}
          oebuLinkNanoId={link.nanoId}
          oebuLinkName={link.name}
          iconOptions={iconOptions}
          onAfterMutation={onAfterMutation}
        />
      </aside>
    );
  }

  return (
    <aside css={oebuLinkListViewCss.settingsPanel}>
      <MultiSelectionPanel oebuLinks={selectedLinks} />
    </aside>
  );
}
