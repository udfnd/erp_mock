'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import { useGigwanQuery, useUpdateGigwanMutation } from '@/domain/gigwan/api';

import { css } from './styles';
import { type FeedbackState } from './types';

type BasicInformationSectionProps = {
  gigwanNanoId: string;
};

type BasicInformationFormValues = {
  name: string;
  intro: string;
};

type BasicInformationDefaults = BasicInformationFormValues;

export function BasicInformationSection({ gigwanNanoId }: BasicInformationSectionProps) {
  const queryClient = useQueryClient();
  const { data: gigwan } = useGigwanQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });
  const updateMutation = useUpdateGigwanMutation(gigwanNanoId);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const defaultsRef = useRef<BasicInformationDefaults>({ name: '', intro: '' });

  const form = useForm<BasicInformationFormValues>({
    defaultValues: defaultsRef.current,
    onSubmit: async ({ value }) => {
      const trimmedName = value.name.trim();
      const trimmedIntro = value.intro.trim();

      const payload: { name?: string; intro?: string } = {};
      if (trimmedName !== defaultsRef.current.name) payload.name = trimmedName;
      if (trimmedIntro !== defaultsRef.current.intro) payload.intro = trimmedIntro;
      if (Object.keys(payload).length === 0) return;

      try {
        await updateMutation.mutateAsync(payload);
        const nextDefaults: BasicInformationDefaults = {
          name: trimmedName,
          intro: trimmedIntro,
        };
        defaultsRef.current = nextDefaults;
        form.reset(nextDefaults);
        setFeedback({ type: 'success', message: '변경사항이 저장되었습니다.' });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] }),
          queryClient.invalidateQueries({ queryKey: ['gigwanName', gigwanNanoId] }),
        ]);
      } catch {
        setFeedback({ type: 'error', message: '저장에 실패했습니다. 다시 시도해주세요.' });
      }
    },
  });

  useEffect(() => {
    if (!gigwan) return;

    const nextDefaults: BasicInformationDefaults = {
      name: gigwan.name ?? '',
      intro: gigwan.intro ?? '',
    };

    defaultsRef.current = nextDefaults;
    form.reset(nextDefaults);
    setFeedback(null);
  }, [gigwan, form]);

  const { isDirty, nameMeta, introMeta } = useStore(form.store, (state) => ({
    isDirty: state.isDirty,
    nameMeta: state.fieldMeta?.name ?? { errors: [] as string[] },
    introMeta: state.fieldMeta?.intro ?? { errors: [] as string[] },
  }));

  const hasErrors = useMemo(
    () => (nameMeta.errors?.length ?? 0) > 0 || (introMeta.errors?.length ?? 0) > 0,
    [nameMeta.errors, introMeta.errors],
  );

  const canSave = isDirty && !hasErrors && !updateMutation.isPending;

  const handleSave = useCallback(async () => {
    setFeedback(null);
    await form.handleSubmit();
  }, [form]);

  return (
    <section css={css.card}>
      <div css={css.cardHeader}>
        <div css={css.cardTitleGroup}>
          <h2 css={css.cardTitle}>기관 기본 설정</h2>
        </div>
      </div>

      <div css={css.cardBody}>
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }: { value: string }) => {
              const v = value.trim();
              if (v.length === 0) return '이름은 필수입니다.';
              if (v.length > 30) return '30자 이내로 입력하세요.';
              return undefined;
            },
          }}
        >
          {(field) => {
            const error = field.state.meta.errors?.[0];
            return (
              <Textfield
                id={`gigwan-${gigwanNanoId}-name`}
                label="기관 이름"
                placeholder="기관 이름을 입력하세요"
                value={field.state.value}
                onValueChange={(v) => {
                  setFeedback(null);
                  field.handleChange(v);
                }}
                onBlur={field.handleBlur}
                maxLength={30}
                helperText={error ?? '30자 이내의 기관 이름을 입력해 주세요.'}
                singleLine
              />
            );
          }}
        </form.Field>

        <form.Field
          name="intro"
          validators={{
            onChange: ({ value }: { value: string }) => {
              const v = value.trim();
              if (v.length === 0) return '소개는 필수입니다.';
              if (v.length > 100) return '최대 100자';
              return undefined;
            },
          }}
        >
          {(field) => {
            const error = field.state.meta.errors?.[0];
            return (
              <Textfield
                id={`gigwan-${gigwanNanoId}-intro`}
                label="기관 소개"
                placeholder="기관의 특징이나 안내 문구를 입력하세요"
                value={field.state.value}
                onValueChange={(v) => {
                  setFeedback(null);
                  field.handleChange(v);
                }}
                onBlur={field.handleBlur}
                rows={4}
                maxLength={100}
                helperText={error ?? '최대 100자'}
              />
            );
          }}
        </form.Field>

        <div css={css.cardFooter}>
          {feedback ? (
            <span css={css.feedback[feedback.type]}>{feedback.message}</span>
          ) : null}
          <Button
            size="small"
            styleType="solid"
            variant="primary"
            disabled={!canSave}
            onClick={handleSave}
          >
            {updateMutation.isPending ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </section>
  );
}
