'use client';

import { useMemo, useState } from 'react';
import { css } from '@emotion/react';

import { Button, Textfield } from '@/common/components';
import {
  useGetJaewonSincheongDetailQuery,
  useRejectJaewonSincheongMutation,
  useUpdateJaewonSincheongMutation,
} from '@/domain/jaewon-sincheong/api';
import { useGetJaewonsaengsQuery } from '@/domain/jaewonsaeng/api';
import { useBatchLinkJaewonsaengsMutation } from '@/domain/jaewonsaeng-group/api';

import { formatDateTime } from './constants';
import { cssObj } from './styles';

type Props = {
  requestNanoId: string;
  requestName: string;
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export function SingleSelectionPanel({
  requestNanoId,
  requestName,
  jojikNanoId,
  onAfterMutation,
  isAuthenticated,
}: Props) {
  const { data: detail, isLoading } = useGetJaewonSincheongDetailQuery(requestNanoId, {
    enabled: isAuthenticated && Boolean(requestNanoId),
  });
  const updateMutation = useUpdateJaewonSincheongMutation(requestNanoId);
  const rejectMutation = useRejectJaewonSincheongMutation(requestNanoId);
  const batchLinkMutation = useBatchLinkJaewonsaengsMutation();

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [selectedJaewonsaeng, setSelectedJaewonsaeng] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');

  const { data: jaewonsaengList } = useGetJaewonsaengsQuery(
    {
      jojikNanoId,
      pageNumber: 1,
      pageSize: 10,
      sortByOption: 'nameAsc',
      jaewonsaengNameSearch: searchValue || undefined,
    },
    { enabled: isTooltipOpen && isAuthenticated && Boolean(jojikNanoId) },
  );

  const handleApprove = async () => {
    if (!selectedJaewonsaeng) return;
    await updateMutation.mutateAsync({ jaewonsaengNanoId: selectedJaewonsaeng });
    await batchLinkMutation.mutateAsync({
      nanoId: requestNanoId,
      data: { jaewonsaengNanoIds: [selectedJaewonsaeng] },
    });
    await onAfterMutation();
  };

  const handleReject = async () => {
    await rejectMutation.mutateAsync();
    await onAfterMutation();
  };

  const effectiveTitle = detail?.jaewonSincheongName ?? requestName;
  const bohojaText = useMemo(
    () => detail?.bohojaProfiles.map((profile) => `${profile.name} (${profile.gwangye})`).join(', ') ?? '-',
    [detail?.bohojaProfiles],
  );

  return (
    <section css={cssObj.panel}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{effectiveTitle}</h2>
        <p css={cssObj.panelSubtitle}>{detail?.jaewonSincheongSangtaeName ?? '재원 신청 상태를 확인하세요.'}</p>
      </div>
      <div css={contentStyle}>
        {isLoading && <p css={cssObj.helperText}>재원 신청 정보를 불러오는 중입니다...</p>}
        {!isLoading && (
          <dl css={cssObj.detailList}>
            <div css={cssObj.detailItem}>
              <dt css={cssObj.detailLabel}>신청 시간</dt>
              <dd css={cssObj.detailValue}>{formatDateTime(detail?.createdAt)}</dd>
            </div>
            <div css={cssObj.detailItem}>
              <dt css={cssObj.detailLabel}>하다 프로필</dt>
              <dd css={cssObj.detailValue}>{detail?.haksaengProfile?.name ?? '-'}</dd>
            </div>
            <div css={cssObj.detailItem}>
              <dt css={cssObj.detailLabel}>보호자</dt>
              <dd css={cssObj.detailValue}>{bohojaText}</dd>
            </div>
          </dl>
        )}
        <div css={actionsStyle}>
          <div css={tooltipTriggerStyle}>
            <Button size="sm" onClick={() => setIsTooltipOpen((prev) => !prev)} disabled={!isAuthenticated}>
              재원생 선택
            </Button>
            {isTooltipOpen && (
              <div css={tooltipStyle}>
                <Textfield
                  placeholder="재원생 이름 검색"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <div css={listStyle}>
                  {jaewonsaengList?.jaewonsaengs.map((item) => (
                    <label key={item.nanoId} css={listItemStyle}>
                      <input
                        type="radio"
                        name="jaewonsaeng"
                        value={item.nanoId}
                        checked={selectedJaewonsaeng === item.nanoId}
                        onChange={() => setSelectedJaewonsaeng(item.nanoId)}
                      />
                      <span>{item.name}</span>
                    </label>
                  )) ?? <p css={cssObj.helperText}>재원생을 불러오는 중입니다...</p>}
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleApprove}
                  disabled={!selectedJaewonsaeng || updateMutation.isPending}
                >
                  연결
                </Button>
              </div>
            )}
          </div>
          <div css={actionButtonsStyle}>
            <Button
              variant="primary"
              onClick={handleApprove}
              disabled={!selectedJaewonsaeng || updateMutation.isPending}
            >
              재원생 연결 및 승인
            </Button>
            <Button
              variant="ghost"
              color="red"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              반려
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const contentStyle = css({ display: 'flex', flexDirection: 'column', gap: 12 });
const actionsStyle = css({ display: 'flex', flexDirection: 'column', gap: 12 });
const tooltipTriggerStyle = css({ position: 'relative', alignSelf: 'flex-start' });
const tooltipStyle = css({
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: 8,
  padding: 12,
  width: 260,
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  zIndex: 10,
});
const listStyle = css({ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 });
const listItemStyle = css({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 });
const actionButtonsStyle = css({ display: 'flex', gap: 8 });
