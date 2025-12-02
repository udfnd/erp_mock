'use client';

import { useForm, useStore } from '@tanstack/react-form';
import { useEffect, useMemo, useState } from 'react';

import { Button, DatePicker, Dropdown, Modal, Textfield } from '@/common/components';
import {
  createJaewonsaengBohoja,
  deleteJaewonsaengBohoja,
  updateJaewonsaengBohoja,
  useDeleteJaewonsaengMutation,
  useGetJaewonsaengDetailQuery,
  useGetJaewonsaengHadaLinkCodeQuery,
  useGetJaewonsaengOverallQuery,
  useIssueJaewonsaengHadaLinkCodeMutation,
  useUpdateJaewonsaengBoninMutation,
  useUpdateJaewonsaengMutation,
  useGetJaewonCategorySangtaesQuery,
} from '@/domain/jaewonsaeng/api';
import { useGetGendersQuery } from '@/domain/system/api';
import { createLocalId } from '@/domain/gigwan/section/local-id';

import { cssObj } from '../../styles';
import { ArrowMdRightSingleIcon, PlusIcon } from '@/common/icons';

export type SingleSelectionPanelProps = {
  jaewonsaengNanoId: string;
  jaewonsaengName: string;
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
  isHadaLinked: boolean;
};

export const SingleSelectionPanel = ({
  jaewonsaengNanoId,
  jaewonsaengName,
  jojikNanoId,
  onAfterMutation,
  isAuthenticated,
  isHadaLinked: isHadaLinkedFromList,
}: SingleSelectionPanelProps) => {
  const { data, isLoading } = useGetJaewonsaengOverallQuery(jaewonsaengNanoId, {
    enabled: isAuthenticated && Boolean(jaewonsaengNanoId),
  });

  const { data: detailData } = useGetJaewonsaengDetailQuery(jaewonsaengNanoId, {
    enabled: isAuthenticated && Boolean(jaewonsaengNanoId),
  });

  const [hadaLinkModalFor, setHadaLinkModalFor] = useState<string | null>(null);
  const isHadaLinkModalOpen = hadaLinkModalFor === jaewonsaengNanoId;

  const { data: hadaLinkCodeData, refetch: refetchHadaLinkCode } =
    useGetJaewonsaengHadaLinkCodeQuery(jaewonsaengNanoId, {
      enabled: isAuthenticated && isHadaLinkModalOpen,
    });

  const issuedLinkCode = hadaLinkCodeData?.linkCode ?? null;

  const issueHadaLinkCodeMutation = useIssueJaewonsaengHadaLinkCodeMutation();
  const updateJaewonsaeng = useUpdateJaewonsaengMutation(jaewonsaengNanoId);
  const updateBonin = useUpdateJaewonsaengBoninMutation(jaewonsaengNanoId);
  const deleteJaewonsaeng = useDeleteJaewonsaengMutation(jaewonsaengNanoId);

  const { data: jaewonCategorySangtaes } = useGetJaewonCategorySangtaesQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
  });
  const { data: gendersData } = useGetGendersQuery({ enabled: true });

  const initialValues = useMemo(
    () => ({
      jaewonsaeng: {
        name: detailData?.name ?? data?.jaewonsaeng.name ?? jaewonsaengName,
        nickname: detailData?.nickname ?? data?.jaewonsaeng.nickname ?? '',
        jaewonCategorySangtaeNanoId:
          detailData?.jaewonCategorySangtaeNanoId ??
          data?.jaewonsaeng.jaewonCategorySangtaeNanoId ??
          '',
        isHwalseong: detailData?.isHwalseong ?? data?.jaewonsaeng.isHwalseong ?? true,
      },
      bonin: {
        name: data?.jaewonsaengBonin.name ?? '',
        birthDate: data?.jaewonsaengBonin.birthDate ?? '',
        genderNanoId: data?.jaewonsaengBonin.genderNanoId ?? '',
        phoneNumber: data?.jaewonsaengBonin.phoneNumber ?? '',
        emailAddress: data?.jaewonsaengBonin.email ?? '',
        bigo: data?.jaewonsaengBonin.bigo ?? '',
      },
      bohojas:
        data?.jaewonsaengBohojas.map((bohoja) => ({
          localId: bohoja.nanoId,
          nanoId: bohoja.nanoId,
          gwangye: bohoja.gwangye ?? '',
          phoneNumber: bohoja.phoneNumber ?? '',
          emailAddress: bohoja.email ?? '',
          bigo: bohoja.bigo ?? '',
        })) ?? [],
    }),
    [data, detailData, jaewonsaengName],
  );

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      await updateJaewonsaeng.mutateAsync({
        name: value.jaewonsaeng.name.trim(),
        nickname: value.jaewonsaeng.nickname.trim() || null,
        jaewonCategorySangtaeNanoId: value.jaewonsaeng.jaewonCategorySangtaeNanoId,
        isHwalseong: value.jaewonsaeng.isHwalseong,
      });

      await updateBonin.mutateAsync({
        name: value.bonin.name.trim(),
        birthDate: value.bonin.birthDate || null,
        genderNanoId: value.bonin.genderNanoId,
        phoneNumber: value.bonin.phoneNumber || null,
        emailAddress: value.bonin.emailAddress || null,
        bigo: value.bonin.bigo || null,
      });

      for (const bohoja of value.bohojas) {
        const payload = {
          gwangye: bohoja.gwangye.trim(),
          phoneNumber: bohoja.phoneNumber || null,
          emailAddress: bohoja.emailAddress || null,
          bigo: bohoja.bigo || null,
        };

        if (!payload.gwangye) continue;
        if (bohoja.nanoId?.startsWith('local-')) {
          await createJaewonsaengBohoja(jaewonsaengNanoId, payload);
        } else if (bohoja.nanoId) {
          await updateJaewonsaengBohoja(bohoja.nanoId, payload);
        }
      }

      form.reset({
        ...value,
        jaewonsaeng: { ...value.jaewonsaeng },
        bohojas: value.bohojas.map((bohoja) => ({
          ...bohoja,
          nanoId:
            bohoja.nanoId && !bohoja.nanoId.startsWith('local-') ? bohoja.nanoId : bohoja.localId,
        })),
      });

      await onAfterMutation();
    },
  });

  const { values, isDirty } = useStore(form.store, (state) => ({
    values: state.values as typeof initialValues,
    isDirty: state.isDirty,
  }));

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const isHadaLinked = detailData?.isHadaLinked ?? isHadaLinkedFromList;

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

  const handleDeleteBohoja = async (index: number, nanoId?: string) => {
    if (nanoId && !nanoId.startsWith('local-')) {
      await deleteJaewonsaengBohoja(nanoId);
    }
    form.setFieldValue('bohojas', (prev = []) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteJaewonsaeng = async () => {
    await deleteJaewonsaeng.mutateAsync();
    await onAfterMutation();
  };

  const jaewonCategoryOptions =
    jaewonCategorySangtaes?.categories.flatMap((category) =>
      category.sangtaes.map((sangtae) => ({
        value: sangtae.nanoId,
        label: sangtae.name,
        disabled: !sangtae.isHwalseong,
      })),
    ) ?? [];

  const genderOptions =
    gendersData?.genders.map((gender) => ({
      value: gender.nanoId,
      label: gender.genderName,
    })) ?? [];

  return (
    <div css={cssObj.panelBody}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{values.jaewonsaeng.name}</h2>
      </div>
      <form onSubmit={(event) => void form.handleSubmit(event)}>
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
          <form.Field name="jaewonsaeng.jaewonCategorySangtaeNanoId">
            {(field) => (
              <Dropdown
                value={field.state.value}
                onChange={field.handleChange}
                placeholder="재원 상태 카테고리 상태를 선택해 주세요"
                options={jaewonCategoryOptions}
              />
            )}
          </form.Field>
          <label css={cssObj.panelLabel} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={values.jaewonsaeng.isHwalseong}
              onChange={(e) =>
                form.setFieldValue('jaewonsaeng.isHwalseong', () => e.target.checked)
              }
            />
            활성화
          </label>
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
          <form.Field name="bonin.genderNanoId">
            {(field) => (
              <Dropdown
                value={field.state.value}
                onChange={field.handleChange}
                placeholder="성별을 선택해 주세요"
                options={genderOptions}
              />
            )}
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
          <form.Field name="bonin.emailAddress">
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
          {!isHadaLinked && (
            <div css={cssObj.hadaLinkSection}>
              <div css={cssObj.hadaLinkText}>
                <p>하다를 연동하지 않은 계정입니다.</p>
                <span>하다를 연동해 본인 정보를 확인해 보세요.</span>
              </div>
              <div css={cssObj.parentTitle}>
                <Button
                  variant="assistive"
                  styleType="solid"
                  size="small"
                  isFull
                  onClick={() => setHadaLinkModalFor(jaewonsaengNanoId)}
                  iconRight={<ArrowMdRightSingleIcon />}
                >
                  하다 연동하러 가기
                </Button>
              </div>
            </div>
          )}
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

                    <form.Field name={`bohojas[${index}].emailAddress`}>
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
                        onClick={() => void handleDeleteBohoja(index, bohoja.nanoId)}
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
                  nanoId: createLocalId(),
                  gwangye: '',
                  phoneNumber: '',
                  emailAddress: '',
                  bigo: '',
                },
              ])
            }
          >
            보호자 추가
          </Button>
          <div css={cssObj.sectionActions}>
            <Button
              size="small"
              type="submit"
              variant="primary"
              styleType="solid"
              disabled={!isDirty || updateJaewonsaeng.isPending || updateBonin.isPending}
            >
              저장
            </Button>
          </div>
        </div>
      </form>
      <div css={cssObj.panelFooter}>
        <Button
          size="small"
          variant="red"
          styleType="solid"
          onClick={() => form.setFieldValue('jaewonsaeng.isHwalseong', () => false)}
        >
          재원생 비활성화
        </Button>
        <Button
          size="small"
          variant="red"
          styleType="solid"
          isFull
          disabled={values.jaewonsaeng.isHwalseong}
          onClick={handleDeleteJaewonsaeng}
        >
          재원생 삭제
        </Button>
      </div>
      <Modal
        isOpen={isHadaLinkModalOpen}
        onClose={() => setHadaLinkModalFor(null)}
        title="하다 연동"
        menus={[
          {
            id: 'issue-code',
            label: '코드 생성',
            content: (
              <div css={cssObj.panelBody}>
                <p css={cssObj.helperText}>하다 앱에서 사용할 연동 코드를 생성해 주세요.</p>
                <div css={cssObj.sectionActions}>
                  <Button
                    variant="primary"
                    styleType="solid"
                    onClick={async () => {
                      await issueHadaLinkCodeMutation.mutateAsync(jaewonsaengNanoId);
                      await refetchHadaLinkCode();
                    }}
                    disabled={issueHadaLinkCodeMutation.isPending}
                  >
                    코드 생성
                  </Button>
                </div>
                {issuedLinkCode && (
                  <div css={cssObj.panelSection}>
                    <span css={cssObj.panelSubtitle}>발급된 코드</span>
                    <Textfield
                      singleLine
                      readOnly
                      value={issuedLinkCode}
                      onValueChange={() => {}}
                    />
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
