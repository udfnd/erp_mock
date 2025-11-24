'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import { Button, Checkbox, LabeledInput } from '@/common/components';
import { CopyIcon } from '@/common/icons';
import { type JojikDetailResponse, useJojikQuery, useUpdateJojikMutation } from '@/domain/jojik/api';
import { apiClient } from '@/global';

import { cssObj } from './styles';

type SangtaeOption = { nanoId: string; name: string };

type OpenSettingsSectionProps = {
  jojikNanoId: string;
};

const sangtaeSchema = z.object({ nanoId: z.string(), name: z.string() });
const sangtaeResponseSchema = z.object({ sangtaes: z.array(sangtaeSchema) });

const useCanAccessOpenFileSangtaesQuery = () =>
  useQuery({
    queryKey: ['canAccessOpenFileSangtaes'],
    queryFn: async () => {
      const res = await apiClient.get('/T/dl/can-access-open-file-sangtaes');
      return sangtaeResponseSchema.parse(res.data);
    },
  });

const useCanHadaLinkRequestSangtaesQuery = () =>
  useQuery({
    queryKey: ['canHadaLinkRequestSangtaes'],
    queryFn: async () => {
      const res = await apiClient.get('/T/dl/can-hada-link-request-sangtaes');
      return sangtaeResponseSchema.parse(res.data);
    },
  });

export function OpenSettingsSection({ jojikNanoId }: OpenSettingsSectionProps) {
  const queryClient = useQueryClient();
  const updateJojikMutation = useUpdateJojikMutation(jojikNanoId);

  const jojikQuery = useJojikQuery(jojikNanoId, { enabled: Boolean(jojikNanoId) });
  const { data: jojik } = jojikQuery;
  const { data: openFileSangtaesData, isLoading: isOpenFileSangtaesLoading } = useCanAccessOpenFileSangtaesQuery();
  const { data: hadaSangtaesData, isLoading: isHadaSangtaesLoading } = useCanHadaLinkRequestSangtaesQuery();

  const [openFileNanoIds, setOpenFileNanoIds] = useState<string[]>([]);
  const [basicInfoNanoId, setBasicInfoNanoId] = useState('');
  const [openFileNanoId, setOpenFileNanoId] = useState('');
  const [hadaNanoId, setHadaNanoId] = useState('');
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error'; message: string }>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!jojik) return;
    setOpenFileNanoIds((jojik.openFiles ?? []).map((file) => file.nanoId));
    setBasicInfoNanoId(jojik.openSangtaeNanoId ?? '');
    setOpenFileNanoId(jojik.canAccessOpenFileSangtaeNanoId ?? '');
    setHadaNanoId(jojik.canHadaLinkRequestSangtaeNanoId ?? '');
    setFeedback(null);
  }, [jojik]);

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

  const linkRequestUrl = (jojik as JojikDetailResponse | undefined)?.jaewonsaengLinkRequestUrl ?? '';

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
          <h2 css={cssObj.cardTitle}>오픈 파일 · 컨텐츠 설정</h2>
          <p css={cssObj.cardSubtitle}>
            조직 정보와 오픈 파일 접근 범위를 조정하고, 필요한 파일만 공개하세요.
          </p>
        </div>
      </div>
      <div css={cssObj.cardBody}>
        <div css={cssObj.selectGroupGrid}>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>조직 기본 정보 공개 범위</span>
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
            <span css={cssObj.fieldDescription}>조직 소개, 기본 정보 등의 공개 범위를 지정합니다.</span>
          </div>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>오픈 파일 접근 권한</span>
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
            <span css={cssObj.fieldDescription}>첨부된 오픈 파일을 조회할 수 있는 대상을 선택하세요.</span>
          </div>
          <div css={cssObj.selectGroup}>
            <span css={cssObj.fieldLabel}>하다 링크 요청 승인 대상</span>
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
            <span css={cssObj.fieldDescription}>하다 링크 요청을 처리할 수 있는 사용자를 선택하세요.</span>
          </div>
        </div>

        <div css={cssObj.openFileSection}>
          <span css={cssObj.sectionTitle}>공개할 오픈 파일 선택</span>
          <span css={cssObj.sectionDescription}>
            공개할 파일만 선택하면 해당 권한을 가진 사용자에게만 노출됩니다.
          </span>
          <div css={cssObj.openFileList}>
            {openFileOptions.length > 0 ? (
              openFileOptions.map((file) => (
                <label key={file.nanoId} css={cssObj.openFileItem}>
                  <Checkbox
                    checked={openFileNanoIds.includes(file.nanoId)}
                    onChange={() => handleToggleOpenFile(file.nanoId)}
                    ariaLabel={`${file.name} 공개 여부`}
                  />
                  <span css={cssObj.openFileName}>{file.name}</span>
                </label>
              ))
            ) : (
              <span css={cssObj.emptyText}>연결된 오픈 파일이 없습니다.</span>
            )}
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
      <footer css={cssObj.cardFooter}>
        {feedback ? (
          <span css={cssObj.feedback[feedback.type]}>{feedback.message}</span>
        ) : (
          <span css={cssObj.statusText}>
            {isOpenFileSangtaesLoading || isHadaSangtaesLoading
              ? '접근 권한 옵션을 불러오는 중입니다.'
              : '공개 범위와 파일 선택을 조정한 후 저장을 눌러주세요.'}
          </span>
        )}
        <Button size="small" styleType="solid" variant="primary" disabled={!isDirty || !isValid || isSaving} onClick={handleSave}>
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </footer>
    </section>
  );
}
