'use client';

import { useForm, useStore } from '@tanstack/react-form';
import { useEffect, useMemo, useState } from 'react';

import { Button, DatePicker, Modal, Textfield } from '@/common/components';
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
} from '@/domain/jaewonsaeng/api';
import { createLocalId } from '@/domain/gigwan/section/local-id';

import { cssObj } from '../../styles';

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
  jojikNanoId: _jojikNanoId,
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

  const [isHadaLinkModalOpen, setIsHadaLinkModalOpen] = useState(false);
  const [issuedLinkCode, setIssuedLinkCode] = useState<string | null>(null);

  const { data: hadaLinkCodeData, refetch: refetchHadaLinkCode } =
    useGetJaewonsaengHadaLinkCodeQuery(jaewonsaengNanoId, {
      enabled: isAuthenticated && isHadaLinkModalOpen,
    });

  const issueHadaLinkCodeMutation = useIssueJaewonsaengHadaLinkCodeMutation();

  const updateJaewonsaeng = useUpdateJaewonsaengMutation(jaewonsaengNanoId);
  const updateBonin = useUpdateJaewonsaengBoninMutation(jaewonsaengNanoId);
  const deleteJaewonsaeng = useDeleteJaewonsaengMutation(jaewonsaengNanoId);

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

  useEffect(() => {
    setIssuedLinkCode(hadaLinkCodeData?.linkCode ?? null);
  }, [hadaLinkCodeData]);

  useEffect(() => {
    setIsHadaLinkModalOpen(false);
    setIssuedLinkCode(null);
  }, [jaewonsaengNanoId]);

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

  return (
    <div css={cssObj.panelBody}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{values.jaewonsaeng.name}</h2>
      </div>

      {!isHadaLinked && (
        <div css={cssObj.panelSection}>
          <p css={cssObj.helperText}>
            하다를 연동하지 않은 계정입니다. 하다를 연동해 본인 정보를 확인해 보세요.
          </p>
          <div css={cssObj.sectionActions}>
            <Button
              variant="primary"
              styleType="outlined"
              onClick={() => setIsHadaLinkModalOpen(true)}
            >
              하다 연동하러 가기 &gt;
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={(event) => void form.handleSubmit(event)}>
        <div css={cssObj.panelSection}>
          <span css={cssObj.panelSubtitle}>재원생 기본 속성</span>
          <form.Field name="jaewonsaeng.name">
            {(field) => (
              <Textfield
                singleLine
                value={field.state.value}
                onValueChange={field.handleChange}
                placeholder="이름"
              />
            )}
          </form.Field>
          <form.Field name="jaewonsaeng.nickname">
            {(field) => (
              <Textfield
                singleLine
                value={field.state.value}
                onValueChange={field.handleChange}
                placeholder="별명"
              />
            )}
          </form.Field>
          <form.Field name="jaewonsaeng.jaewonCategorySangtaeNanoId">
            {(field) => (
              <Textfield
                singleLine
                value={field.state.value}
                onValueChange={field.handleChange}
                placeholder="재원 상태 카테고리 상태 nanoId"
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
                value={field.state.value}
                onValueChange={field.handleChange}
                placeholder="이름"
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
              <Textfield
                singleLine
                value={field.state.value}
                onValueChange={field.handleChange}
                placeholder="성별 nanoId"
              />
            )}
          </form.Field>
          <form.Field name="bonin.phoneNumber">
            {(field) => (
              <Textfield
                singleLine
                value={field.state.value}
                onValueChange={field.handleChange}
                placeholder="전화번호"
              />
            )}
          </form.Field>
          <form.Field name="bonin.emailAddress">
            {(field) => (
              <Textfield
                singleLine
                value={field.state.value}
                onValueChange={field.handleChange}
                placeholder="이메일"
              />
            )}
          </form.Field>
          <form.Field name="bonin.bigo">
            {(field) => (
              <Textfield
                value={field.state.value}
                onValueChange={field.handleChange}
                placeholder="비고"
              />
            )}
          </form.Field>
        </div>

        <div css={cssObj.panelSection}>
          <div css={cssObj.sectionActions}>
            <span css={cssObj.panelSubtitle}>보호자 속성</span>
            <Button
              size="small"
              styleType="outlined"
              variant="secondary"
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
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          placeholder="관계"
                        />
                      )}
                    </form.Field>
                    <form.Field name={`bohojas[${index}].phoneNumber`}>
                      {(field) => (
                        <Textfield
                          singleLine
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          placeholder="전화번호"
                        />
                      )}
                    </form.Field>
                    <form.Field name={`bohojas[${index}].emailAddress`}>
                      {(field) => (
                        <Textfield
                          singleLine
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          placeholder="이메일"
                        />
                      )}
                    </form.Field>
                    <form.Field name={`bohojas[${index}].bigo`}>
                      {(field) => (
                        <Textfield
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          placeholder="비고"
                        />
                      )}
                    </form.Field>
                    <div css={cssObj.sectionActions}>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => void handleDeleteBohoja(index, bohoja.nanoId)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </form.Field>
        </div>

        <div css={cssObj.sectionActions}>
          <Button
            variant="secondary"
            onClick={() => form.setFieldValue('jaewonsaeng.isHwalseong', () => false)}
          >
            재원생 비활성화
          </Button>
          <Button
            type="submit"
            variant="primary"
            styleType="solid"
            disabled={!isDirty || updateJaewonsaeng.isPending || updateBonin.isPending}
          >
            저장
          </Button>
        </div>
      </form>

      <div css={cssObj.panelFooter}>
        <Button
          variant="red"
          styleType="solid"
          disabled={values.jaewonsaeng.isHwalseong}
          onClick={handleDeleteJaewonsaeng}
        >
          재원생 삭제
        </Button>
      </div>

      <Modal
        isOpen={isHadaLinkModalOpen}
        onClose={() => setIsHadaLinkModalOpen(false)}
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
                      const result = await issueHadaLinkCodeMutation.mutateAsync(jaewonsaengNanoId);
                      setIssuedLinkCode(result.linkCode);
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
