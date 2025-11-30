'use client';

import { type FormEvent, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import { useCreateJusoMutation } from '@/domain/juso/api';

import { cssObj } from '../../styles';
import { useDaumPostcode } from './useDaumPostcode';
import { PlusIcon } from '@/common/icons';

type CreateJusoPanelProps = {
  jojikNanoId: string;
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

export function CreateJusoPanel({ jojikNanoId, onExit, onAfterMutation }: CreateJusoPanelProps) {
  const createMutation = useCreateJusoMutation();
  const { openPostcode } = useDaumPostcode();
  const [jusoName, setJusoName] = useState('');
  const [jusoDetail, setJusoDetail] = useState('');
  const [juso, setJuso] = useState('');

  const isSaving = createMutation.isPending;
  const formId = 'juso-create-form';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!jusoName.trim() || !juso.trim()) {
      return;
    }

    await createMutation.mutateAsync({
      jusoName: jusoName.trim(),
      jusoDetail: jusoDetail.trim(),
      juso: juso.trim(),
      jojikNanoId,
    });

    setJusoName('');
    setJusoDetail('');
    setJuso('');
    onAfterMutation();
    onExit?.();
  };

  const handleOpenAddressSearch = () => {
    openPostcode((data) => {
      const detail = [data.bname, data.buildingName].filter(Boolean).join(' ');
      setJuso(data.address);
      setJusoDetail(detail);
    });
  };

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>주소 생성</h2>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <p css={cssObj.panelSubtitle}>주소 기본 속성</p>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            label="주소 이름(별명)"
            placeholder="주소 이름(별명)을 입력해 주세요"
            helperText="이름은 최대 30자까지 입력 가능합니다."
            value={jusoName}
            onValueChange={setJusoName}
            maxLength={30}
          />
        </div>
        <div css={cssObj.panelJusoInputSection}>
          <Textfield
            singleLine
            label="주소 입력"
            placeholder="주소를 검색해 주세요."
            value={juso}
            onValueChange={setJuso}
            onClick={handleOpenAddressSearch}
            readOnly
          />
          <Textfield
            singleLine
            placeholder="상세 주소를 입력해 주세요. (선택)"
            value={jusoDetail}
            onValueChange={setJusoDetail}
          />
        </div>
      </form>
      <div css={cssObj.panelFooter}>
        <Button
          size="small"
          type="submit"
          form={formId}
          disabled={!jusoName.trim() || !juso.trim() || isSaving}
          isFull
          iconRight={<PlusIcon />}
        >
          주소 생성하기
        </Button>
      </div>
    </>
  );
}
