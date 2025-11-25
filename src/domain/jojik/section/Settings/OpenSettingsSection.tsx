'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/common/components';
import { ArrowLgDownIcon, QrcodeIcon } from '@/common/icons';
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

type DropdownOption = { value: string; label: string; disabled?: boolean };

type DropdownProps = {
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function Dropdown({
  value,
  options,
  placeholder = '선택하세요',
  disabled,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;
  const hasSelection = Boolean(selectedOption);

  return (
    <div css={cssObj.dropdown} ref={dropdownRef}>
      <button
        type="button"
        css={cssObj.dropdownButton(isOpen, disabled)}
        onClick={() => {
          if (disabled) return;
          setIsOpen((prev) => !prev);
        }}
        disabled={disabled}
      >
        <span css={[cssObj.dropdownLabel, !hasSelection && cssObj.dropdownPlaceholder]}>
          {displayLabel}
        </span>
        <ArrowLgDownIcon css={[cssObj.dropdownCaret, isOpen && { transform: 'rotate(180deg)' }]} />
      </button>
      {isOpen && (
        <div css={cssObj.dropdownMenu}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              css={[
                cssObj.dropdownOption,
                option.value === value && cssObj.dropdownOptionSelected,
                option.disabled && { cursor: 'not-allowed' },
              ]}
              onClick={() => {
                if (option.disabled) return;
                onChange(option.value);
                setIsOpen(false);
              }}
              disabled={option.disabled}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
      ? 'QR 코드 생성.'
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
            <Dropdown
              value={currentBasicInfoOpen ? 'true' : 'false'}
              options={[
                { value: 'true', label: '열림' },
                { value: 'false', label: '닫힘' },
              ]}
              onChange={(value) => {
                setIsBasicInfoOpen(value === 'true');
              }}
            />
          </div>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>
              오픈 파일 / 컨텐츠를 열람할 수 있는 사람 <span css={cssObj.fieldLabelPoint}>*</span>
            </span>
            <Dropdown
              value={currentOpenFilePermissionNanoId}
              placeholder="선택하세요"
              options={[
                { value: '', label: '선택하세요' },
                ...(openContentsPermissionsData?.sangtaes ?? []).map((option: SangtaeOption) => ({
                  value: option.nanoId,
                  label: option.name,
                })),
              ]}
              disabled={openContentsDisabled}
              onChange={(value) => {
                setOpenFilePermissionNanoId(value);
              }}
            />
          </div>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>
              학원에 하다 재원생 연동 신청을 할 수 있는 사람{' '}
              <span css={cssObj.fieldLabelPoint}>*</span>
            </span>
            <Dropdown
              value={currentHadaPermissionNanoId}
              placeholder="선택하세요"
              options={[
                { value: '', label: '선택하세요' },
                ...(hadaPermissionsData?.sangtaes ?? []).map((option: SangtaeOption) => ({
                  value: option.nanoId,
                  label: option.name,
                })),
              ]}
              disabled={hadaPermissionsDisabled}
              onChange={(value) => {
                setHadaPermissionNanoId(value);
              }}
            />
          </div>
        </div>
        <div css={cssObj.linkField}>
          <span css={cssObj.fieldLabel}>
            재원생 연동 신청 URL <span css={cssObj.fieldLabelPoint}>*</span>
          </span>
          <div css={cssObj.linkRow}>
            <div css={cssObj.linkLabelWrapper}>
              <label css={cssObj.linkLabel}>{linkRequestUrl}</label>
              <button
                css={cssObj.qrcodeButton}
                onClick={handleCopyLink}
                disabled={copyButtonDisabled}
              >
                <QrcodeIcon width={16} height={16} />
              </button>
            </div>
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
