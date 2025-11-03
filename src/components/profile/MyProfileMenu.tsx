'use client';

import React, { useEffect, useRef } from 'react';

import { Close } from '@/components/icons';
import { Button, Profile } from '@/design';

import * as styles from './MyProfileMenu.style.css';

import type { AuthHistoryEntry } from '@/state/auth';

type Props = {
  gigwanName: string;
  userName: string;
  onClose: () => void;
  onOpenSettings: () => void;
  history: AuthHistoryEntry[];
  onSelectHistory: (entry: AuthHistoryEntry) => void;
  onAddUser: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  profileImageUrl?: string;
};

const FALLBACK_PROFILE_IMAGE = 'https://placehold.co/48x48';

export default function MyProfileMenu({
  gigwanName,
  userName,
  history,
  onClose,
  onOpenSettings,
  onSelectHistory,
  onAddUser,
  anchorRef,
  profileImageUrl,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (containerRef.current?.contains(target)) return;
      if (anchorRef.current && anchorRef.current.contains(target as Node)) return;
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [anchorRef, onClose]);

  return (
    <div ref={containerRef} className={styles.container} role="dialog" aria-modal="true">
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="닫기">
        <Close width={16} height={16} />
      </button>
      <div className={styles.header}>
        <span className={styles.orgName}>{gigwanName}</span>
        <div className={styles.userNameRow}>
          <Profile
            size="large"
            name={userName}
            imageUrl={profileImageUrl ?? FALLBACK_PROFILE_IMAGE}
          />
        </div>
        <Button
          styleType="outline"
          variant="primary"
          size="medium"
          onClick={onOpenSettings}
          className={styles.actionButton}
        >
          사용자 설정
        </Button>
      </div>

      <div className={styles.divider} aria-hidden />

      <div className={styles.historySection}>
        <span className={styles.historyHeader}>다른 사용자 전환</span>
        {history.length === 0 ? (
          <span className={styles.emptyHistory}>최근에 전환한 사용자가 없습니다.</span>
        ) : (
          <div className={styles.historyList}>
            {history.map((entry) => (
              <button
                key={entry.sayongjaNanoId}
                type="button"
                className={styles.historyItemButton}
                onClick={() => onSelectHistory(entry)}
              >
                <div className={styles.historyItemInfo}>
                  <span className={styles.historyItemName}>{entry.sayongjaName}</span>
                  {entry.gigwanName && (
                    <span className={styles.historyItemDescription}>{entry.gigwanName}</span>
                  )}
                </div>
                <span className={styles.historyItemDescription}>전환</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Button onClick={onAddUser} className={styles.addUserButton} size="medium" variant="secondary">
          사용자 추가
        </Button>
      </div>
    </div>
  );
}

