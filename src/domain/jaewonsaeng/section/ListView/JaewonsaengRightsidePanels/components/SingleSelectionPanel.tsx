'use client';

import { useEffect, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  deleteJaewonsaengBohoja,
  updateJaewonsaengBohoja,
  useDeleteJaewonsaengMutation,
  useGetJaewonsaengOverallQuery,
  useUpdateJaewonsaengBoninMutation,
  useUpdateJaewonsaengMutation,
} from '@/domain/jaewonsaeng/api';

import { cssObj } from '../../styles';

export type SingleSelectionPanelProps = {
  jaewonsaengNanoId: string;
  jaewonsaengName: string;
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export const SingleSelectionPanel = ({
  jaewonsaengNanoId,
  jaewonsaengName,
  onAfterMutation,
  isAuthenticated,
}: SingleSelectionPanelProps) => {
  const { data, isLoading } = useGetJaewonsaengOverallQuery(jaewonsaengNanoId, {
    enabled: isAuthenticated && Boolean(jaewonsaengNanoId),
  });

  const updateJaewonsaeng = useUpdateJaewonsaengMutation(jaewonsaengNanoId);
  const updateBonin = useUpdateJaewonsaengBoninMutation(jaewonsaengNanoId);
  const deleteJaewonsaeng = useDeleteJaewonsaengMutation(jaewonsaengNanoId);

  const [name, setName] = useState(jaewonsaengName);
  const [nickname, setNickname] = useState('');
  const [jaewonCategorySangtaeNanoId, setJaewonCategorySangtaeNanoId] = useState('');
  const [isHwalseong, setIsHwalseong] = useState(true);
  const [boninName, setBoninName] = useState('');
  const [boninPhone, setBoninPhone] = useState('');
  const [boninEmail, setBoninEmail] = useState('');
  const [boninBigo, setBoninBigo] = useState('');
  const [bohojas, setBohojas] = useState(
    () => data?.jaewonsaengBohojas.map((b) => ({ ...b })) ?? [],
  );

  useEffect(() => {
    if (data) {
      setName(data.jaewonsaeng.name ?? jaewonsaengName);
      setNickname(data.jaewonsaeng.nickname ?? '');
      setJaewonCategorySangtaeNanoId(data.jaewonsaeng.jaewonCategorySangtaeNanoId ?? '');
      setIsHwalseong(data.jaewonsaeng.isHwalseong);
      setBoninName(data.jaewonsaengBonin.name ?? '');
      setBoninPhone(data.jaewonsaengBonin.phoneNumber ?? '');
      setBoninEmail(data.jaewonsaengBonin.emailAddress ?? '');
      setBoninBigo(data.jaewonsaengBonin.bigo ?? '');
      setBohojas(data.jaewonsaengBohojas.map((b) => ({ ...b })));
    }
  }, [data, jaewonsaengName]);

  if (isLoading && !data) {
    return (
      <div css={cssObj.panelBody}>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>{jaewonsaengName}</h2>
          <p css={cssObj.helperText}>선택한 재원생 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  const handleSaveBasic = async () => {
    await updateJaewonsaeng.mutateAsync({
      name,
      nickname: nickname || null,
      jaewonCategorySangtaeNanoId,
      isHwalseong,
    });
    await onAfterMutation();
  };

  const handleSaveBonin = async () => {
    await updateBonin.mutateAsync({
      name: boninName,
      phoneNumber: boninPhone,
      emailAddress: boninEmail,
      bigo: boninBigo,
    });
    await onAfterMutation();
  };

  const handleSaveBohoja = async (bohojaId: string, updates: Record<string, unknown>) => {
    await updateJaewonsaengBohoja(bohojaId, updates as any);
    await onAfterMutation();
  };

  const handleDeleteBohoja = async (bohojaId: string) => {
    await deleteJaewonsaengBohoja(bohojaId);
    await onAfterMutation();
  };

  const handleDeleteJaewonsaeng = async () => {
    await deleteJaewonsaeng.mutateAsync();
    await onAfterMutation();
  };

  const handleDeactivate = async () => {
    setIsHwalseong(false);
    await updateJaewonsaeng.mutateAsync({
      name,
      nickname: nickname || null,
      jaewonCategorySangtaeNanoId,
      isHwalseong: false,
    });
    await onAfterMutation();
  };

  return (
    <div css={cssObj.panelBody}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{name}</h2>
      </div>

      <div css={cssObj.panelSection}>
        <span css={cssObj.panelSubtitle}>재원생 기본 속성</span>
        <Textfield value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
        <Textfield
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="별명"
        />
        <Textfield
          value={jaewonCategorySangtaeNanoId}
          onChange={(e) => setJaewonCategorySangtaeNanoId(e.target.value)}
          placeholder="재원 상태 카테고리 상태 nanoId"
        />
        <label css={cssObj.panelLabel} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={isHwalseong}
            onChange={(e) => setIsHwalseong(e.target.checked)}
          />
          활성화
        </label>
        <div css={cssObj.sectionActions}>
          <Button variant="primary" styleType="solid" onClick={handleSaveBasic}>
            저장
          </Button>
        </div>
      </div>

      <div css={cssObj.panelSection}>
        <span css={cssObj.panelSubtitle}>재원생 본인 속성</span>
        <Textfield value={boninName} onChange={(e) => setBoninName(e.target.value)} placeholder="이름" />
        <Textfield value={boninPhone} onChange={(e) => setBoninPhone(e.target.value)} placeholder="전화번호" />
        <Textfield value={boninEmail} onChange={(e) => setBoninEmail(e.target.value)} placeholder="이메일" />
        <Textfield value={boninBigo} onChange={(e) => setBoninBigo(e.target.value)} placeholder="비고" />
        <div css={cssObj.sectionActions}>
          <Button variant="primary" styleType="solid" onClick={handleSaveBonin}>
            저장
          </Button>
        </div>
      </div>

      <div css={cssObj.panelSection}>
        <span css={cssObj.panelSubtitle}>보호자 속성</span>
        {bohojas.map((bohoja) => (
          <div key={bohoja.nanoId} css={cssObj.panelLabelSection}>
            <Textfield
              value={bohoja.gwangye}
              onChange={(e) =>
                setBohojas((prev) =>
                  prev.map((b) =>
                    b.nanoId === bohoja.nanoId ? { ...b, gwangye: e.target.value } : b,
                  ),
                )
              }
              placeholder="관계"
            />
            <Textfield
              value={bohoja.phoneNumber ?? ''}
              onChange={(e) =>
                setBohojas((prev) =>
                  prev.map((b) =>
                    b.nanoId === bohoja.nanoId ? { ...b, phoneNumber: e.target.value } : b,
                  ),
                )
              }
              placeholder="전화번호"
            />
            <Textfield
              value={bohoja.email ?? ''}
              onChange={(e) =>
                setBohojas((prev) =>
                  prev.map((b) => (b.nanoId === bohoja.nanoId ? { ...b, email: e.target.value } : b)),
                )
              }
              placeholder="이메일"
            />
            <div css={cssObj.sectionActions}>
              <Button
                variant="secondary"
                onClick={() =>
                  handleSaveBohoja(bohoja.nanoId, {
                    nanoId: bohoja.nanoId,
                    gwangye: bohoja.gwangye,
                    phoneNumber: bohoja.phoneNumber,
                    emailAddress: bohoja.email,
                    bigo: bohoja.bigo,
                  })
                }
              >
                수정
              </Button>
              <Button variant="secondary" onClick={() => handleDeleteBohoja(bohoja.nanoId)}>
                삭제
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div css={cssObj.panelFooter}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="secondary"
            onClick={handleDeactivate}
          >
            재원생 비활성화
          </Button>
          <Button
            variant="danger"
            styleType="solid"
            disabled={isHwalseong}
            onClick={handleDeleteJaewonsaeng}
          >
            재원생 삭제
          </Button>
        </div>
      </div>
    </div>
  );
};
