'use client';

import React, { useMemo } from 'react';

import { Modal } from '@/common/components';
import { useGigwanQuery } from '@/domain/gigwan/api';
import { useGetSayongjaDetailQuery, useGetSayongjaPermissionsQuery } from '@/domain/sayongja/api';

import { cssObj } from './MyProfileModal.style';

type MyProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sayongjaNanoId: string | null;
  gigwanNanoId: string | null;
  userName: string;
};

const formatDate = (value?: string | null) => {
  if (!value) return '정보 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div css={cssObj.infoRow}>
      <span css={cssObj.infoLabel}>{label}</span>
      <span css={cssObj.infoValue}>{value}</span>
    </div>
  );
}

function ProfileInformationTab({
  sayongjaNanoId,
  gigwanNanoId,
  userName,
  isOpen,
}: {
  sayongjaNanoId: string | null;
  gigwanNanoId: string | null;
  userName: string;
  isOpen: boolean;
}) {
  const { data: sayongja, isLoading: isSayongjaLoading } = useGetSayongjaDetailQuery(
    sayongjaNanoId ?? '',
    {
      enabled: Boolean(sayongjaNanoId) && isOpen,
    },
  );

  const { data: gigwan, isLoading: isGigwanLoading } = useGigwanQuery(gigwanNanoId ?? '', {
    enabled: Boolean(gigwanNanoId) && isOpen,
  });

  const { data: permissions, isLoading: isPermissionsLoading } = useGetSayongjaPermissionsQuery(
    sayongjaNanoId ?? '',
    {
      enabled: Boolean(sayongjaNanoId) && isOpen,
    },
  );

  const statusBadges = useMemo(() => {
    if (!sayongja) return null;
    const badges = [] as React.ReactNode[];
    if (sayongja.isHwalseong) {
      badges.push(
        <span key="active" css={cssObj.badge}>
          활성 사용자
        </span>,
      );
    } else {
      badges.push(
        <span key="inactive" css={[cssObj.badge, cssObj.mutedBadge]}>
          비활성 사용자
        </span>,
      );
    }
    if (sayongja.employmentSangtae?.name) {
      badges.push(
        <span key="employment" css={cssObj.badge}>
          {sayongja.employmentSangtae.name}
        </span>,
      );
    }
    if (sayongja.workTypeSangtae?.name) {
      badges.push(
        <span key="workType" css={cssObj.badge}>
          {sayongja.workTypeSangtae.name}
        </span>,
      );
    }
    return badges;
  }, [sayongja]);

  return (
    <div css={cssObj.content}>
      <div css={cssObj.tabLayout}>
        <section css={cssObj.sectionCard}>
          <div css={cssObj.sectionHeader}>
            <h3 css={cssObj.sectionTitle}>기본 정보</h3>
          </div>
          <div css={cssObj.sectionBody}>
            <InfoRow label="이름" value={sayongja?.name ?? userName ?? '정보 없음'} />
            <InfoRow label="로그인 아이디" value={sayongja?.loginId ?? '정보 없음'} />
            <InfoRow label="재직 기관" value={sayongja?.employedAt ?? '정보 없음'} />
            <InfoRow
              label="계정 생성"
              value={isSayongjaLoading ? '불러오는 중...' : formatDate(sayongja?.createdAt)}
            />
            <InfoRow
              label="상태"
              value={
                isSayongjaLoading ? (
                  '불러오는 중...'
                ) : statusBadges && statusBadges.length > 0 ? (
                  <span css={cssObj.badgeRow}>{statusBadges}</span>
                ) : (
                  '정보 없음'
                )
              }
            />
          </div>
        </section>
        <section css={cssObj.sectionCard}>
          <div css={cssObj.sectionHeader}>
            <h3 css={cssObj.sectionTitle}>기관 정보</h3>
          </div>
          <div css={cssObj.sectionBody}>
            <InfoRow
              label="기관 이름"
              value={
                isGigwanLoading
                  ? '불러오는 중...'
                  : (gigwan?.name ?? '기관 정보를 불러올 수 없습니다.')
              }
            />
            <InfoRow
              label="기관 소개"
              value={
                gigwan?.intro || (isGigwanLoading ? '불러오는 중...' : '기관 소개가 없습니다.')
              }
            />
            <InfoRow label="기관 식별자" value={gigwan?.nanoId ?? gigwanNanoId ?? '정보 없음'} />
          </div>
        </section>
        <section css={cssObj.sectionCard}>
          <div css={cssObj.sectionHeader}>
            <h3 css={cssObj.sectionTitle}>기관 권한</h3>
          </div>
          <div css={cssObj.sectionBody}>
            {isPermissionsLoading ? (
              <span css={cssObj.loadingText}>권한 정보를 불러오는 중입니다...</span>
            ) : (permissions?.permissions?.length ?? 0) > 0 ? (
              <div css={cssObj.permissionList}>
                {permissions?.permissions?.map((permission) => (
                  <div key={permission.nanoId} css={cssObj.permissionItem}>
                    <span css={cssObj.permissionName}>{permission.name}</span>
                    <span css={cssObj.permissionRole}>{permission.role}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span css={cssObj.emptyState}>연결된 기관 권한이 없습니다.</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfilePhotoTab() {
  return (
    <div css={[cssObj.sectionCard, cssObj.centerAligned]}>
      <div css={cssObj.profileImagePlaceholder}>이미지</div>
      <p css={cssObj.sectionDescription}>프로필 사진 변경 기능은 곧 추가될 예정입니다.</p>
    </div>
  );
}

export default function MyProfileModal({
  isOpen,
  onClose,
  sayongjaNanoId,
  gigwanNanoId,
  userName,
}: MyProfileModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="사용자 설정"
      menus={[
        {
          id: 'profile-info',
          label: '프로필 정보',
          content: (
            <ProfileInformationTab
              sayongjaNanoId={sayongjaNanoId}
              gigwanNanoId={gigwanNanoId}
              userName={userName}
              isOpen={isOpen}
            />
          ),
        },
        {
          id: 'profile-photo',
          label: '프로필 사진 변경',
          content: <ProfilePhotoTab />,
        },
      ]}
      initialMenuId="profile-info"
    />
  );
}
