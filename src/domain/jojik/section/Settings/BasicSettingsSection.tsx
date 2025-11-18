'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { Button, Chip, Textfield } from '@/common/components';
import { useJojikQuery, useUpdateJojikMutation } from '@/domain/jojik/api';

import { cssObj } from './styles';

type BasicSettingsSectionProps = {
  jojikNanoId: string;
};

export function BasicSettingsSection({ jojikNanoId }: BasicSettingsSectionProps) {
  const queryClient = useQueryClient();
  const updateJojikMutation = useUpdateJojikMutation(jojikNanoId);
  const jojikQuery = useJojikQuery(jojikNanoId, { enabled: Boolean(jojikNanoId) });

  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error'; message: string }>(null);

  const { data: jojik, isLoading, isFetching, error } = jojikQuery;

  useEffect(() => {
    if (!jojik) return;
    setName(jojik.name ?? '');
    setIntro(jojik.intro ?? '');
    setFeedback(null);
  }, [jojik]);

  const trimmedName = name.trim();
  const trimmedIntro = intro.trim();

  const isDirty = useMemo(() => {
    if (!jojik) return trimmedName.length > 0 || trimmedIntro.length > 0;
    return trimmedName !== (jojik.name ?? '') || trimmedIntro !== (jojik.intro ?? '');
  }, [jojik, trimmedIntro, trimmedName]);

  const isValid = trimmedName.length > 0;

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

  const isSaving = updateJojikMutation.isPending;

  return (
    <section css={cssObj.card}>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>조직 기본 설정</h2>
          <p css={cssObj.cardSubtitle}>조직 이름과 소개를 관리할 수 있습니다.</p>
        </div>
        <Chip size="sm" variant="outlined" disabled>
          조직 코드 {jojikNanoId}
        </Chip>
      </div>

      <div css={cssObj.cardBody}>
        {error ? <p css={cssObj.errorText}>조직 정보를 불러오지 못했습니다.</p> : null}
        <Textfield
          label="조직 이름"
          placeholder="30자 내의 조직 이름을 입력해주세요"
          required
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
      </div>
      <footer css={cssObj.cardFooter}>
        {feedback ? (
          <span css={cssObj.feedback[feedback.type]}>{feedback.message}</span>
        ) : (
          <span css={cssObj.statusText}>
            {isLoading || isFetching ? '조직 정보를 불러오는 중입니다.' : '조직 이름과 소개를 수정할 수 있습니다.'}
          </span>
        )}
        <Button
          size="small"
          styleType="solid"
          variant="primary"
          disabled={!isDirty || !isValid || isSaving}
          onClick={handleSave}
        >
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </section>
  );
}
