'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useJojikQuery,
  useUpdateJojikMutation,
  useUpsertJojikAddressMutation,
  type JojikDetailResponse,
} from '@/domain/jojik/api';

import { cssObj } from './styles';

type BasicSettingsSectionProps = {
  jojikNanoId: string;
};

export function BasicSettingsSection({ jojikNanoId }: BasicSettingsSectionProps) {
  const queryClient = useQueryClient();
  const updateJojikMutation = useUpdateJojikMutation(jojikNanoId);
  const upsertJojikAddressMutation = useUpsertJojikAddressMutation(jojikNanoId);

  const jojikQuery = useJojikQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
    onSuccess: (jojikData) => {
      setName(jojikData.name ?? '');
      setIntro(jojikData.intro ?? '');
      setAddress(formatJojikAddress(jojikData));
      setFeedback(null);
      setAddressFeedback(null);
    },
  });

  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [address, setAddress] = useState('');
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error'; message: string }>(
    null,
  );
  const [addressFeedback, setAddressFeedback] = useState<
    null | { type: 'success' | 'error'; message: string }
  >(null);

  const { data: jojik, error } = jojikQuery;

  const trimmedName = name.trim();
  const trimmedIntro = intro.trim();
  const trimmedAddress = address.trim();

  const isDirty = useMemo(() => {
    if (!jojik) return trimmedName.length > 0 || trimmedIntro.length > 0;
    return trimmedName !== (jojik.name ?? '') || trimmedIntro !== (jojik.intro ?? '');
  }, [jojik, trimmedIntro, trimmedName]);

  const isAddressDirty = useMemo(() => {
    if (!jojik) return trimmedAddress.length > 0;
    return trimmedAddress !== formatJojikAddress(jojik);
  }, [jojik, trimmedAddress]);

  const isValid = trimmedName.length > 0;
  const isAddressValid = trimmedAddress.length > 0;

  const handleSave = () => {
    if (!isDirty || !isValid) return;
    updateJojikMutation.mutate(
      { name: trimmedName, intro: trimmedIntro },
      {
        onSuccess: async (data) => {
          setFeedback({ type: 'success', message: '조직 기본 설정이 저장되었습니다.' });
          setName(data.name ?? trimmedName);
          setIntro(data.intro ?? trimmedIntro);
          await queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
        onError: () => {
          setFeedback({ type: 'error', message: '저장에 실패했습니다. 다시 시도해주세요.' });
        },
      },
    );
  };

  const handleAddressSave = () => {
    if (!isAddressDirty || !isAddressValid) return;

    upsertJojikAddressMutation.mutate(
      { address: trimmedAddress },
      {
        onSuccess: async () => {
          setAddressFeedback({ type: 'success', message: '조직 주소가 저장되었습니다.' });
          setAddress(trimmedAddress);
          await queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
        onError: () => {
          setAddressFeedback({ type: 'error', message: '주소 저장에 실패했습니다. 다시 시도해주세요.' });
        },
      },
    );
  };

  const isSaving = updateJojikMutation.isPending;
  const isAddressSaving = upsertJojikAddressMutation.isPending;

  return (
    <section css={cssObj.card}>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>조직 기본 설정</h2>
        </div>
      </div>

      <div css={cssObj.cardBody}>
        {error ? <p css={cssObj.errorText}>조직 정보를 불러오지 못했습니다.</p> : null}
        <Textfield
          label="조직 이름"
          helperText="30자 내의 조직 이름을 입력해주세요"
          maxLength={30}
          value={name}
          onValueChange={(value) => {
            setFeedback(null);
            setName(value);
          }}
          singleLine
        />
        <Textfield
          label="조직 소개"
          placeholder="조직 소개를 입력하세요"
          maxLength={100}
          value={intro}
          onValueChange={(value) => {
            setFeedback(null);
            setIntro(value);
          }}
        />
        <div css={cssObj.cardFooter}>
          {feedback ? (
            <span css={feedback.type === 'error' ? cssObj.feedback.error : cssObj.feedback.success}>
              {feedback.message}
            </span>
          ) : (
            <span css={cssObj.statusText}>조직 이름과 소개를 수정한 후 저장하세요.</span>
          )}
          <Button
            size="small"
            styleType="filled"
            disabled={!isDirty || !isValid || isSaving}
            onClick={handleSave}
            isLoading={isSaving}
          >
            저장
          </Button>
        </div>

        <Textfield
          label="조직 주소"
          placeholder="조직 주소를 입력하세요"
          value={address}
          onValueChange={(value) => {
            setAddressFeedback(null);
            setAddress(value);
          }}
          helperText="조직 주소를 입력하고 저장을 눌러 반영하세요."
        />
        <div css={cssObj.cardFooter}>
          {addressFeedback ? (
            <span
              css={
                addressFeedback.type === 'error' ? cssObj.feedback.error : cssObj.feedback.success
              }
            >
              {addressFeedback.message}
            </span>
          ) : (
            <span css={cssObj.statusText}>조직 주소를 입력하고 저장하세요.</span>
          )}
          <Button
            size="small"
            styleType="filled"
            disabled={!isAddressDirty || !isAddressValid || isAddressSaving}
            onClick={handleAddressSave}
            isLoading={isAddressSaving}
          >
            저장
          </Button>
        </div>
      </div>
    </section>
  );
}

const formatJojikAddress = (jojik?: JojikDetailResponse) => {
  const base = jojik?.juso?.juso ?? '';
  const detail = jojik?.juso?.jusoDetail ?? '';
  return [base, detail].filter(Boolean).join(' ').trim();
};
