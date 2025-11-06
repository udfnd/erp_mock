'use client';

import Image from 'next/image';
import { RefObject, useEffect, useMemo, useRef } from 'react';

import { Button } from '@/common/components';
import type { AuthHistoryEntry } from '@/global/auth';

import * as styles from './MyProfileMenu.style';

type MyProfileMenuProps = {
  gigwanName: string | null;
  userName: string;
  profileImageUrl: string;
  history: AuthHistoryEntry[];
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onSelectHistory: (entry: AuthHistoryEntry) => void;
  onAddUser: () => void;
  onLogout: () => void;
};

export default function MyProfileMenu({
  gigwanName,
  userName,
  profileImageUrl,
  history,
  anchorRef,
  onClose,
  onSelectHistory,
  onAddUser,
  onLogout,
}: MyProfileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [anchorRef, onClose]);

  const recentHistory = useMemo(() => history ?? [], [history]);

  return (
    <div
      ref={containerRef}
      css={styles.container}
      role="dialog"
      aria-modal="false"
      aria-label="내 프로필 메뉴"
    >
      <div css={styles.header}>
        <Image
          src={profileImageUrl}
          alt="내 프로필 이미지"
          width={48}
          height={48}
          css={styles.profileImage}
          unoptimized
        />
        <div css={styles.userInfo}>
          <span css={styles.userName}>{userName}</span>
          <span css={styles.gigwanName}>{gigwanName ?? '기관 정보 없음'}</span>
        </div>
        <button type="button" css={styles.closeButton} onClick={onClose} aria-label="메뉴 닫기">
          ×
        </button>
      </div>
      <div css={styles.historySection}>
        <span css={styles.historyTitle}>같은 기관의 다른 사용자</span>
        <div css={styles.historyList}>
          {recentHistory.length === 0 ? (
            <span css={styles.historyEmpty}>같은 기관의 다른 사용자가 없습니다.</span>
          ) : (
            recentHistory.map((entry) => (
              <button
                key={entry.sayongjaNanoId}
                type="button"
                css={styles.historyButton}
                onClick={() => onSelectHistory(entry)}
              >
                <span css={styles.historyButtonName}>{entry.sayongjaName}</span>
                {entry.gigwanName ? (
                  <span css={styles.historyButtonGigwan}>{entry.gigwanName}</span>
                ) : null}
              </button>
            ))
          )}
        </div>
      </div>
      <div css={styles.actions}>
        <Button styleType="text" variant="secondary" size="small" onClick={onLogout}>
          로그아웃
        </Button>
        <Button styleType="outlined" variant="secondary" size="small" onClick={onAddUser}>
          사용자 관리로 이동
        </Button>
      </div>
    </div>
  );
}
