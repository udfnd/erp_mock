'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useMemo, useRef } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  invalidateGigwanIdentityQueries,
  useGigwanQuery,
  useUpdateGigwanMutation,
} from '@/domain/gigwan/api';

import { cssObj } from './styles';

type BasicInformationSectionProps = { gigwanNanoId: string };

type BasicInformationFormValues = {
  name: string;
  intro: string;
};

function BasicInformationForm({
  gigwanNanoId,
  initialValues,
}: {
  gigwanNanoId: string;
  initialValues: BasicInformationFormValues;
}) {
  const queryClient = useQueryClient();
  const updateMutation = useUpdateGigwanMutation(gigwanNanoId);

  const defaultsRef = useRef<BasicInformationFormValues>(initialValues);

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const prev = defaultsRef.current;
      const trimmedName = value.name.trim();
      const trimmedIntro = value.intro.trim();

      const payload: { name?: string; intro?: string } = {};
      if (trimmedName !== prev.name) payload.name = trimmedName;
      if (trimmedIntro !== prev.intro) payload.intro = trimmedIntro;

      if (Object.keys(payload).length === 0) {
        return;
      }

      try {
        await updateMutation.mutateAsync(payload);

        const nextDefaults: BasicInformationFormValues = {
          name: trimmedName,
          intro: trimmedIntro,
        };

        defaultsRef.current = nextDefaults;
        form.reset(nextDefaults);

        await invalidateGigwanIdentityQueries(queryClient, gigwanNanoId);
      } catch {}
    },
  });

  const { isDirty, nameMeta, introMeta } = useStore(form.store, (state) => ({
    isDirty: state.isDirty,
    nameMeta: state.fieldMeta?.name ?? { errors: [] as string[] },
    introMeta: state.fieldMeta?.intro ?? { errors: [] as string[] },
  }));

  const hasErrors = (nameMeta.errors?.length ?? 0) > 0 || (introMeta.errors?.length ?? 0) > 0;

  const canSave = isDirty && !hasErrors && !updateMutation.isPending;

  const handleSave = useCallback(async () => {
    await form.handleSubmit();
  }, [form]);

  return (
    <>
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
    </>
  );
}

export function BasicInformationSection({ gigwanNanoId }: BasicInformationSectionProps) {
  const { data: gigwan } = useGigwanQuery(gigwanNanoId, {
    enabled: Boolean(gigwanNanoId),
  });

  const initialValues: BasicInformationFormValues = useMemo(
    () => ({
      name: gigwan?.name ?? '',
      intro: gigwan?.intro ?? '',
    }),
    [gigwan?.name, gigwan?.intro],
  );

  return (
    <section css={cssObj.card}>
      <BasicInformationForm
        key={`${gigwanNanoId}:${initialValues.name}:${initialValues.intro}`}
        gigwanNanoId={gigwanNanoId}
        initialValues={initialValues}
      />
    </section>
  );
}
