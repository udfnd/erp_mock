'use client';

import React, { useMemo } from 'react';

import { Modal, Textfield } from '@/common/components';
import { useGigwanQuery } from '@/domain/gigwan/api';
import { useGetSayongjaDetailQuery, useGetSayongjaPermissionsQuery } from '@/domain/sayongja/api';

import { cssObj } from './MyProfileModal.style';
import { LicenseIcon } from '@/common/icons';

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
            <span css={cssObj.basicDataLabel}>기본 데이터</span>
            <div css={cssObj.basicDataWrapper}>
              <div>
                <span>생성</span>
                <p>{formatDate(sayongja?.createdAt)}</p>
              </div>
              <div>
                <span>기관 소유자 여부</span>
                <p>예</p>
              </div>
            </div>
            <Textfield label="이름" value={sayongja?.name ?? ''} readOnly disabled singleLine />
            <Textfield
              label="입사일"
              value={sayongja?.employedAt ?? ''}
              readOnly
              disabled
              singleLine
            />
            <Textfield
              label="재직 상태"
              value={sayongja?.employmentSangtae?.name ?? ''}
              readOnly
              disabled
              singleLine
            />
            <Textfield
              label="근무 형태"
              value={sayongja?.workTypeSangtae?.name ?? ''}
              readOnly
              disabled
              singleLine
            />
            <Textfield
              label="계정 활성 상태"
              value={sayongja?.isHwalseong ? '활성중' : '비활성중'}
              readOnly
              disabled
              singleLine
            />
          </div>
        </section>
        <section css={cssObj.sectionCard}>
          <div css={cssObj.sectionHeader}>
            <h3 css={cssObj.sectionTitle}>기관 정보</h3>
          </div>
          <div css={cssObj.sectionBody}>
            <Textfield label="기관 이름" value={gigwan?.name ?? ''} readOnly disabled singleLine />
            <Textfield label="기관 소개" value={gigwan?.intro ?? ''} readOnly disabled />
          </div>
        </section>
        <section css={cssObj.sectionCard}>
          <div css={cssObj.sectionHeader}>
            <h3 css={cssObj.sectionTitle}>기관 권한</h3>
          </div>
          <span css={cssObj.basicDataLabel}>권한 확인</span>

          <div css={cssObj.sectionBody}>
            {isPermissionsLoading ? (
              <span css={cssObj.loadingText}>권한 정보를 불러오는 중입니다...</span>
            ) : (permissions?.permissions?.length ?? 0) > 0 ? (
              <div css={cssObj.permissionList}>
                {permissions?.permissions?.map((permission) => (
                  <div key={permission.nanoId} css={cssObj.permissionItem}>
                    <div>
                      <LicenseIcon />
                      <span css={cssObj.permissionName}>{permission.name}</span>
                    </div>
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
