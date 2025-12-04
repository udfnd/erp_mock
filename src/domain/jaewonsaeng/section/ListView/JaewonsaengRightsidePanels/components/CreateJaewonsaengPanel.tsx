'use client';

import { useForm, useStore } from '@tanstack/react-form';

import { Button, DatePicker, Dropdown, Textfield } from '@/common/components';
import {
  useCreateJaewonsaengMutation,
  useGetJaewonCategorySangtaesQuery,
} from '@/domain/jaewonsaeng/api';

import { createLocalId } from '@/domain/gigwan/section/local-id';

import { cssObj } from '../../styles';
import { useGetGendersQuery } from '@/domain/system/api';
import { PlusIcon } from '@/common/icons';

export type CreateJaewonsaengPanelProps = {
  jojikNanoId: string;
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

type CreateBoninFormValue = {
  name: string;
  birthDate: string;
  genderNanoId: string;
  phoneNumber: string;
  email: string;
  bigo: string;
};

type CreateBohojaFormValue = {
  localId: string;
  gwangye: string;
  phoneNumber: string;
  email: string;
  bigo: string;
};

type CreateJaewonsaengFormValues = {
  jaewonsaeng: {
    name: string;
    nickname: string;
    jaewonCategorySangtaeNanoId: string;
  };
  bonin: CreateBoninFormValue;
  bohojas: CreateBohojaFormValue[];
};

const INITIAL_VALUES: CreateJaewonsaengFormValues = {
  jaewonsaeng: {
    name: '',
    nickname: '',
    jaewonCategorySangtaeNanoId: '',
  },
  bonin: {
    name: '',
    birthDate: '',
    genderNanoId: '',
    phoneNumber: '',
    email: '',
    bigo: '',
  },
  bohojas: [
    {
      localId: createLocalId(),
      gwangye: '',
      phoneNumber: '',
      email: '',
      bigo: '',
    },
  ],
};

export const CreateJaewonsaengPanel = ({
  jojikNanoId,
  onExit,
  onAfterMutation,
}: CreateJaewonsaengPanelProps) => {
  const createMutation = useCreateJaewonsaengMutation();
  const { data: jaewonCategorySangtaes } = useGetJaewonCategorySangtaesQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
  });
  const { data: gendersData } = useGetGendersQuery({ enabled: true });

  const form = useForm({
    defaultValues: INITIAL_VALUES,
    onSubmit: async ({ value }) => {
      const name = value.jaewonsaeng.name.trim();
      const boninName = value.bonin.name.trim() || name;
      if (!name || !jojikNanoId || !value.jaewonsaeng.jaewonCategorySangtaeNanoId) return;

      await createMutation.mutateAsync({
        jojikNanoId,
        jaewonsaengBonin: {
          name: boninName,
          birthDate: value.bonin.birthDate || null,
          genderNanoId: value.bonin.genderNanoId,
          phoneNumber: value.bonin.phoneNumber || null,
          email: value.bonin.email,
          bigo: value.bonin.bigo || null,
        },
        jaewonsaengBohojas:
          value.bohojas
            .map((bohoja) => ({
              gwangye: bohoja.gwangye.trim(),
              phoneNumber: bohoja.phoneNumber || null,
              email: bohoja.email || null,
              bigo: bohoja.bigo || null,
            }))
            .filter((bohoja) => bohoja.gwangye) ?? [],
        jaewonsaeng: {
          jaewonCategorySangtaeNanoId: value.jaewonsaeng.jaewonCategorySangtaeNanoId,
          name,
          nickname: value.jaewonsaeng.nickname.trim() || null,
        },
      });

      form.reset(INITIAL_VALUES);
      await onAfterMutation();
      onExit?.();
    },
  });

  const { values, isSubmitting } = useStore(form.store, (state) => ({
    values: state.values as CreateJaewonsaengFormValues,
    isSubmitting: state.isSubmitting,
  }));

  const formId = 'jaewonsaeng-create-form';

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    void form.handleSubmit();
  };

  const isDisabled =
    !values.jaewonsaeng.name.trim() ||
    !values.jaewonsaeng.jaewonCategorySangtaeNanoId.trim() ||
    createMutation.isPending ||
    isSubmitting;

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>재원생 생성</h2>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleFormSubmit}>
        <div css={cssObj.panelSection}>
          <span css={cssObj.panelSubtitle}>재원생 기본 속성</span>
          <form.Field name="jaewonsaeng.name">
            {(field) => (
              <Textfield
                singleLine
                required
                label="학원 내부 이름"
                placeholder="학원 내부 이름을 입력해 주세요"
                helperText="학원 내부에서 사용하는 이름을 입력해 주세요. (ex. 김다다A)"
                value={field.state.value}
                onValueChange={field.handleChange}
              />
            )}
          </form.Field>
          <form.Field name="jaewonsaeng.nickname">
            {(field) => (
              <Textfield
                singleLine
                required
                label="학원 내부 식별자"
                placeholder="학원 내부 식별자를 입력해 주세요"
                helperText="학원 내부에서 식별자를 입력해 주세요. (ex. 경기북 21기)"
                value={field.state.value}
                onValueChange={field.handleChange}
              />
            )}
          </form.Field>
          <p css={cssObj.formLabel}>
            재원 상태<span> * </span>
          </p>
          <form.Field name="jaewonsaeng.jaewonCategorySangtaeNanoId">
            {(field) => {
              const options =
                jaewonCategorySangtaes?.categories.flatMap((category) =>
                  category.sangtaes.map((sangtae) => ({
                    value: sangtae.nanoId,
                    label: sangtae.name,
                    disabled: !sangtae.isHwalseong,
                  })),
                ) ?? [];

              return (
                <Dropdown
                  value={field.state.value}
                  onChange={field.handleChange}
                  placeholder="재원 상태를 선택해 주세요"
                  options={options}
                />
              );
            }}
          </form.Field>
        </div>
        <div css={cssObj.panelSection}>
          <span css={cssObj.panelSubtitle}>재원생 본인 속성</span>
          <form.Field name="bonin.name">
            {(field) => (
              <Textfield
                singleLine
                required
                label="학생 본명"
                placeholder="이름을 입력해 주세요"
                value={field.state.value}
                onValueChange={field.handleChange}
              />
            )}
          </form.Field>
          <form.Field name="bonin.birthDate">
            {(field) => (
              <DatePicker
                label="생년월일"
                placeholder="생년월일을 선택해 주세요"
                value={field.state.value}
                onChange={field.handleChange}
              />
            )}
          </form.Field>
          <p css={cssObj.formLabel}>학생 성별</p>
          <form.Field name="bonin.genderNanoId">
            {(field) => {
              const options =
                gendersData?.genders.map((gender) => ({
                  value: gender.nanoId,
                  label: gender.genderName,
                })) ?? [];

              return (
                <Dropdown
                  value={field.state.value}
                  onChange={field.handleChange}
                  placeholder="성별을 선택해 주세요"
                  options={options}
                />
              );
            }}
          </form.Field>
          <form.Field name="bonin.phoneNumber">
            {(field) => (
              <Textfield
                singleLine
                label="학생 전화번호"
                placeholder="학생 전화번호를 입력해 주세요"
                value={field.state.value}
                onValueChange={field.handleChange}
              />
            )}
          </form.Field>
          <form.Field name="bonin.email">
            {(field) => (
              <Textfield
                singleLine
                label="학생 이메일"
                placeholder="학생 이메일을 입력해 주세요"
                value={field.state.value}
                onValueChange={field.handleChange}
              />
            )}
          </form.Field>
          <form.Field name="bonin.bigo">
            {(field) => (
              <Textfield
                label="학생 비고"
                placeholder="비고 사항을 입력해 주세요"
                value={field.state.value}
                onValueChange={field.handleChange}
              />
            )}
          </form.Field>
        </div>

        <div css={cssObj.panelSection}>
          <div css={cssObj.parentTitle}>
            <span css={cssObj.panelSubtitle}>보호자 속성</span>
          </div>
          <form.Field name="bohojas" mode="array">
            {(bohojasField) => (
              <>
                {bohojasField.state.value.map((bohoja, index) => (
                  <div key={bohoja.localId} css={cssObj.panelLabelSection}>
                    <form.Field name={`bohojas[${index}].gwangye`}>
                      {(field) => (
                        <Textfield
                          singleLine
                          required
                          label="보호자-관계"
                          placeholder="보호자와 학생의 관계를 선택해 주세요."
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        />
                      )}
                    </form.Field>
                    <form.Field name={`bohojas[${index}].phoneNumber`}>
                      {(field) => (
                        <Textfield
                          singleLine
                          required
                          label="보호자 전화번호"
                          placeholder="보호자 전화번호를 입력해 주세요"
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        />
                      )}
                    </form.Field>
                    <form.Field name={`bohojas[${index}].email`}>
                      {(field) => (
                        <Textfield
                          singleLine
                          label="보호자 이메일"
                          placeholder="보호자 이메일을 입력해 주세요"
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        />
                      )}
                    </form.Field>
                    <form.Field name={`bohojas[${index}].bigo`}>
                      {(field) => (
                        <Textfield
                          label="보호자 비고"
                          placeholder="비고 사항을 입력해 주세요"
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        />
                      )}
                    </form.Field>
                    <div css={cssObj.parentDeleteButtonWrapper}>
                      <Button
                        styleType="text"
                        variant="secondary"
                        size="small"
                        onClick={() => bohojasField.removeValue(index)}
                      >
                        보호자 삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </form.Field>
          <Button
            size="small"
            styleType="outlined"
            variant="assistive"
            iconRight={<PlusIcon />}
            onClick={() =>
              form.setFieldValue('bohojas', (prev = []) => [
                ...prev,
                {
                  localId: createLocalId(),
                  gwangye: '',
                  phoneNumber: '',
                  email: '',
                  bigo: '',
                },
              ])
            }
          >
            보호자 추가
          </Button>
        </div>
      </form>

      <div css={cssObj.panelFooter}>
        <Button
          type="submit"
          size="small"
          styleType="solid"
          variant="primary"
          form={formId}
          disabled={isDisabled}
          iconRight={<PlusIcon />}
          isFull
        >
          재원생 생성하기
        </Button>
      </div>
    </>
  );
};
