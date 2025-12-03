'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  BirthdayIcon,
  InfoBlackIcon,
  ParentIcon,
  PhoneIcon,
  StudentIcon,
  TimeIcon,
} from '@/common/icons';
import {
  useGetJaewonSincheongDetailQuery,
  useRejectJaewonSincheongMutation,
  useUpdateJaewonSincheongMutation,
} from '@/domain/jaewon-sincheong/api';
import { useGetJaewonsaengsQuery } from '@/domain/jaewonsaeng/api';
import { useBatchLinkJaewonsaengsMutation } from '@/domain/jaewonsaeng-group/api';

import { formatDateTime } from '../../constants';
import { cssObj } from '../../styles';

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
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const tooltipTriggerRef = useRef<HTMLDivElement>(null);
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

  const selectedJaewonsaengDetail = useMemo(
    () => jaewonsaengList?.jaewonsaengs.find((item) => item.nanoId === selectedJaewonsaeng),
    [jaewonsaengList?.jaewonsaengs, selectedJaewonsaeng],
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

  const toggleTooltip = () => {
    setIsTooltipOpen((prev) => {
      const next = !prev;
      if (!prev && tooltipTriggerRef.current) {
        const rect = tooltipTriggerRef.current.getBoundingClientRect();
        setTooltipPosition({ top: rect.bottom + 8, left: rect.left });
      } else if (prev) {
        setTooltipPosition(null);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isTooltipOpen) return;

    const updatePosition = () => {
      if (!tooltipTriggerRef.current) return;
      const rect = tooltipTriggerRef.current.getBoundingClientRect();
      setTooltipPosition({ top: rect.bottom + 8, left: rect.left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isTooltipOpen]);

  const detailRows = useMemo(
    () => [
      {
        icon: <TimeIcon />,
        label: '신청 시간',
        value: formatDateTime(detail?.createdAt),
      },
      {
        icon: <InfoBlackIcon />,
        label: '신청 상태',
        value: detail?.jaewonSincheongSangtaeName ?? '-',
      },
      {
        icon: <StudentIcon />,
        label: '학생 이름',
        value: detail?.haksaengProfile?.name ?? '-',
      },
      {
        icon: <PhoneIcon />,
        label: '학생 연락처',
        value: detail?.haksaengProfile?.phoneNumber ?? '-',
      },
      {
        icon: <BirthdayIcon />,
        label: '학생 생년월일',
        value: formatDateTime(detail?.haksaengProfile?.birthDate),
      },
      ...
        (detail?.bohojaProfiles?.flatMap((profile) => [
          {
            icon: <ParentIcon />,
            label: '보호자',
            value: `${profile.name} (${profile.gwangye})`,
          },
          {
            icon: <PhoneIcon />,
            label: '보호자 연락처',
            value: profile.phoneNumber,
          },
          {
            icon: <BirthdayIcon />,
            label: '보호자 생년월일',
            value: formatDateTime(profile.birthDate),
          },
        ]) ?? []),
      {
        icon: <InfoBlackIcon />,
        label: '신청 제목',
        value: effectiveTitle,
      },
    ],
    [detail?.bohojaProfiles, detail?.createdAt, detail?.haksaengProfile, detail?.jaewonSincheongSangtaeName, effectiveTitle],
  );

  return (
    <section css={cssObj.panel}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{effectiveTitle} 학생 재원생 신청</h2>
        <p css={cssObj.panelSubtitle}>
          {detail?.jaewonSincheongSangtaeName ?? '재원 신청 상태를 확인하세요.'}
        </p>
      </div>
      <div css={cssObj.panelContent}>
        {isLoading && <p css={cssObj.helperText}>재원 신청 정보를 불러오는 중입니다...</p>}
        {!isLoading && (
          <div css={cssObj.dataList}>
            {detailRows.map((row, index) => (
              <div key={`${row.label}:${index}`} css={cssObj.dataItem}>
                <span css={cssObj.dataIcon}>{row.icon}</span>
                <span css={cssObj.dataLabel}>{row.label}</span>
                <span css={cssObj.dataValue}>{row.value}</span>
              </div>
            ))}
            {!detailRows.length && <p css={cssObj.helperText}>재원 신청 정보를 불러오는 중입니다...</p>}
          </div>
        )}
        <div css={cssObj.panelActions}>
          <div css={cssObj.tooltipTrigger} ref={tooltipTriggerRef}>
            <Button
              styleType="outlined"
              variant="assistive"
              size="small"
              onClick={toggleTooltip}
              disabled={!isAuthenticated}
              aria-expanded={isTooltipOpen}
            >
              재원생 선택
            </Button>
            {isTooltipOpen && tooltipPosition && (
              <div css={cssObj.tooltip} style={tooltipPosition}>
                <div css={cssObj.tooltipHeader}>
                  <Textfield
                    singleLine
                    placeholder="재원생 이름 검색"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                  />
                </div>
                <div css={cssObj.tooltipContent}>
                  <div css={cssObj.tooltipListSection}>
                    <div css={cssObj.tooltipList}>
                      {jaewonsaengList?.jaewonsaengs?.length ? (
                        jaewonsaengList.jaewonsaengs.map((item) => (
                          <label key={item.nanoId} css={cssObj.tooltipListItem}>
                            <input
                              type="radio"
                              name="jaewonsaeng"
                              value={item.nanoId}
                              checked={selectedJaewonsaeng === item.nanoId}
                              onChange={() => setSelectedJaewonsaeng(item.nanoId)}
                            />
                            <span>{item.name}</span>
                          </label>
                        ))
                      ) : (
                        <p css={cssObj.helperText}>재원생을 불러오는 중입니다...</p>
                      )}
                    </div>
                  </div>
                  <div css={cssObj.tooltipSelectedSection}>
                    <span css={cssObj.selectedItemLabel}>선택된 재원생</span>
                    <div css={cssObj.selectedItemBox}>
                      {selectedJaewonsaengDetail ? (
                        <>
                          <span css={cssObj.selectedItemName}>{selectedJaewonsaengDetail.name}</span>
                          <span css={cssObj.selectedItemMeta}>{selectedJaewonsaengDetail.phoneNumber}</span>
                        </>
                      ) : (
                        <p css={cssObj.helperText}>선택된 재원생이 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div css={cssObj.tooltipActions}>
                  <Button
                    styleType="solid"
                    variant="secondary"
                    size="small"
                    onClick={handleApprove}
                    disabled={!selectedJaewonsaeng || updateMutation.isPending}
                  >
                    연결
                  </Button>
                  <Button styleType="outlined" variant="assistive" size="small" onClick={toggleTooltip}>
                    닫기
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div css={cssObj.actionButtons}>
            <Button
              variant="primary"
              onClick={handleApprove}
              disabled={!selectedJaewonsaeng || updateMutation.isPending}
            >
              재원생 연결 및 승인
            </Button>
            <Button
              variant="secondary"
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
