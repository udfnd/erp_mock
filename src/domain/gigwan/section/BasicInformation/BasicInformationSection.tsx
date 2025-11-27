'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useMemo, useRef, useEffect } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  invalidateGigwanIdentityQueries,
  useGigwanQuery,
  useUpdateGigwanMutation,
} from '@/domain/gigwan/api';

import { css } from './styles';
import { useFeedback } from '../useFeedback';

type BasicInformationSectionProps = { gigwanNanoId: string };

type BasicInformationFormValues = {
  name: string;
  intro: string;
};
type BasicInformationDefaults = BasicInformationFormValues;

const INITIAL_DEFAULTS: BasicInformationDefaults = { name: '', intro: '' };

export function BasicInformationSection({ gigwanNanoId }: BasicInformationSectionProps) {
  const queryClient = useQueryClient();
  const { data: gigwan } = useGigwanQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });
  const updateMutation = useUpdateGigwanMutation(gigwanNanoId);
  const { feedback, showError, showSuccess, clearFeedback } = useFeedback();

  const defaultsRef = useRef<BasicInformationDefaults>(INITIAL_DEFAULTS);

  const form = useForm({
    defaultValues: INITIAL_DEFAULTS,
    onSubmit: async ({ value }) => {
      const prev = defaultsRef.current;
      const trimmedName = value.name.trim();
      const trimmedIntro = value.intro.trim();

      const payload: { name?: string; intro?: string } = {};
      if (trimmedName !== prev.name) payload.name = trimmedName;
      if (trimmedIntro !== prev.intro) payload.intro = trimmedIntro;
      if (Object.keys(payload).length === 0) return;

      try {
        await updateMutation.mutateAsync(payload);

        const nextDefaults: BasicInformationDefaults = {
          name: trimmedName,
          intro: trimmedIntro,
        };

        defaultsRef.current = nextDefaults;
        form.reset(nextDefaults);

        showSuccess('변경사항이 저장되었습니다.');

        await invalidateGigwanIdentityQueries(queryClient, gigwanNanoId);
      } catch {
        showError('저장에 실패했습니다. 다시 시도해주세요.');
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
  }, [gigwan?.name, gigwan?.intro, form, gigwan]);

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
    clearFeedback();
    await form.handleSubmit();
  }, [clearFeedback, form]);

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
                  clearFeedback();
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
                  clearFeedback();
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
          {feedback ? <span css={css.feedback[feedback.type]}>{feedback.message}</span> : null}
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
