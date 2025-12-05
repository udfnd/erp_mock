'use client';

import { Button } from '@/common/components';
import { useGetJojikAllimDetailQuery, useUpdateJojikAllimMutation } from '../../../../api';
import { cssObj } from '../../styles';
import { formatDate } from '../../constants';

export type SingleSelectionPanelProps = {
  allimNanoId: string;
  allimTitle: string;
  jojikNanoId: string;
  onAfterMutation: () => void;
  isAuthenticated: boolean;
};

export function SingleSelectionPanel({
  allimNanoId,
  allimTitle,
  jojikNanoId,
  onAfterMutation,
  isAuthenticated,
}: SingleSelectionPanelProps) {
  const { data: allimDetail, isLoading } = useGetJojikAllimDetailQuery(allimNanoId, {
    enabled: isAuthenticated && Boolean(allimNanoId),
  });

  const updateMutation = useUpdateJojikAllimMutation(allimNanoId);

  const handleCancelHadaAllim = async () => {
    try {
      await updateMutation.mutateAsync({ cancelHadaAllim: true });
      onAfterMutation();
    } catch (error) {
      console.error('Failed to cancel HADA allim:', error);
    }
  };

  const handleCancelSmsBalsin = async () => {
    try {
      await updateMutation.mutateAsync({ cancelSmsBalsin: true });
      onAfterMutation();
    } catch (error) {
      console.error('Failed to cancel SMS balsin:', error);
    }
  };

  const handleCancelKakaoBalsin = async () => {
    try {
      await updateMutation.mutateAsync({ cancelKakaoBalsin: true });
      onAfterMutation();
    } catch (error) {
      console.error('Failed to cancel Kakao balsin:', error);
    }
  };

  const handleCancelEmailBalsin = async () => {
    try {
      await updateMutation.mutateAsync({ cancelEmailBalsin: true });
      onAfterMutation();
    } catch (error) {
      console.error('Failed to cancel Email balsin:', error);
    }
  };

  const handleDeactivate = async () => {
    try {
      await updateMutation.mutateAsync({ isHwalseong: false });
      onAfterMutation();
    } catch (error) {
      console.error('Failed to deactivate allim:', error);
    }
  };

  if (isLoading) {
    return (
      <div css={cssObj.settingsPanel}>
        <p css={cssObj.loadingState}>알림 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!allimDetail) {
    return (
      <div css={cssObj.settingsPanel}>
        <p css={cssObj.emptyState}>알림 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const isJaewonsaeng = Boolean(allimDetail.jaewonsaengNanoId);
  const isTemplate = Boolean(allimDetail.allimTemplateNanoId);

  const getBranchType = () => {
    if (isJaewonsaeng) {
      return isTemplate ? '재원생 템플릿 알림' : '재원생 일반 알림';
    }
    return isTemplate ? '비재원생 템플릿 알림' : '비재원생 일반 알림';
  };

  return (
    <div css={cssObj.settingsPanel}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{allimTitle}</h2>
        <p css={cssObj.chip}>{getBranchType()}</p>
      </div>

      <div css={cssObj.panelBody}>
        <div css={cssObj.panelSection}>
          <div css={cssObj.formField}>
            <label css={cssObj.panelLabel}>알림 종류</label>
            <p css={cssObj.panelText}>{allimDetail.allimTypeName}</p>
          </div>

          <div css={cssObj.formField}>
            <label css={cssObj.panelLabel}>알림 제목</label>
            <p css={cssObj.panelText}>{allimDetail.title}</p>
          </div>

          <div css={cssObj.formField}>
            <label css={cssObj.panelLabel}>알림 내용</label>
            <p css={cssObj.panelText}>{allimDetail.content}</p>
          </div>
        </div>

        {allimDetail.hadaAllimInfo && (
          <div css={cssObj.panelSection}>
            <label css={cssObj.panelLabel}>HADA 알림</label>
            <p css={cssObj.panelText}>채널: {allimDetail.hadaAllimInfo.hadaAllimChannelName}</p>
            <p css={cssObj.panelText}>상태: {allimDetail.hadaAllimInfo.balsinSangtaeName}</p>
            {allimDetail.hadaAllimInfo.sendScheduleAt && (
              <p css={cssObj.panelText}>
                발송 예정: {formatDate(allimDetail.hadaAllimInfo.sendScheduleAt)}
              </p>
            )}
            {allimDetail.hadaAllimInfo.balsinSangtaeName.includes('대기') && (
              <Button
                variant="red"
                onClick={handleCancelHadaAllim}
                disabled={updateMutation.isPending}
              >
                HADA 발송 취소
              </Button>
            )}
          </div>
        )}

        {allimDetail.smsBalsinInfo && (
          <div css={cssObj.panelSection}>
            <label css={cssObj.panelLabel}>SMS 알림</label>
            <p css={cssObj.panelText}>발신번호: {allimDetail.smsBalsinInfo.smsBalsinBunhoNumber}</p>
            <p css={cssObj.panelText}>상태: {allimDetail.smsBalsinInfo.balsinSangtaeName}</p>
            {allimDetail.smsBalsinInfo.balsinSangtaeName.includes('대기') && (
              <Button
                variant="red"
                onClick={handleCancelSmsBalsin}
                disabled={updateMutation.isPending}
              >
                SMS 발송 취소
              </Button>
            )}
          </div>
        )}

        {allimDetail.kakaoBalsinInfo && (
          <div css={cssObj.panelSection}>
            <label css={cssObj.panelLabel}>카카오톡 알림</label>
            <p css={cssObj.panelText}>채널: {allimDetail.kakaoBalsinInfo.kakaoChannelName}</p>
            <p css={cssObj.panelText}>상태: {allimDetail.kakaoBalsinInfo.balsinSangtaeName}</p>
            {allimDetail.kakaoBalsinInfo.balsinSangtaeName.includes('대기') && (
              <Button
                variant="red"
                onClick={handleCancelKakaoBalsin}
                disabled={updateMutation.isPending}
              >
                카카오톡 발송 취소
              </Button>
            )}
          </div>
        )}

        {allimDetail.emailBalsinInfo && (
          <div css={cssObj.panelSection}>
            <label css={cssObj.panelLabel}>이메일 알림</label>
            <p css={cssObj.panelText}>발신자: {allimDetail.emailBalsinInfo.balsinjaName}</p>
            <p css={cssObj.panelText}>상태: {allimDetail.emailBalsinInfo.balsinSangtaeName}</p>
            {allimDetail.emailBalsinInfo.balsinSangtaeName.includes('대기') && (
              <Button
                variant="red"
                onClick={handleCancelEmailBalsin}
                disabled={updateMutation.isPending}
              >
                이메일 발송 취소
              </Button>
            )}
          </div>
        )}
      </div>

      <div css={cssObj.panelFooter}>
        <Button
          variant="secondary"
          onClick={handleDeactivate}
          disabled={updateMutation.isPending}
        >
          알림 비활성화하기
        </Button>
      </div>
    </div>
  );
}
