'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

import { Button, Textfield } from '@/common/components';
import { useGigwanQuery, useUpdateGigwanMutation } from '@/domain/gigwan/api';

import { cssObj } from '../style';
import { FeedbackState } from './types';

type BasicInformationSectionProps = {
  gigwanNanoId: string;
};

type Defaults = { name: string; intro: string };

export function BasicInformationSection({ gigwanNanoId }: BasicInformationSectionProps) {
  const queryClient = useQueryClient();
  const { data: gigwan } = useGigwanQuery(gigwanNanoId, { enabled: Boolean(gigwanNanoId) });
  const updateMutation = useUpdateGigwanMutation(gigwanNanoId);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const defaults = useMemo<Defaults>(
    () => ({ name: gigwan?.name ?? '', intro: gigwan?.intro ?? '' }),
    [gigwan?.name, gigwan?.intro],
  );

  const form = useForm<Defaults>({ defaultValues: defaults });

  useEffect(() => {
    form.reset(defaults);
  }, [form, defaults.name, defaults.intro]);

  const invalidate = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['gigwan', gigwanNanoId] }),
      queryClient.invalidateQueries({ queryKey: ['gigwanName', gigwanNanoId] }),
    ]);
  }, [gigwanNanoId, queryClient]);

  const nameMeta = form.getFieldMeta('name') ?? { isDefaultValue: true, errors: [] as string[] };
  const introMeta = form.getFieldMeta('intro') ?? { isDefaultValue: true, errors: [] as string[] };

  const canSave =
    (!nameMeta.isDefaultValue || !introMeta.isDefaultValue) &&
    (nameMeta.errors?.length ?? 0) === 0 &&
    (introMeta.errors?.length ?? 0) === 0 &&
    !updateMutation.isPending;

  const handleSave = useCallback(async () => {
    await Promise.all([form.validateField('name'), form.validateField('intro')]);
    const nm = form.getFieldMeta('name') ?? { isDefaultValue: true, errors: [] as string[] };
    const im = form.getFieldMeta('intro') ?? { isDefaultValue: true, errors: [] as string[] };

    const payload: { name?: string; intro?: string } = {};
    if (!nm.isDefaultValue && (nm.errors?.length ?? 0) === 0) {
      payload.name = String(form.state.values.name ?? '').trim();
    }
    if (!im.isDefaultValue && (im.errors?.length ?? 0) === 0) {
      payload.intro = String(form.state.values.intro ?? '').trim();
    }
    if (Object.keys(payload).length === 0) return;

    try {
      await updateMutation.mutateAsync(payload);
      setFeedback({ type: 'success', message: '변경사항이 저장되었습니다.' });
      form.reset(form.state.values);
      await invalidate();
    } catch {
      setFeedback({ type: 'error', message: '저장에 실패했습니다. 다시 시도해주세요.' });
    }
  }, [form, updateMutation, invalidate]);

  return (
    <section css={cssObj.card}>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>기관 기본 설정</h2>
        </div>
      </div>

      <div css={cssObj.cardBody}>
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }: { value: string }) => {
              const v = String(value ?? '').trim();
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
              const v = String(value ?? '').trim();
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

        <div css={cssObj.cardFooter}>
          {feedback && <span css={cssObj.feedback[feedback.type]}>{feedback.message}</span>}
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
