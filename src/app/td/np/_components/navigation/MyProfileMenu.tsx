'use client';

import Image from 'next/image';
import { RefObject, useEffect, useMemo, useRef } from 'react';

import { Button } from '@/common/components';
import type { AuthHistoryEntry } from '@/global/auth';

import * as styles from './MyProfileMenu.style.css';

type MyProfileMenuProps = {
  gigwanName: string | null;
  userName: string;
  profileImageUrl: string;
  history: AuthHistoryEntry[];
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onSelectHistory: (entry: AuthHistoryEntry) => void;
  onAddUser: () => void;
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
      className={styles.container}
      role="dialog"
      aria-modal="false"
      aria-label="내 프로필 메뉴"
    >
      <div className={styles.header}>
        <Image
          src={profileImageUrl}
          alt="내 프로필 이미지"
          width={48}
          height={48}
          className={styles.profileImage}
          unoptimized
        />
        <div className={styles.userInfo}>
          <span className={styles.userName}>{userName}</span>
          <span className={styles.gigwanName}>{gigwanName ?? '기관 정보 없음'}</span>
        </div>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="메뉴 닫기">
          ×
        </button>
      </div>
      <div className={styles.historySection}>
        <span className={styles.historyTitle}>최근 전환한 계정</span>
        <div className={styles.historyList}>
          {recentHistory.length === 0 ? (
            <span className={styles.historyEmpty}>최근 전환한 계정이 없습니다.</span>
          ) : (
            recentHistory.map((entry) => (
              <button
                key={entry.sayongjaNanoId}
                type="button"
                className={styles.historyButton}
                onClick={() => onSelectHistory(entry)}
              >
                <span className={styles.historyButtonName}>{entry.sayongjaName}</span>
                {entry.gigwanName ? (
                  <span className={styles.historyButtonGigwan}>{entry.gigwanName}</span>
                ) : null}
              </button>
            ))
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <Button styleType="outlined" variant="secondary" size="small" onClick={onAddUser}>
          사용자 관리로 이동
        </Button>
      </div>
    </div>
  );
}
