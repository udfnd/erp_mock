'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { useUpdateMyPasswordMutation } from '@/api/auth';
import { useGigwanQuery } from '@/api/gigwan';
import { useGetSayongjaDetailQuery } from '@/api/sayongja';
import { Close } from '@/components/icons';
import { Button } from '@/design';

import * as styles from './UserSettingsModal.style.css';

export type UserSettingsTab = 'profile' | 'photo' | 'password';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeTab: UserSettingsTab;
  onTabChange: (tab: UserSettingsTab) => void;
  sayongjaNanoId?: string | null;
  gigwanNanoId?: string | null;
};

const TAB_LABELS: Record<UserSettingsTab, string> = {
  profile: '프로필 정보',
  photo: '프로필 사진 변경',
  password: '비밀번호 변경',
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export default function UserSettingsModal({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  sayongjaNanoId,
  gigwanNanoId,
}: Props) {
  const { data: sayongjaDetail } = useGetSayongjaDetailQuery(sayongjaNanoId ?? '', {
    enabled: isOpen && Boolean(sayongjaNanoId),
  });

  const { data: gigwanDetail } = useGigwanQuery(gigwanNanoId ?? '', {
    enabled: isOpen && Boolean(gigwanNanoId),
  });

  const updatePasswordMutation = useUpdateMyPasswordMutation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    return () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFormError(null);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const profileItems = useMemo(
    () => [
      { label: '이름', value: sayongjaDetail?.name ?? '-' },
      { label: '로그인 ID', value: sayongjaDetail?.loginId ?? '-' },
      { label: '입사일', value: formatDate(sayongjaDetail?.employedAt) },
      {
        label: '근무 유형',
        value: sayongjaDetail?.workTypeSangtae?.name ?? '설정되지 않음',
      },
      {
        label: '재직 상태',
        value: sayongjaDetail?.employmentSangtae?.name ?? '설정되지 않음',
      },
      {
        label: '계정 생성일',
        value: formatDate(sayongjaDetail?.createdAt),
      },
    ],
    [sayongjaDetail],
  );

  const gigwanItems = useMemo(
    () => [
      { label: '기관명', value: gigwanDetail?.name ?? '-' },
      { label: '기관 ID', value: gigwanDetail?.nanoId ?? '-' },
      {
        label: '소개',
        value: gigwanDetail?.intro ? gigwanDetail.intro : '등록된 소개가 없습니다.',
      },
      {
        label: '주소',
        value: gigwanDetail?.juso
          ? `${gigwanDetail.juso.juso} ${gigwanDetail.juso.jusoDetail}`.trim()
          : '등록된 주소가 없습니다.',
      },
    ],
    [gigwanDetail],
  );

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!currentPassword || !newPassword) {
      setFormError('현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    updatePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          window.alert('비밀번호가 성공적으로 변경되었습니다.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
        onError: () => {
          setFormError('비밀번호를 변경하는 중 문제가 발생했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.dialog}>
        <nav className={styles.sideNav} aria-label="사용자 설정 탭">
          {(Object.keys(TAB_LABELS) as UserSettingsTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={styles.sideNavButton[tab === activeTab ? 'active' : 'inactive']}
              onClick={() => onTabChange(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>
        <div className={styles.content}>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="닫기">
            <Close width={20} height={20} />
          </button>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>{TAB_LABELS[activeTab]}</h2>
          </div>

          {activeTab === 'profile' && (
            <div className={styles.section}>
              <div>
                <h3 className={styles.contentTitle} style={{ fontSize: '18px' }}>
                  사용자 정보
                </h3>
                <p className={styles.description}>로그인 정보와 조직 정보를 확인할 수 있습니다.</p>
                <dl className={styles.infoGrid}>
                  {profileItems.map((item) => (
                    <React.Fragment key={item.label}>
                      <dt className={styles.infoTerm}>{item.label}</dt>
                      <dd className={styles.infoDescription}>{item.value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>

              <div>
                <h3 className={styles.contentTitle} style={{ fontSize: '18px' }}>
                  기관 정보
                </h3>
                <p className={styles.description}>연결된 기관의 기본 정보를 확인하세요.</p>
                <dl className={styles.infoGrid}>
                  {gigwanItems.map((item) => (
                    <React.Fragment key={item.label}>
                      <dt className={styles.infoTerm}>{item.label}</dt>
                      <dd className={styles.infoDescription}>{item.value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'photo' && (
            <div className={styles.section}>
              <p className={styles.placeholder}>프로필 사진 변경 기능은 곧 제공될 예정입니다.</p>
            </div>
          )}

          {activeTab === 'password' && (
            <form className={styles.passwordForm} onSubmit={handlePasswordSubmit}>
              <div className={styles.formField}>
                <label htmlFor="current-password" className={styles.formLabel}>
                  현재 비밀번호
                </label>
                <input
                  id="current-password"
                  type="password"
                  className={styles.textInput}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="new-password" className={styles.formLabel}>
                  새 비밀번호
                </label>
                <input
                  id="new-password"
                  type="password"
                  className={styles.textInput}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="confirm-password" className={styles.formLabel}>
                  새 비밀번호 확인
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className={styles.textInput}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>

              {formError && <span className={styles.errorText}>{formError}</span>}

              <div className={styles.passwordFormActions}>
                <Button
                  type="button"
                  styleType="ghost"
                  variant="secondary"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setFormError(null);
                  }}
                >
                  초기화
                </Button>
                <Button type="submit" disabled={updatePasswordMutation.isPending}>
                  {updatePasswordMutation.isPending ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
