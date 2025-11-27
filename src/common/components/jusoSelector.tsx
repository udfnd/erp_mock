'use client';

import { useCallback, useMemo, useState } from 'react';

import { Button } from './Button';
import { SelectorModal, type SelectorModalMenu } from './selectorModal';
import { Textfield } from './Textfield';
import { cssObj } from './jusoSelector.style';
import { EditIcon, LocationIcon } from '@/common/icons';
import type { JusoListItem } from '@/domain/juso/api';
import { useCreateJusoMutation } from '@/domain/juso/api';
import {
  JusoListSection,
  type UseJusoListViewSectionsResult,
  useJusoListViewSections,
} from '@/domain/juso/section';
import { useDaumPostcode } from '@/domain/juso/section/ListView/JusoRightsidePanels/components/useDaumPostcode';

export type JusoSelectorProps = {
  jojikNanoId: string;
  isAuthenticated: boolean;
  maxSelectable: number;
  onComplete: (selected: JusoListItem[]) => void;
  buttonLabel?: string;
};

const createSelectableJuso = (payload: {
  nanoId: string;
  jusoName: string;
  juso: string;
  jusoDetail: string;
}): JusoListItem => ({
  ...payload,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: '',
  updatedBy: '',
});

type CreateFormProps = {
  jojikNanoId: string;
  onCreated: (juso: JusoListItem) => void;
  onAfterMutation?: () => Promise<unknown> | void;
};

const CreateJusoForm = ({ jojikNanoId, onCreated, onAfterMutation }: CreateFormProps) => {
  const createMutation = useCreateJusoMutation();
  const { openPostcode } = useDaumPostcode();
  const [jusoName, setJusoName] = useState('');
  const [jusoDetail, setJusoDetail] = useState('');
  const [juso, setJuso] = useState('');

  const isSaving = createMutation.isPending;

  const handleSubmit = async () => {
    if (!jusoName.trim() || !juso.trim()) return;

    const response = await createMutation.mutateAsync({
      jusoName: jusoName.trim(),
      jusoDetail: jusoDetail.trim(),
      juso: juso.trim(),
      jojikNanoId,
    });

    const newJuso = createSelectableJuso(response);
    onCreated(newJuso);
    setJusoName('');
    setJusoDetail('');
    setJuso('');
    await onAfterMutation?.();
  };

  const handleOpenAddressSearch = () => {
    openPostcode((data) => {
      const detail = [data.bname, data.buildingName].filter(Boolean).join(' ');
      setJuso(data.address);
      setJusoDetail(detail);
    });
  };

  return (
    <div css={cssObj.formContainer}>
      <Textfield
        singleLine
        required
        label="주소 이름"
        placeholder="주소 이름을 입력하세요"
        value={jusoName}
        onValueChange={setJusoName}
        maxLength={80}
      />
      <Textfield
        singleLine
        required
        label="주소"
        placeholder="주소를 입력해 주세요"
        value={juso}
        onValueChange={setJuso}
        onClick={handleOpenAddressSearch}
        readOnly
      />
      <Textfield
        singleLine
        label="상세 주소"
        placeholder="상세 주소를 입력하세요"
        value={jusoDetail}
        onValueChange={setJusoDetail}
      />
      <Button onClick={handleSubmit} disabled={!jusoName.trim() || !juso.trim() || isSaving}>
        새 주소 추가
      </Button>
    </div>
  );
};

export function JusoSelector({
  jojikNanoId,
  isAuthenticated,
  maxSelectable,
  onComplete,
  buttonLabel = '조직 주소를 입력하세요',
}: JusoSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listView = useJusoListViewSections({ jojikNanoId, isAuthenticated });
  const {
    listSectionProps,
    settingsSectionProps,
    sortOptions,
    pageSizeOptions,
  }: UseJusoListViewSectionsResult = listView;

  const selectedJusos = settingsSectionProps.selectedJusos;

  const applyLimit = useCallback(
    (jusos: JusoListItem[]) => jusos.slice(0, Math.max(maxSelectable, 0)),
    [maxSelectable],
  );

  const handleSelectedChange = useCallback(
    (jusos: JusoListItem[]) => {
      const limited = applyLimit(jusos);
      listSectionProps.handlers.onSelectedJusosChange(limited);
    },
    [applyLimit, listSectionProps.handlers],
  );

  const handleModalComplete = () => {
    onComplete(applyLimit(selectedJusos));
    setIsModalOpen(false);
  };

  const handleCreated = useCallback(
    async (created: JusoListItem) => {
      await settingsSectionProps.onAfterMutation?.();
      const combined = applyLimit([created, ...settingsSectionProps.selectedJusos]);
      handleSelectedChange(combined);
    },
    [applyLimit, handleSelectedChange, settingsSectionProps],
  );

  const summaryContent = (
    <div css={cssObj.selectionSummary}>
      <div css={cssObj.selectionHeader}>
        <h3 css={cssObj.selectionTitle}>선택된 주소</h3>
        <span css={cssObj.selectionCount}>
          {selectedJusos.length}/{maxSelectable}
        </span>
      </div>
      {selectedJusos.length ? (
        <div css={cssObj.selectionList}>
          {selectedJusos.map((juso) => (
            <div key={juso.nanoId} css={cssObj.selectionItem}>
              <span css={cssObj.selectionName}>{juso.jusoName}</span>
              <span css={cssObj.selectionAddress}>{juso.juso}</span>
              {juso.jusoDetail ? <span css={cssObj.selectionAddress}>{juso.jusoDetail}</span> : null}
            </div>
          ))}
        </div>
      ) : (
        <p css={cssObj.emptyState}>아직 선택된 주소가 없습니다.</p>
      )}
    </div>
  );

  const menus: SelectorModalMenu[] = useMemo(
    () => [
      {
        id: 'create',
        label: '새로운 주소 추가',
        content: (
          <CreateJusoForm
            jojikNanoId={jojikNanoId}
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
            <JusoListSection
              {...listSectionProps}
              handlers={{ ...listSectionProps.handlers, onSelectedJusosChange: handleSelectedChange }}
              sortOptions={sortOptions}
              pageSizeOptions={pageSizeOptions}
            />
          </div>
        ),
      },
    ],
    [
      handleCreated,
      handleSelectedChange,
      jojikNanoId,
      listSectionProps,
      pageSizeOptions,
      settingsSectionProps.onAfterMutation,
      sortOptions,
    ],
  );

  return (
    <>
      <button type="button" css={cssObj.triggerButton} onClick={() => setIsModalOpen(true)}>
        <span css={cssObj.triggerIcon}>
          <LocationIcon width={20} height={20} />
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
        title="주소 선택"
        menus={menus}
        selectedCount={selectedJusos.length}
        selectionLimit={maxSelectable}
        summaryContent={summaryContent}
        disableComplete={selectedJusos.length === 0}
      />
    </>
  );
}
