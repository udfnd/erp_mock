'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';

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

  const [nameFeedback, setNameFeedback] = useState<FeedbackState>(null);
  const [introFeedback, setIntroFeedback] = useState<FeedbackState>(null);

  const nameForm = useForm({
    defaultValues: { name: '' },
    validators: {
      onChange: ({ value }) =>
        value.name.trim().length === 0 ? '기관 이름을 입력해주세요.' : undefined,
    },
    onSubmit: async ({ value, formApi }) => {
      const trimmed = value.name.trim();
      if (!trimmed) return;

      try {
        await updateNameMutation.mutateAsync({ name: trimmed });
        setNameFeedback({ type: 'success', message: '이름이 저장되었습니다.' });
        formApi.reset({ name: trimmed });
        await queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] });
      } catch {
        setNameFeedback({ type: 'error', message: '이름 저장에 실패했습니다. 다시 시도해주세요.' });
      }
    },
  });

  const introForm = useForm({
    defaultValues: { intro: '' },
    validators: {
      onChange: ({ value }) =>
        value.intro.trim().length === 0 ? '기관 소개를 입력해주세요.' : undefined,
    },
    onSubmit: async ({ value, formApi }) => {
      const trimmed = value.intro.trim();
      if (!trimmed) return;

      try {
        await updateIntroMutation.mutateAsync({ intro: trimmed });
        setIntroFeedback({ type: 'success', message: '소개가 저장되었습니다.' });
        formApi.reset({ intro: trimmed });
        await queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] });
      } catch {
        setIntroFeedback({ type: 'error', message: '소개 저장에 실패했습니다. 다시 시도해주세요.' });
      }
    },
  });

  useEffect(() => {
    if (!gigwan) return;

    nameForm.reset({ name: gigwan.name ?? '' });
    introForm.reset({ intro: gigwan.intro ?? '' });
    setNameFeedback(null);
    setIntroFeedback(null);
  }, [gigwan, introForm, nameForm]);

  const nameMeta = nameForm.getFieldMeta('name');
  const introMeta = introForm.getFieldMeta('intro');

  return (
    <section css={styles.card}>
      <div css={styles.cardHeader}>
        <div css={styles.cardTitleGroup}>
          <h2 css={styles.cardTitle}>기관 기본 설정</h2>
        </div>
      </div>

      <div css={styles.cardBody}>
        <nameForm.Field name="name">
          {(field) => {
            const error = field.state.meta.errors[0] as string | undefined;
            return (
              <LabeledInput
                label="기관 이름"
                placeholder="기관 이름을 입력하세요"
                value={field.state.value}
                onValueChange={(value) => {
                  setNameFeedback(null);
                  field.handleChange(value);
                }}
                onBlur={field.handleBlur}
                required
                maxLength={50}
                helperText={error ?? '50자 이내'}
                status={error ? 'error' : 'normal'}
              />
            );
          }}
        </nameForm.Field>
        <div css={styles.cardFooter}>
          {nameFeedback && (
            <span css={styles.feedback[nameFeedback.type]}>{nameFeedback.message}</span>
          )}
          <Button
            size="small"
            styleType="solid"
            variant="primary"
            disabled={
              !nameMeta?.isDirty ||
              !nameMeta?.isValid ||
              updateNameMutation.isPending ||
              nameForm.state.isSubmitting
            }
            onClick={() => {
              void nameForm.handleSubmit();
            }}
          >
            {updateNameMutation.isPending || nameForm.state.isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </div>

        <introForm.Field name="intro">
          {(field) => {
            const error = field.state.meta.errors[0] as string | undefined;
            return (
              <Textfield
                label="기관 소개"
                placeholder="기관의 특징이나 안내 문구를 입력하세요"
                value={field.state.value}
                onValueChange={(value) => {
                  setIntroFeedback(null);
                  field.handleChange(value);
                }}
                onBlur={field.handleBlur}
                rows={4}
                maxLength={300}
                helperText={error ?? '최대 300자'}
                status={error ? 'error' : 'normal'}
              />
            );
          }}
        </introForm.Field>
        <div css={styles.cardFooter}>
          {introFeedback && (
            <span css={styles.feedback[introFeedback.type]}>{introFeedback.message}</span>
          )}
          <Button
            size="small"
            styleType="solid"
            variant="primary"
            disabled={
              !introMeta?.isDirty ||
              !introMeta?.isValid ||
              updateIntroMutation.isPending ||
              introForm.state.isSubmitting
            }
            onClick={() => {
              void introForm.handleSubmit();
            }}
          >
            {updateIntroMutation.isPending || introForm.state.isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </section>
  );
}
