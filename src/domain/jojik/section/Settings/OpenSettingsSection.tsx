'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { Button, LabeledInput } from '@/common/components';
import { CopyIcon } from '@/common/icons';
import {
  type JojikDetailResponse,
  useJojikQuery,
  useUpdateJojikMutation,
} from '@/domain/jojik/api';
import {
  useGetHadaJaewonsangLinkRequestPermissionsQuery,
  useGetOpenContentsPermissionsQuery,
} from '@/domain/system/api';

import { cssObj } from './styles';

type SangtaeOption = { nanoId: string; name: string };

type OpenSettingsSectionProps = {
  jojikNanoId: string;
};

export function OpenSettingsSection({ jojikNanoId }: OpenSettingsSectionProps) {
  const queryClient = useQueryClient();
  const updateJojikMutation = useUpdateJojikMutation(jojikNanoId);

  const jojikQuery = useJojikQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
  });
  const { data: jojik } = jojikQuery;
  const { data: openContentsPermissionsData, isLoading: isOpenContentsLoading } =
    useGetOpenContentsPermissionsQuery();
  const { data: hadaPermissionsData, isLoading: isHadaPermissionsLoading } =
    useGetHadaJaewonsangLinkRequestPermissionsQuery();

  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState<boolean | undefined>(undefined);
  const [openFilePermissionNanoId, setOpenFilePermissionNanoId] = useState<string | undefined>(
    undefined,
  );
  const [hadaPermissionNanoId, setHadaPermissionNanoId] = useState<string | undefined>(undefined);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const currentBasicInfoOpen = isBasicInfoOpen ?? Boolean(jojik?.openSangtae);
  const currentOpenFilePermissionNanoId =
    openFilePermissionNanoId ?? jojik?.canAccessOpenFileSangtaeNanoId ?? '';
  const currentHadaPermissionNanoId =
    hadaPermissionNanoId ?? jojik?.canHadaLinkRequestSangtaeNanoId ?? '';

  const isDirty = useMemo(() => {
    if (!jojik) return false;
    return (
      currentBasicInfoOpen !== Boolean(jojik.openSangtae) ||
      currentOpenFilePermissionNanoId !== (jojik.canAccessOpenFileSangtaeNanoId ?? '') ||
      currentHadaPermissionNanoId !== (jojik.canHadaLinkRequestSangtaeNanoId ?? '')
    );
  }, [currentBasicInfoOpen, currentHadaPermissionNanoId, currentOpenFilePermissionNanoId, jojik]);

  const isValid = Boolean(currentOpenFilePermissionNanoId && currentHadaPermissionNanoId);

  const handleSave = () => {
    if (!isDirty || !isValid) return;

    updateJojikMutation.mutate(
      {
        openSangtae: currentBasicInfoOpen,
        canAccessOpenFileSangtaeNanoId: currentOpenFilePermissionNanoId,
        canHadaLinkRequestSangtaeNanoId: currentHadaPermissionNanoId,
      },
      {
        onSuccess: async (data) => {
          setIsBasicInfoOpen(Boolean(data.openSangtae));
          setOpenFilePermissionNanoId(
            data.canAccessOpenFileSangtaeNanoId ?? currentOpenFilePermissionNanoId,
          );
          setHadaPermissionNanoId(
            data.canHadaLinkRequestSangtaeNanoId ?? currentHadaPermissionNanoId,
          );
          await queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
      },
    );
  };

  const linkRequestUrl =
    (jojik as JojikDetailResponse | undefined)?.jaewonsaengLinkRequestUrl ?? '';

  const handleCopyLink = async () => {
    if (!linkRequestUrl) return;
    try {
      await navigator.clipboard.writeText(linkRequestUrl);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const copyMessage =
    copyStatus === 'success'
      ? '링크를 복사했습니다.'
      : copyStatus === 'error'
        ? '링크 복사에 실패했습니다. 다시 시도해주세요.'
        : null;

  const isSaving = updateJojikMutation.isPending;
  const openContentsDisabled = isOpenContentsLoading || !openContentsPermissionsData;
  const hadaPermissionsDisabled = isHadaPermissionsLoading || !hadaPermissionsData;
  const copyButtonDisabled = !linkRequestUrl;

  return (
    <section css={cssObj.card}>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>오픈 파일/컨텐츠</h2>
        </div>
      </div>
      <div css={cssObj.cardBody}>
        <div css={cssObj.selectGroupGrid}>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>
              누구나 학원 표시 기본 정보를 조회할 수 있음 (정보 오픈){' '}
              <span css={cssObj.fieldLabelPoint}>*</span>
            </span>
            <select
              css={cssObj.select}
              value={currentBasicInfoOpen ? 'true' : 'false'}
              onChange={(event) => {
                setIsBasicInfoOpen(event.target.value === 'true');
              }}
            >
              <option value="true">열림</option>
              <option value="false">닫힘</option>
            </select>
          </div>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>
              오픈 파일 / 컨텐츠를 열람할 수 있는 사람 <span css={cssObj.fieldLabelPoint}>*</span>
            </span>
            <select
              css={cssObj.select}
              value={currentOpenFilePermissionNanoId}
              onChange={(event) => {
                setOpenFilePermissionNanoId(event.target.value);
              }}
              disabled={openContentsDisabled}
            >
              <option value="">선택하세요</option>
              {(openContentsPermissionsData?.sangtaes ?? []).map((option: SangtaeOption) => (
                <option key={option.nanoId} value={option.nanoId}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>
              학원에 하다 재원생 연동 신청을 할 수 있는 사람{' '}
              <span css={cssObj.fieldLabelPoint}>*</span>
            </span>
            <select
              css={cssObj.select}
              value={currentHadaPermissionNanoId}
              onChange={(event) => {
                setHadaPermissionNanoId(event.target.value);
              }}
              disabled={hadaPermissionsDisabled}
            >
              <option value="">선택하세요</option>
              {(hadaPermissionsData?.sangtaes ?? []).map((option: SangtaeOption) => (
                <option key={option.nanoId} value={option.nanoId}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div css={cssObj.linkField}>
          <span css={cssObj.fieldLabel}>
            재원생 연동 신청 URL <span css={cssObj.fieldLabelPoint}>*</span>
          </span>
          <div css={cssObj.linkRow}>
            <div css={cssObj.linkInput}>
              <LabeledInput
                value={linkRequestUrl}
                readOnly
                placeholder="재원생 연동 신청 URL이 없습니다"
              />
            </div>
            <Button
              size="small"
              styleType="text"
              variant="secondary"
              iconLeft={<CopyIcon width={16} height={16} />}
              onClick={handleCopyLink}
              disabled={copyButtonDisabled}
            >
              {copyStatus === 'success' ? '복사됨' : '복사'}
            </Button>
          </div>
          {copyMessage ? (
            <span css={copyStatus === 'error' ? cssObj.feedback.error : cssObj.feedback.success}>
              {copyMessage}
            </span>
          ) : null}
        </div>
        <div css={cssObj.cardFooter}>
          <Button
            size="small"
            styleType="solid"
            disabled={!isDirty || !isValid || isSaving}
            onClick={handleSave}
            isLoading={isSaving}
          >
            저장
          </Button>
        </div>
      </div>
    </section>
  );
}
