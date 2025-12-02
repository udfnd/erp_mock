'use client';

import { useState } from 'react';

import { Button, Textfield } from '@/common/components';
import { useCreateJaewonsaengMutation } from '@/domain/jaewonsaeng/api';

import { cssObj } from '../../styles';

export type CreateJaewonsaengPanelProps = {
  jojikNanoId: string;
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

export const CreateJaewonsaengPanel = ({ jojikNanoId, onExit, onAfterMutation }: CreateJaewonsaengPanelProps) => {
  const createMutation = useCreateJaewonsaengMutation();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [jaewonCategorySangtaeNanoId, setJaewonCategorySangtaeNanoId] = useState('');
  const [boninName, setBoninName] = useState('');

  const handleSubmit = async () => {
    await createMutation.mutateAsync({
      jojikNanoId,
      jaewonsaengBonin: {
        name: boninName || name,
        birthDate: null,
        genderNanoId: '',
        phoneNumber: null,
        email: '',
        bigo: null,
      },
      jaewonsaengBohojas: [],
      jaewonsaeng: {
        jaewonCategorySangtaeNanoId,
        name,
        nickname: nickname || null,
      },
    });
    await onAfterMutation();
  };

  return (
    <div css={cssObj.panelBody}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>재원생 생성</h2>
        <p css={cssObj.helperText}>새로운 재원생을 등록합니다.</p>
      </div>
      <div css={cssObj.panelSection}>
        <span css={cssObj.panelLabel}>재원생 기본 정보</span>
        <Textfield value={name} placeholder="이름" onChange={(e) => setName(e.target.value)} />
        <Textfield
          value={nickname}
          placeholder="별명"
          onChange={(e) => setNickname(e.target.value)}
        />
        <Textfield
          value={jaewonCategorySangtaeNanoId}
          placeholder="재원 상태 카테고리 상태 nanoId"
          onChange={(e) => setJaewonCategorySangtaeNanoId(e.target.value)}
        />
      </div>
      <div css={cssObj.panelSection}>
        <span css={cssObj.panelLabel}>재원생 본인 정보</span>
        <Textfield
          value={boninName}
          placeholder="본인 이름"
          onChange={(e) => setBoninName(e.target.value)}
        />
      </div>
      <div css={cssObj.sectionActions}>
        <Button variant="secondary" onClick={onExit}>취소</Button>
        <Button
          variant="primary"
          styleType="solid"
          onClick={handleSubmit}
          disabled={!name || !jojikNanoId || createMutation.isPending}
        >
          {createMutation.isPending ? '생성 중...' : '생성하기'}
        </Button>
      </div>
    </div>
  );
};
