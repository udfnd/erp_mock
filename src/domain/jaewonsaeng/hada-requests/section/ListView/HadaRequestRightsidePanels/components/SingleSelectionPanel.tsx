'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';

import { Button } from '@/common/components';
import {
  BirthdayIcon,
  InfoBlackIcon,
  ParentIcon,
  PhoneIcon,
  StudentIcon,
  TimeIcon,
  XCircleBlackIcon,
} from '@/common/icons';
import { ListSection, type ListViewSortProps } from '@/common/lv/component';
import { useListViewState } from '@/common/lv';
import { ToolbarLayout } from '@/common/lv/layout';
import {
  useGetJaewonSincheongDetailQuery,
  useRejectJaewonSincheongMutation,
  useUpdateJaewonSincheongMutation,
} from '@/domain/jaewon-sincheong/api';
import { useGetJaewonsaengsQuery } from '@/domain/jaewonsaeng/api';
import { useBatchLinkJaewonsaengsMutation } from '@/domain/jaewonsaeng-group/api';

import {
  SORT_OPTIONS,
  columnHelper,
  getSortOptionFromState,
  getSortStateFromOption,
} from '@/domain/jaewonsaeng/section/ListView/constants';
import type { JaewonsaengListItem } from '@/domain/jaewonsaeng/api';

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
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(
    null,
  );
  const tooltipTriggerRef = useRef<HTMLDivElement>(null);
  const [selectedJaewonsaeng, setSelectedJaewonsaeng] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const jaewonsaengListState = useListViewState<JaewonsaengListItem>({
    initialSorting: getSortStateFromOption('nameAsc'),
    initialPagination: { pageIndex: 0, pageSize: 10 },
  });

  const {
    sorting,
    pagination,
    setSorting,
    setPagination,
    setRowSelection: setJaewonsaengRowSelection,
  } = jaewonsaengListState;

  const jaewonsaengSortValue = getSortOptionFromState(sorting) ?? 'nameAsc';

  const {
    data: jaewonsaengList,
    isLoading: isJaewonsaengLoading,
    isError: isJaewonsaengError,
  } = useGetJaewonsaengsQuery(
    {
      jojikNanoId,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortByOption: jaewonsaengSortValue,
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

  const effectiveTitle = detail?.haksaengProfile.name ?? requestName;

  const computeTooltipPosition = useCallback(() => {
    const trigger = tooltipTriggerRef.current;
    if (!trigger) return null;

    const rect = trigger.getBoundingClientRect();
    const TOOLTIP_WIDTH = 675;
    const MARGIN = 12;

    const left = Math.max(12, rect.left - TOOLTIP_WIDTH - MARGIN);
    const top = Math.max(12, rect.top);

    return { top, left };
  }, []);

  const saveTooltip = useCallback(() => {
    setIsTooltipOpen(false);
    setTooltipPosition(null);
    setSearchValue('');
    setIsSearchFocused(false);
  }, []);

  const closeTooltip = useCallback(() => {
    setIsTooltipOpen(false);
    setTooltipPosition(null);
    setSelectedJaewonsaeng('');
    setSearchValue('');
    setJaewonsaengRowSelection({});
  }, [setJaewonsaengRowSelection]);

  const toggleTooltip = useCallback(() => {
    setIsTooltipOpen((prev) => {
      const next = !prev;

      if (!prev) {
        const pos = computeTooltipPosition();
        if (pos) {
          setTooltipPosition(pos);
        }
      } else {
        setTooltipPosition(null);
        setSelectedJaewonsaeng('');
        setSearchValue('');
        setJaewonsaengRowSelection({});
        setIsSearchFocused(false);
      }

      return next;
    });
  }, [computeTooltipPosition, setJaewonsaengRowSelection]);

  useEffect(() => {
    if (!isTooltipOpen) return;

    const updatePosition = () => {
      const pos = computeTooltipPosition();
      if (pos) {
        setTooltipPosition(pos);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isTooltipOpen, computeTooltipPosition]);

  const infoRows = useMemo(
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
    ],
    [detail?.createdAt, detail?.jaewonSincheongSangtaeName],
  );

  const studentRows = useMemo(
    () => [
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
    ],
    [detail?.haksaengProfile],
  );

  const bohojaRows = useMemo(
    () =>
      detail?.bohojaProfiles?.map((profile) => ({
        gwangye: profile.gwangye,
        rows: [
          {
            icon: <ParentIcon />,
            label: '보호자',
            value: `${profile.name}`,
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
        ],
      })) ?? [],
    [detail?.bohojaProfiles],
  );

  const availableJaewonsaengs = jaewonsaengList?.jaewonsaengs ?? [];
  const totalCount =
    (jaewonsaengList?.paginationData?.totalItemCount as number | undefined) ??
    availableJaewonsaengs.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const jaewonsaengColumns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '이름',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('boninPhoneNumber', {
        header: '학생 연락처',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('bohojaPhoneNumberFirst', {
        header: '보호자1 연락처',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('bohojaPhoneNumberSecond', {
        header: '보호자2 연락처',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('jaewonCategorySangtaeName', {
        header: '재원 상태',
        cell: (info) => info.getValue(),
      }),
    ],
    [],
  ) as ColumnDef<JaewonsaengListItem, unknown>[];

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSorting(getSortStateFromOption(value));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleDimmerClick = () => {
    setIsSearchFocused(false);
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleRowsChange = useCallback((rows: Row<JaewonsaengListItem>[]) => {
    const selected = rows[0]?.original;
    setSelectedJaewonsaeng(selected?.nanoId ?? '');
  }, []);

  const sortProps: ListViewSortProps = {
    options: SORT_OPTIONS,
    value: jaewonsaengSortValue,
    onChange: handleSortChange,
  };

  return (
    <section css={cssObj.panel}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{effectiveTitle} 학생 재원생 신청</h2>
      </div>
      <div css={cssObj.panelContent}>
        {isLoading && <p css={cssObj.helperText}>재원 신청 정보를 불러오는 중입니다...</p>}
        {!isLoading && (
          <div css={cssObj.dataList}>
            <p css={cssObj.panelSubtitle}>재원생 신청</p>
            {infoRows.map((row, index) => (
              <div key={`${row.label}:${index}`} css={cssObj.dataItem}>
                <span css={cssObj.dataIcon}>{row.icon}</span>
                <span css={cssObj.dataLabel}>{row.label}</span>
                <span css={cssObj.dataValue}>{row.value}</span>
              </div>
            ))}
            <div css={cssObj.dataSubsection}>
              <p>본인</p>
              {studentRows.map((row, index) => (
                <div key={`${row.label}:${index}`} css={cssObj.dataItem}>
                  <span css={cssObj.dataIcon}>{row.icon}</span>
                  <span css={cssObj.dataLabel}>{row.label}</span>
                  <span css={cssObj.dataValue}>{row.value}</span>
                </div>
              ))}
            </div>
            {bohojaRows.map((bohoja, bohojaIndex) => (
              <div key={`bohoja:${bohojaIndex}`} css={cssObj.dataSubsection}>
                <p>보호자</p>
                <span css={cssObj.gwangyeChip}>{bohoja.gwangye}</span>
                {bohoja.rows.map((row, rowIndex) => (
                  <div key={`${row.label}:${bohojaIndex}:${rowIndex}`} css={cssObj.dataItem}>
                    <span css={cssObj.dataIcon}>{row.icon}</span>
                    <span css={cssObj.dataLabel}>{row.label}</span>
                    <span css={cssObj.dataValue}>{row.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {detail?.jaewonSincheongSangtaeName !== '수락' ? (
          <div css={cssObj.panelActions}>
            <div
              css={[cssObj.sectionActions, cssObj.permissionActionContainer]}
              ref={tooltipTriggerRef}
            >
              <Button
                styleType="outlined"
                variant="assistive"
                size="small"
                isFull
                onClick={toggleTooltip}
                disabled={!isAuthenticated}
                aria-expanded={isTooltipOpen}
                iconLeft={<StudentIcon />}
              >
                재원생 선택
              </Button>
              {isTooltipOpen && tooltipPosition && (
                <div css={cssObj.permissionTooltip} style={tooltipPosition}>
                  <div css={cssObj.permissionTooltipHeader}>
                    <p css={cssObj.tooltipTitle}>재원생 검색</p>
                    <button
                      css={cssObj.tooltipCloseButton}
                      onClick={closeTooltip}
                      aria-label="닫기"
                    >
                      <XCircleBlackIcon />
                    </button>
                  </div>
                  <ToolbarLayout
                    search={{
                      value: searchValue,
                      onChange: handleSearchChange,
                      placeholder: '재원생 이름 검색',
                    }}
                    sort={sortProps}
                    totalCount={totalCount}
                    onSearchFocusChange={setIsSearchFocused}
                  />
                  <div css={cssObj.permissionTooltipContent}>
                    <div css={cssObj.permissionTooltipTable}>
                      <ListSection
                        data={availableJaewonsaengs}
                        columns={jaewonsaengColumns}
                        state={jaewonsaengListState}
                        manualPagination
                        manualSorting
                        pageCount={totalPages}
                        isLoading={isJaewonsaengLoading}
                        loadingMessage="재원생을 불러오는 중입니다..."
                        emptyMessage="조건에 맞는 재원생이 없습니다. 검색어나 정렬을 조정해 보세요."
                        isDimmed={isSearchFocused}
                        rowEventHandlers={{ selectOnClick: true }}
                        onSelectedRowsChange={handleRowsChange}
                        onDimmerClick={handleDimmerClick}
                      />
                    </div>
                    <div css={cssObj.permissionTooltipSelected}>
                      <span css={cssObj.selectedPermissionLabel}>선택된 재원생들</span>
                      <div css={cssObj.selectedPermissionList}>
                        {selectedJaewonsaengDetail ? (
                          <div css={cssObj.selectedPermissionItem}>
                            <div css={cssObj.selectedPermissionLabel}>
                              {selectedJaewonsaengDetail.name}
                            </div>
                            <button
                              css={cssObj.deleteItemButton}
                              onClick={() => setSelectedJaewonsaeng('')}
                            >
                              <XCircleBlackIcon />
                            </button>
                          </div>
                        ) : (
                          <p css={cssObj.helperText}>선택된 재원생이 없습니다.</p>
                        )}
                      </div>
                      <div css={cssObj.permissionTooltipActions}>
                        <Button
                          styleType="solid"
                          variant="secondary"
                          size="small"
                          onClick={saveTooltip}
                          disabled={!selectedJaewonsaeng || updateMutation.isPending}
                        >
                          선택 완료
                        </Button>
                      </div>
                    </div>
                  </div>
                  {isJaewonsaengError && (
                    <p css={cssObj.helperText}>재원생 목록을 불러오지 못했습니다.</p>
                  )}
                </div>
              )}
            </div>
            <div css={cssObj.actionButtons}>
              <Button
                isFull
                size="small"
                variant="primary"
                onClick={handleApprove}
                disabled={!selectedJaewonsaeng || updateMutation.isPending}
              >
                재원생 연결 및 승인
              </Button>
              <Button
                isFull
                size="small"
                variant="red"
                onClick={handleReject}
                disabled={rejectMutation.isPending}
              >
                재원생 연결 반려
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p css={cssObj.panelSubtitle}>연결된 재원생</p>
            <div css={cssObj.jaewonsaengInfoSection}>
              <p>본인 정보</p>
              <div css={cssObj.jaewonsaengInfoBox}></div>
              <p>연동 보호자 정보</p>
              <div css={cssObj.jaewonsaengInfoBox}></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
