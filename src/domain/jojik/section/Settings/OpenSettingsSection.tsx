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
    onSuccess: (jojikData) => {
      setOpenFileNanoIds((jojikData.openFiles ?? []).map((file) => file.nanoId));
      setBasicInfoNanoId(jojikData.openSangtaeNanoId ?? '');
      setOpenFileNanoId(jojikData.canAccessOpenFileSangtaeNanoId ?? '');
      setHadaNanoId(jojikData.canHadaLinkRequestSangtaeNanoId ?? '');
      setFeedback(null);
    },
  });
  const { data: jojik } = jojikQuery;
  const { data: openFileSangtaesData, isLoading: isOpenFileSangtaesLoading } =
    useCanAccessOpenFileSangtaesQuery();
  const { data: hadaSangtaesData, isLoading: isHadaSangtaesLoading } =
    useCanHadaLinkRequestSangtaesQuery();

  const [openFileNanoIds, setOpenFileNanoIds] = useState<string[]>([]);
  const [basicInfoNanoId, setBasicInfoNanoId] = useState('');
  const [openFileNanoId, setOpenFileNanoId] = useState('');
  const [hadaNanoId, setHadaNanoId] = useState('');
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error'; message: string }>(
    null,
  );
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const openFileOptions = useMemo(() => jojik?.openFiles ?? [], [jojik?.openFiles]);

  const isDirty = useMemo(() => {
    if (!jojik) return false;
    const defaultOpenFiles = (jojik.openFiles ?? []).map((file) => file.nanoId);
    const openFilesChanged =
      defaultOpenFiles.length !== openFileNanoIds.length ||
      defaultOpenFiles.some((id) => !openFileNanoIds.includes(id));

    return (
      openFilesChanged ||
      basicInfoNanoId !== (jojik.openSangtaeNanoId ?? '') ||
      openFileNanoId !== (jojik.canAccessOpenFileSangtaeNanoId ?? '') ||
      hadaNanoId !== (jojik.canHadaLinkRequestSangtaeNanoId ?? '')
    );
  }, [basicInfoNanoId, hadaNanoId, jojik, openFileNanoId, openFileNanoIds]);

  const isValid = Boolean(basicInfoNanoId && openFileNanoId && hadaNanoId);

  const handleToggleOpenFile = (nanoId: string) => {
    setFeedback(null);
    setOpenFileNanoIds((prev) =>
      prev.includes(nanoId) ? prev.filter((id) => id !== nanoId) : [...prev, nanoId],
    );
  };

  const handleSave = () => {
    if (!isDirty || !isValid) return;

    updateJojikMutation.mutate(
      {
        openFileNanoIds,
        openSangtaeNanoId: basicInfoNanoId,
        canAccessOpenFileSangtaeNanoId: openFileNanoId,
        canHadaLinkRequestSangtaeNanoId: hadaNanoId,
      },
      {
        onSuccess: async () => {
          setFeedback({ type: 'success', message: '오픈 파일 및 접근 설정이 저장되었습니다.' });
          await queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
        onError: () => {
          setFeedback({ type: 'error', message: '오픈 설정 저장에 실패했습니다.' });
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
              누구나 학원 표시 기본 정보를 조회할 수 있음 (정보 오픈)
            </span>
            <select
              css={cssObj.select}
              value={basicInfoNanoId}
              onChange={(event) => {
                setFeedback(null);
                setBasicInfoNanoId(event.target.value);
              }}
              disabled={isOpenFileSangtaesLoading}
            >
              <option value="">선택하세요</option>
              {(openFileSangtaesData?.sangtaes ?? []).map((option: SangtaeOption) => (
                <option key={option.nanoId} value={option.nanoId}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>오픈 파일 / 컨텐츠를 열람할 수 있는 사람</span>
            <select
              css={cssObj.select}
              value={openFileNanoId}
              onChange={(event) => {
                setFeedback(null);
                setOpenFileNanoId(event.target.value);
              }}
              disabled={isOpenFileSangtaesLoading}
            >
              <option value="">선택하세요</option>
              {(openFileSangtaesData?.sangtaes ?? []).map((option: SangtaeOption) => (
                <option key={option.nanoId} value={option.nanoId}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>학원에 하다 재원생 연동 신청을 할 수 있는 사람</span>
            <select
              css={cssObj.select}
              value={hadaNanoId}
              onChange={(event) => {
                setFeedback(null);
                setHadaNanoId(event.target.value);
              }}
              disabled={isHadaSangtaesLoading}
            >
              <option value="">선택하세요</option>
              {(hadaSangtaesData?.sangtaes ?? []).map((option: SangtaeOption) => (
                <option key={option.nanoId} value={option.nanoId}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div css={cssObj.linkField}>
          <span css={cssObj.fieldLabel}>재원생 링크 요청 URL</span>
          <div css={cssObj.linkRow}>
            <LabeledInput
              value={linkRequestUrl}
              readOnly
              containerClassName={cssObj.linkInput}
              placeholder="재원생 링크 요청 URL이 없습니다"
            />
            <Button
              size="small"
              styleType="text"
              variant="secondary"
              iconLeft={<CopyIcon width={16} height={16} />}
              onClick={handleCopyLink}
              disabled={!linkRequestUrl}
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
      </div>
    </section>
  );
}
