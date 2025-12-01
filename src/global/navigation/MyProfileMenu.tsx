'use client';

import Image from 'next/image';
import { RefObject, useEffect, useMemo, useRef } from 'react';

import { Button } from '@/common/components';
import type { AuthHistoryEntry } from '@/global/auth';

import { cssObj } from './MyProfileMenu.style';
import { InfoBlackIcon, XCircleBlackIcon } from '@/common/icons';
import PlusIcon from '@/common/icons/PlusIcon';

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
      css={cssObj.container}
      role="dialog"
      aria-modal="false"
      aria-label="내 프로필 메뉴"
    >
      <div css={cssObj.header}>
        <h3 css={cssObj.headerTitle}>내 프로필</h3>
        <div css={cssObj.userProfile}>
          <Image
            src={profileImageUrl}
            alt="내 프로필 이미지"
            width={48}
            height={48}
            css={cssObj.profileImage}
            unoptimized
          />
          <div css={cssObj.userInfo}>
            <span css={cssObj.userName}>{gigwanName}</span>
            <span css={cssObj.gigwanName}>{userName}</span>
          </div>
        </div>
      </div>
      <Button variant="secondary" size="small" iconLeft={<InfoBlackIcon />} onClick={onAddUser}>
        사용자 설정
      </Button>
      <Button variant="assistive" size="small" iconLeft={<XCircleBlackIcon />} onClick={onLogout}>
        로그아웃
      </Button>
      <div css={cssObj.historySection}>
        <span css={cssObj.historyTitle}>다른 사용자 전환</span>
        <div css={cssObj.historyList}>
          {recentHistory.length === 0 ? (
            <span css={cssObj.historyEmpty}>같은 기관의 다른 사용자가 없습니다.</span>
          ) : (
            recentHistory.map((entry) => (
              <button
                key={entry.sayongjaNanoId}
                type="button"
                css={cssObj.historyButton}
                onClick={() => onSelectHistory(entry)}
              >
                <span css={cssObj.historyButtonName}>{entry.sayongjaName}</span>
                {entry.gigwanName ? (
                  <span css={cssObj.historyButtonGigwan}>{entry.gigwanName}</span>
                ) : null}
              </button>
            ))
          )}
        </div>
        <Button variant="assistive" iconRight={<PlusIcon />} onClick={onAddUser}>
          사용자 추가
        </Button>
      </div>
    </div>
  );
}
