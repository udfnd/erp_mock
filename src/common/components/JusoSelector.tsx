'use client';

import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Button } from './Button';
import { SelectorModal, type SelectorModalMenu } from './selectorModal';
import { Textfield } from './Textfield';
import { cssObj } from './JusoSelector.style';
import { LocationIcon, SearchIcon, XCircleBlackIcon } from '@/common/icons';
import type { JusoListItem } from '@/domain/juso/api';
import { useCreateJusoMutation } from '@/domain/juso/api';
import {
  JusoListSection,
  type UseJusoListViewSectionsResult,
  useJusoListViewSections,
} from '@/domain/juso/section';
import { useDaumPostcode } from '@/domain/juso/section/ListView/JusoRightsidePanels/components/useDaumPostcode';
import { useAuth } from '@/global/auth';

export type JusoSelectorProps = {
  jojikNanoId: string;
  maxSelectable: number;
  onComplete: (selected: JusoListItem[]) => void;
  buttonLabel?: string;
  onClear?: () => void;
  value?: JusoListItem[];
  onValueChange?: (selected: JusoListItem[]) => void;
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
      <div css={cssObj.textfieldContainer}>
        <h3 css={cssObj.formTitle}>주소 정보</h3>
        <Textfield
          singleLine
          required
          label="주소 이름(별명)"
          placeholder="주소 이름(별명)을 입력하세요"
          helperText="이름은 최대 30자까지 입력 가능합니다."
          value={jusoName}
          onValueChange={setJusoName}
          maxLength={30}
        />
        <br />
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
          placeholder="상세 주소를 입력해주세요 (선택)"
          value={jusoDetail}
          onValueChange={setJusoDetail}
        />
      </div>
      <Button
        css={cssObj.addButton}
        size="small"
        onClick={handleSubmit}
        disabled={!jusoName.trim() || !juso.trim() || isSaving}
      >
        생성 및 추가
      </Button>
    </div>
  );
};

export function JusoSelector({
  jojikNanoId,
  maxSelectable,
  onComplete,
  buttonLabel = '조직 주소를 입력하세요',
  onClear,
  value,
  onValueChange,
}: JusoSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const listView = useJusoListViewSections({ jojikNanoId, isAuthenticated });
  const { listSectionProps, settingsSectionProps, sortOptions }: UseJusoListViewSectionsResult =
    listView;

  const selectedJusos = settingsSectionProps.selectedJusos;

  const applyLimit = useCallback(
    (jusos: JusoListItem[]) => jusos.slice(0, Math.max(maxSelectable, 0)),
    [maxSelectable],
  );

  useEffect(() => {
    if (value === undefined) return;
    const limited = applyLimit(value);
    listSectionProps.handlers.onSelectedJusosChange(limited);
  }, [applyLimit, listSectionProps.handlers, value]);

  const handleSelectedChange = useCallback(
    (jusos: JusoListItem[]) => {
      const limited = applyLimit(jusos);
      listSectionProps.handlers.onSelectedJusosChange(limited);
      onValueChange?.(limited);
    },
    [applyLimit, listSectionProps.handlers, onValueChange],
  );

  const handleClearSelection = useCallback(() => {
    handleSelectedChange([]);
    onClear?.();
  }, [handleSelectedChange, onClear]);

  const handleClearClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      handleClearSelection();
    },
    [handleClearSelection],
  );

  const handleClearKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      handleClearSelection();
    },
    [handleClearSelection],
  );

  const handleModalComplete = () => {
    onComplete(applyLimit(selectedJusos));
    setIsModalOpen(false);
  };

  const handleRemoveSelected = useCallback(
    (nanoId: string) => {
      const filtered = selectedJusos.filter((juso) => juso.nanoId !== nanoId);
      handleSelectedChange(filtered);
    },
    [handleSelectedChange, selectedJusos],
  );

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
        <h3 css={cssObj.selectionTitle}>주소 {maxSelectable}개 선택</h3>
      </div>
      {selectedJusos.length ? (
        <div css={cssObj.selectionList}>
          {selectedJusos.map((juso) => (
            <div key={juso.nanoId} css={cssObj.selectionItem}>
              <div css={cssObj.selectionTextGroup}>
                <span css={cssObj.selectionName}>{juso.jusoName}</span>
                <span css={cssObj.selectionAddress}>
                  {juso.juso} {juso.jusoDetail ? juso.jusoDetail : ''}
                </span>
              </div>
              <button
                type="button"
                css={cssObj.selectionRemoveButton}
                onClick={() => handleRemoveSelected(juso.nanoId)}
                aria-label={`${juso.jusoName} 선택 해제`}
              >
                <XCircleBlackIcon width={20} height={20} />
              </button>
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
              handlers={{
                ...listSectionProps.handlers,
                onSelectedJusosChange: handleSelectedChange,
              }}
              sortOptions={sortOptions}
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
      settingsSectionProps.onAfterMutation,
      sortOptions,
    ],
  );

  return (
    <>
      <div css={cssObj.triggerRow}>
        <div css={cssObj.triggerButton}>
          <span css={cssObj.triggerIcon}>
            <LocationIcon width={20} height={20} />
          </span>
          <p css={cssObj.triggerLabel}>{buttonLabel}</p>
          <span css={cssObj.triggerActions}>
            <span
              role="button"
              tabIndex={0}
              css={cssObj.clearIcon}
              onClick={handleClearClick}
              onKeyDown={handleClearKeyDown}
              aria-label="주소 선택 초기화"
            >
              <XCircleBlackIcon width={20} height={20} />
            </span>
          </span>
        </div>
        <button type="button" css={cssObj.searchButton} onClick={() => setIsModalOpen(true)}>
          주소 검색
          <SearchIcon width={12} height={12} />
        </button>
      </div>

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
