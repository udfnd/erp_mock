'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useGetJojikMunuiDetailQuery,
  useUpdateJojikMunuiMutation,
  type JojikMunuiDapbyeonDetail,
} from '@/domain/jaewonsaeng/jojik-munui/api';
import { useJojikQuery } from '@/domain/jojik/api';
import { useGetJojikAllimDetailQuery } from '@/domain/jaewonsaeng/jojik-allim/api';

import { formatDateTime } from '../../constants';
import { cssObj } from '../../styles';

type Props = {
  munuiNanoId: string;
  munuiTitle: string;
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

const renderAnswerMeta = (dapbyeon?: JojikMunuiDapbyeonDetail | null) => (
  <div css={cssObj.answerBox}>
    <div css={cssObj.infoRow}>
      <span>답변자</span>
      <span>{dapbyeon?.dapbyeonByNanoId ? dapbyeon.dapbyeonByNanoId : '-'}</span>
    </div>
    <div css={cssObj.infoRow}>
      <span>답변 작성</span>
      <span>{formatDateTime(dapbyeon?.dapbyeonAt)}</span>
    </div>
    <div css={cssObj.infoRow}>
      <span>답변 게시</span>
      <span>{formatDateTime(dapbyeon?.dapbyeonGesiAt)}</span>
    </div>
    <div css={cssObj.infoRow}>
      <span>답변 확인</span>
      <span>{formatDateTime(dapbyeon?.dapbyeonViewedAt)}</span>
    </div>
    <div css={cssObj.infoRow}>
      <span>취소 처리</span>
      <span>{formatDateTime(dapbyeon?.dapbyeonChwisoAt)}</span>
    </div>
  </div>
);

export function SingleSelectionPanel({
  munuiNanoId,
  munuiTitle,
  jojikNanoId,
  onAfterMutation,
  isAuthenticated,
}: Props) {
  const { data: detail, isLoading, refetch } = useGetJojikMunuiDetailQuery(munuiNanoId, {
    enabled: isAuthenticated && Boolean(munuiNanoId),
  });
  const updateMutation = useUpdateJojikMunuiMutation();

  const { data: jojikDetail } = useJojikQuery(detail?.jojikNanoId ?? jojikNanoId, {
    enabled: isAuthenticated && Boolean(detail?.jojikNanoId ?? jojikNanoId),
  });
  const { data: linkedMunui } = useGetJojikMunuiDetailQuery(detail?.linkedMunuiNanoId ?? '', {
    enabled: isAuthenticated && Boolean(detail?.linkedMunuiNanoId),
  });
  const { data: linkedAllim } = useGetJojikAllimDetailQuery(detail?.linkedAllimNanoId ?? '', {
    enabled: isAuthenticated && Boolean(detail?.linkedAllimNanoId),
  });

  const effectiveTitle = detail?.title ?? munuiTitle;
  const hasAnswer = Boolean(detail?.dapbyeon?.dapbyeonContent);
  const [isEditing, setIsEditing] = useState(false);
  const [answerContent, setAnswerContent] = useState(detail?.dapbyeon?.dapbyeonContent ?? '');

  useEffect(() => {
    if (!isEditing) {
      setAnswerContent(detail?.dapbyeon?.dapbyeonContent ?? '');
    }
  }, [detail?.dapbyeon?.dapbyeonContent, isEditing]);

  const relatedItems = useMemo(() => {
    const list: { label: string; value: string }[] = [];
    if (jojikDetail) list.push({ label: '조직', value: jojikDetail.name });
    if (linkedMunui) list.push({ label: '연결된 문의', value: linkedMunui.title });
    if (linkedAllim) list.push({ label: '연결된 알림', value: linkedAllim.title ?? linkedAllim.content ?? linkedAllim.nanoId });
    return list;
  }, [jojikDetail, linkedAllim, linkedMunui]);

  const handleSave = async (munuiSangtae: 'miGesi' | 'gesi' | 'chwiso', content?: string | null) => {
    await updateMutation.mutateAsync({ nanoId: munuiNanoId, data: { munuiSangtae, dapbyeonContent: content ?? null } });
    await refetch();
    await onAfterMutation();
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setAnswerContent(detail?.dapbyeon?.dapbyeonContent ?? '');
  };

  const handleCancelInput = () => {
    setAnswerContent(detail?.dapbyeon?.dapbyeonContent ?? '');
    setIsEditing(false);
  };

  if (isLoading && !detail) {
    return (
      <div css={cssObj.panel}>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>{effectiveTitle}</h2>
        </div>
        <div css={cssObj.panelBody}>문의 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div css={cssObj.panel}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{effectiveTitle}</h2>
        <p css={cssObj.desc}>조직 문의 상세</p>
      </div>
      <div css={cssObj.panelContent}>
        <div css={cssObj.infoRow}>
          <span>재원생</span>
          <span>{detail?.jaewonsaengNanoId ?? detail?.jaewonsaengName ?? '-'}</span>
        </div>
        <div css={cssObj.infoRow}>
          <span>관계</span>
          <span>{detail?.gwangye ?? '-'}</span>
        </div>
        <div css={cssObj.infoRow}>
          <span>문의 상태</span>
          <span>{detail?.jojikMunuiSangtaeName}</span>
        </div>
        <div css={cssObj.infoRow}>
          <span>문의 생성</span>
          <span>{formatDateTime(detail?.createdAt)}</span>
        </div>
        <div css={cssObj.infoRow}>
          <span>내용</span>
          <span>{detail?.content ?? '-'}</span>
        </div>
      </div>

      {relatedItems.length > 0 && (
        <div css={cssObj.panelContent}>
          <h3 css={cssObj.panelSubtitle}>관련 객체</h3>
          <div css={cssObj.relatedList}>
            {relatedItems.map((item) => (
              <div key={`${item.label}-${item.value}`} css={cssObj.relatedItem}>
                <strong>{item.label}</strong>
                <div>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div css={cssObj.panelContent}>
        <h3 css={cssObj.panelSubtitle}>답변 정보</h3>
        {hasAnswer && !isEditing && detail?.dapbyeon?.dapbyeonContent ? (
          <div css={cssObj.answerBox}>
            <div>{detail.dapbyeon.dapbyeonContent}</div>
            {renderAnswerMeta(detail.dapbyeon)}
          </div>
        ) : null}

        {isEditing && (
          <div css={cssObj.answerBox}>
            <Textfield
              multiline
              minRows={4}
              label="답변 내용"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
            />
            <div css={cssObj.sectionActions}>
              <Button variant="primary" onClick={() => handleSave('miGesi', answerContent)}>
                저장
              </Button>
              <Button variant="secondary" onClick={() => handleSave('gesi', answerContent)}>
                답변 게시
              </Button>
              <Button variant="text" onClick={handleCancelInput}>
                취소
              </Button>
            </div>
          </div>
        )}
      </div>

      <div css={cssObj.panelActions}>
        {!isEditing && (
          <Button variant="primary" onClick={handleStartEdit}>
            {hasAnswer ? '답변 수정' : '답변 작성'}
          </Button>
        )}
        {hasAnswer && isEditing && (
          <Button variant="danger" onClick={() => handleSave('chwiso', null)}>
            답변 취소
          </Button>
        )}
      </div>
    </div>
  );
}
