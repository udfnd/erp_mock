'use client';

import { type FormEvent, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import { useCreateJusoMutation } from '@/domain/juso/api';

import { cssObj } from '../../styles';
import { useDaumPostcode } from './useDaumPostcode';

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
    <div>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>새 주소 추가</h2>
        <p css={cssObj.panelSubtitle}>선택된 조직에 새로운 주소를 생성합니다.</p>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="주소 이름"
            placeholder="주소 이름을 입력하세요"
            value={jusoName}
            onValueChange={setJusoName}
            maxLength={80}
          />
        </div>
        <div css={cssObj.panelSection}>
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
          <p css={cssObj.helperText}>
            주소 입력창을 클릭하면 카카오 주소 검색을 사용할 수 있습니다.
          </p>
        </div>
        {createMutation.isError ? (
          <p css={cssObj.helperText}>주소 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
        ) : null}
      </form>
      <div css={cssObj.panelFooter}>
        {onExit ? (
          <Button styleType="text" variant="secondary" onClick={onExit} disabled={isSaving}>
            취소
          </Button>
        ) : null}
        <Button type="submit" form={formId} disabled={!jusoName.trim() || !juso.trim() || isSaving}>
          주소 생성
        </Button>
      </div>
    </div>
  );
}
