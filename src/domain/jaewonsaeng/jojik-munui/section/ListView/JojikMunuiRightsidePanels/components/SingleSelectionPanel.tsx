import { type FormEvent, useCallback, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useGetJojikMunuiDetailQuery,
  useUpdateJojikMunuiMutation,
} from '@/domain/jaewonsaeng/jojik-munui/api';
import type { JojikMunuiListItem } from '@/domain/jaewonsaeng/jojik-munui/api';
import { useJojikQuery } from '@/domain/jojik/api';
import { useGetJojikAllimDetailQuery } from '@/domain/jaewonsaeng/jojik-allim/api';

import { cssObj } from '../../styles';

export type SingleSelectionPanelProps = {
  jojikMunuiNanoId: string;
  jojikMunuiTitle: string;
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export type SingleSelectionPanelContentProps = {
  jojikMunuiNanoId: string;
  jojikMunuiTitle: string;
  jojikNanoId: string;
  content: string;
  jaewonsaengNanoId: string;
  createdAt: string;
  jojikMunuiSangtaeName: string;
  linkedMunuiNanoId: string | null;
  linkedAllimNanoId: string | null;
  dapbyeonContent: string | null;
  dapbyeonAt: string | null;
  dapbyeonGesiAt: string | null;
  dapbyeonViewedAt: string | null;
  dapbyeonChwisoAt: string | null;
  onAfterMutation: () => Promise<unknown> | void;
  updateMutation: ReturnType<typeof useUpdateJojikMunuiMutation>;
  isAuthenticated: boolean;
};

export function SingleSelectionPanel({
  jojikMunuiNanoId,
  jojikMunuiTitle,
  jojikNanoId,
  onAfterMutation,
  isAuthenticated,
}: SingleSelectionPanelProps) {
  const { data: jojikMunuiDetail, isLoading } = useGetJojikMunuiDetailQuery(jojikMunuiNanoId, {
    enabled: isAuthenticated && Boolean(jojikMunuiNanoId),
  });

  const updateMutation = useUpdateJojikMunuiMutation();

  if (isLoading && !jojikMunuiDetail) {
    return (
      <>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>{jojikMunuiTitle}</h2>
          <p css={cssObj.panelSubtitle}>선택한 문의 정보를 불러오는 중입니다...</p>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.helperText}>선택한 문의 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  const effectiveTitle = jojikMunuiDetail?.title ?? jojikMunuiTitle ?? '';
  const effectiveContent = jojikMunuiDetail?.content ?? '';
  const effectiveJaewonsaengNanoId = jojikMunuiDetail?.jaewonsaengNanoId ?? '';
  const effectiveCreatedAt = jojikMunuiDetail?.createdAt ?? '';
  const effectiveJojikMunuiSangtaeName = jojikMunuiDetail?.jojikMunuiSangtaeName ?? '';
  const effectiveLinkedMunuiNanoId = jojikMunuiDetail?.linkedMunuiNanoId ?? null;
  const effectiveLinkedAllimNanoId = jojikMunuiDetail?.linkedAllimNanoId ?? null;
  const effectiveDapbyeonContent = jojikMunuiDetail?.dapbyeon.dapbyeonContent ?? null;
  const effectiveDapbyeonAt = jojikMunuiDetail?.dapbyeon.dapbyeonAt ?? null;
  const effectiveDapbyeonGesiAt = jojikMunuiDetail?.dapbyeon.dapbyeonGesiAt ?? null;
  const effectiveDapbyeonViewedAt = jojikMunuiDetail?.dapbyeon.dapbyeonViewedAt ?? null;
  const effectiveDapbyeonChwisoAt = jojikMunuiDetail?.dapbyeon.dapbyeonChwisoAt ?? null;

  return (
    <SingleSelectionPanelContent
      key={`${jojikMunuiNanoId}:${effectiveTitle}:${effectiveContent}`}
      jojikMunuiNanoId={jojikMunuiNanoId}
      jojikMunuiTitle={effectiveTitle}
      jojikNanoId={jojikNanoId}
      content={effectiveContent}
      jaewonsaengNanoId={effectiveJaewonsaengNanoId}
      createdAt={effectiveCreatedAt}
      jojikMunuiSangtaeName={effectiveJojikMunuiSangtaeName}
      linkedMunuiNanoId={effectiveLinkedMunuiNanoId}
      linkedAllimNanoId={effectiveLinkedAllimNanoId}
      dapbyeonContent={effectiveDapbyeonContent}
      dapbyeonAt={effectiveDapbyeonAt}
      dapbyeonGesiAt={effectiveDapbyeonGesiAt}
      dapbyeonViewedAt={effectiveDapbyeonViewedAt}
      dapbyeonChwisoAt={effectiveDapbyeonChwisoAt}
      onAfterMutation={onAfterMutation}
      updateMutation={updateMutation}
      isAuthenticated={isAuthenticated}
    />
  );
}

export function SingleSelectionPanelContent({
  jojikMunuiNanoId,
  jojikMunuiTitle,
  jojikNanoId,
  content,
  jaewonsaengNanoId,
  createdAt,
  jojikMunuiSangtaeName,
  linkedMunuiNanoId,
  linkedAllimNanoId,
  dapbyeonContent,
  dapbyeonAt,
  dapbyeonGesiAt,
  dapbyeonViewedAt,
  dapbyeonChwisoAt,
  onAfterMutation,
  updateMutation,
  isAuthenticated,
}: SingleSelectionPanelContentProps) {
  const [isEditingDapbyeon, setIsEditingDapbyeon] = useState(false);
  const [dapbyeonInputValue, setDapbyeonInputValue] = useState(dapbyeonContent ?? '');

  const { data: jojikDetail } = useJojikQuery(jojikNanoId, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  const { data: linkedMunuiDetail } = useGetJojikMunuiDetailQuery(linkedMunuiNanoId ?? '', {
    enabled: isAuthenticated && Boolean(linkedMunuiNanoId),
  });

  const { data: linkedAllimDetail } = useGetJojikAllimDetailQuery(linkedAllimNanoId ?? '', {
    enabled: isAuthenticated && Boolean(linkedAllimNanoId),
  });

  const isUpdating = updateMutation.isPending;
  const hasDapbyeon = Boolean(dapbyeonContent);

  const handleStartEdit = useCallback(() => {
    setDapbyeonInputValue(dapbyeonContent ?? '');
    setIsEditingDapbyeon(true);
  }, [dapbyeonContent]);

  const handleCancelEdit = useCallback(() => {
    setDapbyeonInputValue('');
    setIsEditingDapbyeon(false);
  }, []);

  const handleSaveDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await updateMutation.mutateAsync({
      nanoId: jojikMunuiNanoId,
      data: {
        dapbyeonContent: dapbyeonInputValue.trim() || null,
        munuiSangtae: 'miGesi',
      },
    });

    setIsEditingDapbyeon(false);
    await onAfterMutation();
  };

  const handlePublishDapbyeon = async () => {
    await updateMutation.mutateAsync({
      nanoId: jojikMunuiNanoId,
      data: {
        dapbyeonContent: dapbyeonInputValue.trim() || null,
        munuiSangtae: 'gesi',
      },
    });

    setIsEditingDapbyeon(false);
    await onAfterMutation();
  };

  const handleChwisoDapbyeon = async () => {
    if (!window.confirm('답변을 취소하시겠습니까?')) return;

    await updateMutation.mutateAsync({
      nanoId: jojikMunuiNanoId,
      data: {
        dapbyeonContent: null,
        munuiSangtae: 'chwiso',
      },
    });

    setIsEditingDapbyeon(false);
    setDapbyeonInputValue('');
    await onAfterMutation();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{jojikMunuiTitle}</h2>
      </div>
      <div css={cssObj.panelBody}>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>문의 정보</h3>
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>문의 내용</label>
            <p css={cssObj.panelText}>{content}</p>
          </div>
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>재원생 아이디</label>
            <p css={cssObj.panelText}>{jaewonsaengNanoId}</p>
          </div>
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>문의 일시</label>
            <p css={cssObj.panelText}>{formatDate(createdAt)}</p>
          </div>
          <div css={cssObj.panelLabelSection}>
            <label css={cssObj.panelLabel}>문의 상태</label>
            <p css={cssObj.panelText}>{jojikMunuiSangtaeName}</p>
          </div>
        </div>

        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>관련 객체</h3>
          {jojikDetail ? (
            <div css={cssObj.linkedObjectItem}>
              <span css={cssObj.linkedObjectName}>조직: {jojikDetail.name}</span>
            </div>
          ) : null}
          {linkedMunuiDetail ? (
            <div css={cssObj.linkedObjectItem}>
              <span css={cssObj.linkedObjectName}>연결 문의: {linkedMunuiDetail.title}</span>
            </div>
          ) : null}
          {linkedAllimDetail ? (
            <div css={cssObj.linkedObjectItem}>
              <span css={cssObj.linkedObjectName}>연결 알림: {linkedAllimDetail.title}</span>
            </div>
          ) : null}
          {!jojikDetail && !linkedMunuiDetail && !linkedAllimDetail ? (
            <p css={cssObj.helperText}>관련 객체가 없습니다.</p>
          ) : null}
        </div>

        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>답변 정보</h3>
          {hasDapbyeon && !isEditingDapbyeon ? (
            <>
              <div css={cssObj.dapbyeonContent}>{dapbyeonContent}</div>
              <div css={cssObj.panelLabelSection}>
                <label css={cssObj.panelLabel}>답변 작성 일시</label>
                <p css={cssObj.panelText}>{formatDate(dapbyeonAt)}</p>
              </div>
              <div css={cssObj.panelLabelSection}>
                <label css={cssObj.panelLabel}>답변 게시 일시</label>
                <p css={cssObj.panelText}>{formatDate(dapbyeonGesiAt)}</p>
              </div>
              <div css={cssObj.panelLabelSection}>
                <label css={cssObj.panelLabel}>답변 읽음 일시</label>
                <p css={cssObj.panelText}>{formatDate(dapbyeonViewedAt)}</p>
              </div>
              {dapbyeonChwisoAt ? (
                <div css={cssObj.panelLabelSection}>
                  <label css={cssObj.panelLabel}>답변 취소 일시</label>
                  <p css={cssObj.panelText}>{formatDate(dapbyeonChwisoAt)}</p>
                </div>
              ) : null}
              <div css={cssObj.sectionActions}>
                <Button size="small" variant="assistive" onClick={handleStartEdit}>
                  답변 수정
                </Button>
                <Button
                  size="small"
                  variant="red"
                  onClick={handleChwisoDapbyeon}
                  disabled={isUpdating}
                >
                  답변 취소
                </Button>
              </div>
            </>
          ) : null}

          {!hasDapbyeon && !isEditingDapbyeon ? (
            <>
              <p css={cssObj.helperText}>아직 답변이 작성되지 않았습니다.</p>
              <div css={cssObj.sectionActions}>
                <Button size="small" onClick={handleStartEdit}>
                  답변 작성
                </Button>
              </div>
            </>
          ) : null}

          {isEditingDapbyeon ? (
            <form css={cssObj.dapbyeonInputArea} onSubmit={handleSaveDraft}>
              <Textfield
                label="답변 내용"
                value={dapbyeonInputValue}
                onValueChange={setDapbyeonInputValue}
                rows={8}
                placeholder="답변을 입력하세요"
              />
              <div css={cssObj.sectionActions}>
                <Button type="submit" size="small" disabled={isUpdating}>
                  저장
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="assistive"
                  onClick={handlePublishDapbyeon}
                  disabled={isUpdating}
                >
                  답변 게시
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="assistive"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  취소
                </Button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </>
  );
}

export type MultiSelectionPanelProps = {
  jojikMunuis: JojikMunuiListItem[];
};

export function MultiSelectionPanel({ jojikMunuis }: MultiSelectionPanelProps) {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>문의 {jojikMunuis.length}개 설정</h2>
      </div>
      <div css={cssObj.panelBody}>
        <div css={cssObj.salesDiv}>
          <span>준비중입니다.</span>
        </div>
      </div>
    </>
  );
}
