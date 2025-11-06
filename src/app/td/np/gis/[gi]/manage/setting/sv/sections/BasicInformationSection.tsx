'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, LabeledInput, Textfield } from '@/common/components';
import {
  useGigwanQuery,
  useUpdateGigwanIntroMutation,
  useUpdateGigwanNameMutation,
} from '@/domain/gigwan/api';

import * as styles from '../style';
import { FeedbackState } from './types';

type BasicInformationSectionProps = {
  gigwanNanoId: string;
};

export function BasicInformationSection({ gigwanNanoId }: BasicInformationSectionProps) {
  const queryClient = useQueryClient();

  const { data: gigwan } = useGigwanQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });
  const updateNameMutation = useUpdateGigwanNameMutation(gigwanNanoId);
  const updateIntroMutation = useUpdateGigwanIntroMutation(gigwanNanoId);

  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [nameFeedback, setNameFeedback] = useState<FeedbackState>(null);
  const [introFeedback, setIntroFeedback] = useState<FeedbackState>(null);

  useEffect(() => {
    if (!gigwan) return;

    setName(gigwan.name ?? '');
    setIntro(gigwan.intro ?? '');
    setNameFeedback(null);
    setIntroFeedback(null);
  }, [gigwan]);

  const nameDirty = useMemo(
    () => (gigwan ? name !== (gigwan.name ?? '') : name.trim().length > 0),
    [gigwan, name],
  );

  const introDirty = useMemo(
    () => (gigwan ? intro !== (gigwan.intro ?? '') : intro.trim().length > 0),
    [gigwan, intro],
  );

  const nameValid = name.trim().length > 0;
  const introValid = intro.trim().length > 0;

  const handleSaveName = useCallback(async () => {
    if (!nameDirty || !nameValid) return;

    try {
      await updateNameMutation.mutateAsync({ name: name.trim() });
      setNameFeedback({ type: 'success', message: '이름이 저장되었습니다.' });
      await queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] });
    } catch {
      setNameFeedback({ type: 'error', message: '이름 저장에 실패했습니다. 다시 시도해주세요.' });
    }
  }, [gigwanNanoId, name, nameDirty, nameValid, queryClient, updateNameMutation]);

  const handleSaveIntro = useCallback(async () => {
    if (!introDirty || !introValid) return;

    try {
      await updateIntroMutation.mutateAsync({ intro: intro.trim() });
      setIntroFeedback({ type: 'success', message: '소개가 저장되었습니다.' });
      await queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] });
    } catch {
      setIntroFeedback({ type: 'error', message: '소개 저장에 실패했습니다. 다시 시도해주세요.' });
    }
  }, [gigwanNanoId, intro, introDirty, introValid, queryClient, updateIntroMutation]);

  return (
    <section css={styles.card}>
      <div css={styles.cardHeader}>
        <div css={styles.cardTitleGroup}>
          <h2 css={styles.cardTitle}>기관 기본 설정</h2>
        </div>
      </div>

      <div css={styles.cardBody}>
        <LabeledInput
          label="기관 이름"
          placeholder="기관 이름을 입력하세요"
          value={name}
          onValueChange={setName}
          required
          maxLength={50}
          helperText="50자 이내"
        />
        <div css={styles.cardFooter}>
          {nameFeedback && (
            <span css={styles.feedback[nameFeedback.type]}>{nameFeedback.message}</span>
          )}
          <Button
            size="small"
            styleType="solid"
            variant="primary"
            disabled={!nameDirty || !nameValid || updateNameMutation.isPending}
            onClick={handleSaveName}
          >
            {updateNameMutation.isPending ? '저장 중...' : '저장'}
          </Button>
        </div>

        <Textfield
          label="기관 소개"
          placeholder="기관의 특징이나 안내 문구를 입력하세요"
          value={intro}
          onValueChange={setIntro}
          rows={4}
          maxLength={300}
          helperText="최대 300자"
        />
        <div css={styles.cardFooter}>
          {introFeedback && (
            <span css={styles.feedback[introFeedback.type]}>{introFeedback.message}</span>
          )}
          <Button
            size="small"
            styleType="solid"
            variant="primary"
            disabled={!introDirty || !introValid || updateIntroMutation.isPending}
            onClick={handleSaveIntro}
          >
            {updateIntroMutation.isPending ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </section>
  );
}
