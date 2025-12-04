'use client';

import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, DatePicker, Dropdown, Textfield } from '@/common/components';
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
  useGetJaewonsaengLinkedGroupsQuery,
} from '@/domain/jaewonsaeng/api';
import { useGetGendersQuery } from '@/domain/system/api';
import { createLocalId } from '@/domain/gigwan/section/local-id';

import { cssObj } from '../../styles';
import { ArrowMdRightSingleIcon, PlusIcon, PhoneIcon, CopyIcon } from '@/common/icons';

const getFirstNonEmptyString = (...values: (string | null | undefined)[]) =>
  values.find((value) => value !== undefined && value !== null && value !== '') ?? '';

const getFirstDefined = <T,>(...values: (T | null | undefined)[]) =>
  values.find((value) => value !== undefined && value !== null);

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

  const { data: hadaLinkCodeData, refetch: refetchHadaLinkCode } =
    useGetJaewonsaengHadaLinkCodeQuery(jaewonsaengNanoId, {
      enabled: isAuthenticated,
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

  const { data: linkedGroupsData, isLoading: isLinkedGroupsLoading } =
    useGetJaewonsaengLinkedGroupsQuery(jaewonsaengNanoId, {
      enabled: isAuthenticated && Boolean(jaewonsaengNanoId),
    });

  const initialValues = useMemo(
    () => ({
      jaewonsaeng: {
        name: getFirstNonEmptyString(data?.jaewonsaeng.name, detailData?.name, jaewonsaengName),
        nickname: getFirstNonEmptyString(data?.jaewonsaeng.nickname, detailData?.nickname, ''),
        jaewonCategorySangtaeNanoId: getFirstNonEmptyString(
          data?.jaewonsaeng.jaewonCategorySangtaeNanoId,
          detailData?.jaewonCategorySangtaeNanoId,
          '',
        ),
        isHwalseong:
          (getFirstDefined(
            data?.jaewonsaeng.isHwalseong,
            detailData?.isHwalseong,
            true,
          ) as boolean) ?? true,
      },
      bonin: {
        name: getFirstNonEmptyString(data?.jaewonsaengBonin.name, ''),
        birthDate: getFirstNonEmptyString(data?.jaewonsaengBonin.birthDate, ''),
        genderNanoId: getFirstNonEmptyString(data?.jaewonsaengBonin.genderNanoId, ''),
        phoneNumber: getFirstNonEmptyString(data?.jaewonsaengBonin.phoneNumber, ''),
        emailAddress: getFirstNonEmptyString(data?.jaewonsaengBonin.email, ''),
        bigo: getFirstNonEmptyString(data?.jaewonsaengBonin.bigo, ''),
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

  const [isHadaLinkTooltipOpen, setIsHadaLinkTooltipOpen] = useState(false);
  const hadaLinkActionRef = useRef<HTMLDivElement>(null);
  const hadaLinkTooltipRef = useRef<HTMLDivElement | null>(null); // 외부 클릭 감지용 ref
  const [hadaLinkTooltipPosition, setHadaLinkTooltipPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [activeLinkedTab, setActiveLinkedTab] = useState('sugangsaengs');

  useEffect(() => {
    if (!isHadaLinkTooltipOpen) {
      return;
    }

    const updatePosition = () => {
      const container = hadaLinkActionRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const tooltipWidth = 280;
      const left = rect.left - tooltipWidth - 12;
      const top = Math.max(rect.top - 50, 12);

      setHadaLinkTooltipPosition({ left, top });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isHadaLinkTooltipOpen]);

  const toggleHadaLinkTooltip = useCallback(() => {
    setIsHadaLinkTooltipOpen((prev) => {
      const next = !prev;

      if (!next) {
        setHadaLinkTooltipPosition(null);
      }

      return next;
    });
  }, []);

  const closeHadaLinkTooltip = useCallback(() => {
    setIsHadaLinkTooltipOpen(false);
    setHadaLinkTooltipPosition(null);
  }, []);

  // 화면 바깥 클릭 시 툴팁 닫기
  useEffect(() => {
    if (!isHadaLinkTooltipOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      // 트리거 영역 또는 툴팁 안을 클릭한 경우는 무시
      if (
        hadaLinkActionRef.current?.contains(target) ||
        hadaLinkTooltipRef.current?.contains(target)
      ) {
        return;
      }

      closeHadaLinkTooltip();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHadaLinkTooltipOpen, closeHadaLinkTooltip]);

  const handleIssueHadaLinkCode = useCallback(async () => {
    await issueHadaLinkCodeMutation.mutateAsync(jaewonsaengNanoId);
    await refetchHadaLinkCode();
  }, [issueHadaLinkCodeMutation, jaewonsaengNanoId, refetchHadaLinkCode]);

  const handleCopyLinkCode = useCallback(() => {
    if (!issuedLinkCode) return;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(issuedLinkCode).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = issuedLinkCode;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand('copy');
        } finally {
          document.body.removeChild(textarea);
        }
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = issuedLinkCode;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }, [issuedLinkCode]);

  const isHadaLinked = detailData?.isHadaLinked ?? isHadaLinkedFromList;
  const linkedGroups = linkedGroupsData?.jaewonsaengGroups ?? [];

  const linkedObjectTabs = useMemo(
    () => [
      {
        key: 'sugangsaengs',
        label: '수강생(수업)',
        content: <p css={cssObj.helperText}>연결된 수강생(수업)이 없습니다.</p>,
      },
      {
        key: 'groups',
        label: '재원생 그룹',
        content: (
          <div css={cssObj.permissionList}>
            {isLinkedGroupsLoading ? (
              <p css={cssObj.helperText}>재원생 그룹 정보를 불러오는 중입니다...</p>
            ) : linkedGroups.length ? (
              linkedGroups.map((group) => (
                <div key={group.nanoId} css={cssObj.permissionItem}>
                  <span css={cssObj.permissionName}>{group.name}</span>
                  <span css={cssObj.panelText}>{group.groupTypeName}</span>
                </div>
              ))
            ) : (
              <p css={cssObj.helperText}>연결된 재원생 그룹이 없습니다.</p>
            )}
          </div>
        ),
      },
    ],
    [isLinkedGroupsLoading, linkedGroups],
  );

  const resolvedActiveLinkedTab = useMemo(() => {
    const hasActiveTab = linkedObjectTabs.some((tab) => tab.key === activeLinkedTab);

    return hasActiveTab ? activeLinkedTab : (linkedObjectTabs[0]?.key ?? '');
  }, [activeLinkedTab, linkedObjectTabs]);

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
          <p css={cssObj.formLabel}>
            재원 상태<span> * </span>
          </p>
          <form.Field name="jaewonsaeng.jaewonCategorySangtaeNanoId">
            {(field) => (
              <Dropdown
                value={field.state.value}
                onChange={field.handleChange}
                placeholder="재원 상태를 선택해 주세요"
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
          <p css={cssObj.formLabel}>학생 성별</p>
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
              <div
                css={[cssObj.parentTitle, cssObj.permissionActionContainer]}
                ref={hadaLinkActionRef}
              >
                <Button
                  variant="assistive"
                  styleType="solid"
                  size="small"
                  isFull
                  onClick={toggleHadaLinkTooltip}
                  aria-expanded={isHadaLinkTooltipOpen}
                  iconRight={<ArrowMdRightSingleIcon />}
                >
                  하다 연동하러 가기
                </Button>
                {isHadaLinkTooltipOpen && hadaLinkTooltipPosition ? (
                  <div
                    css={cssObj.permissionTooltip}
                    style={hadaLinkTooltipPosition}
                    ref={hadaLinkTooltipRef}
                  >
                    <div css={cssObj.permissionTooltipHeader}>
                      <p css={cssObj.panelSubtitle}>연결 코드</p>
                    </div>
                    {hadaLinkCodeData && issuedLinkCode && (
                      <div css={cssObj.issuedCodeWrapper}>
                        <p css={cssObj.issuedCode}>
                          {hadaLinkCodeData.linkCode}
                          <span
                            css={cssObj.codeCopyButton}
                            onClick={handleCopyLinkCode}
                            aria-label="코드 복사"
                          >
                            <CopyIcon />
                          </span>
                        </p>
                        <p css={cssObj.issuedDate}>
                          {hadaLinkCodeData.issuedAt} {hadaLinkCodeData.issuedByName}
                        </p>
                      </div>
                    )}
                    <div css={cssObj.issueButtonWrapper}>
                      <Button
                        variant="assistive"
                        size="small"
                        styleType="solid"
                        isFull
                        onClick={handleIssueHadaLinkCode}
                        disabled={issueHadaLinkCodeMutation.isPending}
                        iconRight={issuedLinkCode ? <PhoneIcon /> : <PlusIcon />}
                      >
                        {issuedLinkCode ? '새 연결 코드 생성' : '코드 생성'}
                      </Button>
                    </div>
                  </div>
                ) : null}
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
      <div css={cssObj.panelSection}>
        <h3 css={cssObj.panelSubtitle}>재원생 연결 객체들</h3>
        <div css={cssObj.linkedNav}>
          {linkedObjectTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              css={[
                cssObj.linkedNavButton,
                tab.key === resolvedActiveLinkedTab ? cssObj.linkedNavButtonActive : null,
              ]}
              onClick={() => setActiveLinkedTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div css={cssObj.linkedContent}>
          {linkedObjectTabs.find((tab) => tab.key === resolvedActiveLinkedTab)?.content ?? (
            <p css={cssObj.helperText}>연결된 객체가 없습니다.</p>
          )}
        </div>
      </div>
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
    </div>
  );
};
