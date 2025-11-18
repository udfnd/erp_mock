'use client';

import React, { useMemo } from 'react';

import { Modal } from '@/common/components';
import { useGigwanQuery } from '@/domain/gigwan/api';
import { useGetSayongjaDetailQuery, useGetSayongjaPermissionsQuery } from '@/domain/sayongja/api';

import { modalStyles } from './MyProfileModal.style';

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
    <div css={modalStyles.infoRow}>
      <span css={modalStyles.infoLabel}>{label}</span>
      <span css={modalStyles.infoValue}>{value}</span>
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
        <span key="active" css={modalStyles.badge}>
          활성 사용자
        </span>,
      );
    } else {
      badges.push(
        <span key="inactive" css={[modalStyles.badge, modalStyles.mutedBadge]}>
          비활성 사용자
        </span>,
      );
    }
    if (sayongja.employmentSangtae?.name) {
      badges.push(
        <span key="employment" css={modalStyles.badge}>
          {sayongja.employmentSangtae.name}
        </span>,
      );
    }
    if (sayongja.workTypeSangtae?.name) {
      badges.push(
        <span key="workType" css={modalStyles.badge}>
          {sayongja.workTypeSangtae.name}
        </span>,
      );
    }
    return badges;
  }, [sayongja]);

  return (
    <div css={modalStyles.content}>
      <div css={modalStyles.tabLayout}>
        <section css={modalStyles.sectionCard}>
          <div css={modalStyles.sectionHeader}>
            <h3 css={modalStyles.sectionTitle}>기본 정보</h3>
            <p css={modalStyles.sectionDescription}>내 프로필의 기본 정보를 확인할 수 있습니다.</p>
          </div>
          <div css={modalStyles.sectionBody}>
            <InfoRow label="이름" value={sayongja?.name ?? userName ?? '정보 없음'} />
            <InfoRow label="로그인 아이디" value={sayongja?.loginId ?? '정보 없음'} />
            <InfoRow label="재직 기관" value={sayongja?.employedAt ?? '정보 없음'} />
            <InfoRow label="계정 생성" value={isSayongjaLoading ? '불러오는 중...' : formatDate(sayongja?.createdAt)} />
            <InfoRow
              label="상태"
              value={
                isSayongjaLoading ? (
                  '불러오는 중...'
                ) : statusBadges && statusBadges.length > 0 ? (
                  <span css={modalStyles.badgeRow}>{statusBadges}</span>
                ) : (
                  '정보 없음'
                )
              }
            />
          </div>
        </section>

        <section css={modalStyles.sectionCard}>
          <div css={modalStyles.sectionHeader}>
            <h3 css={modalStyles.sectionTitle}>기관 정보</h3>
            <p css={modalStyles.sectionDescription}>소속 기관의 기본 정보를 확인할 수 있습니다.</p>
          </div>
          <div css={modalStyles.sectionBody}>
            <InfoRow
              label="기관 이름"
              value={isGigwanLoading ? '불러오는 중...' : gigwan?.name ?? '기관 정보를 불러올 수 없습니다.'}
            />
            <InfoRow
              label="기관 소개"
              value={gigwan?.intro || (isGigwanLoading ? '불러오는 중...' : '기관 소개가 없습니다.')}
            />
            <InfoRow label="기관 식별자" value={gigwan?.nanoId ?? gigwanNanoId ?? '정보 없음'} />
          </div>
        </section>

        <section css={modalStyles.sectionCard}>
          <div css={modalStyles.sectionHeader}>
            <h3 css={modalStyles.sectionTitle}>기관 권한</h3>
            <p css={modalStyles.sectionDescription}>계정에 연결된 기관 권한을 확인할 수 있습니다.</p>
          </div>
          <div css={modalStyles.sectionBody}>
            {isPermissionsLoading ? (
              <span css={modalStyles.loadingText}>권한 정보를 불러오는 중입니다...</span>
            ) : (permissions?.permissions?.length ?? 0) > 0 ? (
              <div css={modalStyles.permissionList}>
                {permissions?.permissions?.map((permission) => (
                  <div key={permission.nanoId} css={modalStyles.permissionItem}>
                    <span css={modalStyles.permissionName}>{permission.name}</span>
                    <span css={modalStyles.permissionRole}>{permission.role}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span css={modalStyles.emptyState}>연결된 기관 권한이 없습니다.</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfilePhotoTab() {
  return (
    <div css={[modalStyles.sectionCard, modalStyles.centerAligned]}>
      <div css={modalStyles.profileImagePlaceholder}>이미지</div>
      <p css={modalStyles.sectionDescription}>프로필 사진 변경 기능은 곧 추가될 예정입니다.</p>
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
      title="사용자 관리"
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
