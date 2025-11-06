'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { SidebarClose, SidebarOpen } from '@/common/icons';
import { useGetMyProfileQuery } from '@/domain/auth/api';
import { useGigwanNameQuery, useGigwanSidebarQuery } from '@/domain/gigwan/api';
import { useAuth, useAuthHistory, upsertAuthHistoryEntry } from '@/global/auth';
import { getAccessTokenFor, switchUser } from '@/global/apiClient';

import * as styles from './PrimaryNav.style';
import MyProfileMenu from './MyProfileMenu';

import type { PrimaryNavHierarchy } from './navigation.types';

type Item = {
  key: string;
  label: string;
  depth: 1 | 2 | 3;
  href?: string | null;
  children?: Item[];
};

type Props = {
  onHierarchyChange?: (hierarchy: PrimaryNavHierarchy) => void;
};

const getParamValue = (params: ReturnType<typeof useParams>, key: string): string | null => {
  const value = (params as Record<string, string | string[] | undefined>)[key];
  if (!value) return null;
  return typeof value === 'string' ? value : (value[0] ?? null);
};

const PROFILE_PLACEHOLDER_IMAGE = 'https://placehold.co/48x48';

export default function PrimaryNav({ onHierarchyChange }: Props) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { state: authState, setAuthState, clearAuthState } = useAuth();
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { history, refresh: refreshHistory, remove: removeHistoryEntry } = useAuthHistory();
  const storedProfileKeyRef = useRef<string | null>(null);
  const queryClient = useQueryClient();

  const gigwanNanoIdFromParams = useMemo(() => getParamValue(params, 'gi'), [params]);
  const gigwanNanoId = authState.gigwanNanoId ?? gigwanNanoIdFromParams ?? null;

  const { data: gigwanNameData } = useGigwanNameQuery(gigwanNanoId ?? '', {
    enabled: Boolean(gigwanNanoId),
  });

  const { data: sidebarData } = useGigwanSidebarQuery(gigwanNanoId ?? '', {
    enabled: Boolean(gigwanNanoId),
  });

  const { data: myProfileData } = useGetMyProfileQuery({
    enabled: Boolean(authState.accessToken),
  });

  const gigwanDisplayName = gigwanNameData?.name ?? authState.gigwanName ?? '기관';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 960px) and (max-width: 1279px)');
    const updateState = (matches: boolean) => {
      if (matches) {
        setIsOpen(false);
      }
    };

    updateState(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      updateState(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  const effectiveIsOpen = isOpen;

  const handleToggle = () => {
    setIsOpen((v) => !v);
  };

  useEffect(() => {
    if (!myProfileData || !authState.accessToken || !authState.gigwanNanoId) return;
    const historyKey = myProfileData.nanoId;
    if (storedProfileKeyRef.current === historyKey) return;

    upsertAuthHistoryEntry({
      sayongjaNanoId: myProfileData.nanoId,
      sayongjaName: myProfileData.name,
      gigwanName: gigwanDisplayName,
      gigwanNanoId,
      lastUsedAt: Date.now(),
    });
    storedProfileKeyRef.current = historyKey;
    refreshHistory();
  }, [authState, gigwanDisplayName, gigwanNanoId, myProfileData, refreshHistory]);

  const hierarchy = useMemo<PrimaryNavHierarchy>(() => {
    return {
      gigwan: gigwanNanoId
        ? {
            nanoId: gigwanNanoId,
            name: gigwanDisplayName,
          }
        : null,
      jojiks: (sidebarData?.jojiks ?? []).map((jojik) => ({
        nanoId: jojik.nanoId,
        name: jojik.name,
        sueops: (jojik.sueops ?? []).map((sueop) => ({
          nanoId: sueop.nanoId,
          name: sueop.name,
        })),
      })),
    };
  }, [gigwanDisplayName, gigwanNanoId, sidebarData?.jojiks]);

  useEffect(() => {
    if (!onHierarchyChange) return;
    onHierarchyChange(hierarchy);
  }, [hierarchy, onHierarchyChange]);

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];

    if (hierarchy.gigwan) {
      list.push({
        key: `gigwan-${hierarchy.gigwan.nanoId}`,
        label: hierarchy.gigwan.name,
        depth: 1,
        href: `/td/np/gis/${hierarchy.gigwan.nanoId}/manage/home/dv`,
      });
    }

    const rawJojiks = sidebarData?.jojiks;

    if (rawJojiks && rawJojiks.length > 0) {
      rawJojiks.forEach((jojik) => {
        const sueopItems = (jojik.sueops ?? []).map<Item>((sueop) => {
          const konItems = (sueop.kons ?? []).map<Item>((kon) => ({
            key: `kon-${kon.nanoId}`,
            label: kon.name,
            depth: 3,
            href: null,
          }));

          return {
            key: `sueop-${sueop.nanoId}`,
            label: sueop.name,
            depth: 2,
            href: null,
            children: konItems.length > 0 ? konItems : undefined,
          };
        });

        list.push({
          key: `jojik-${jojik.nanoId}`,
          label: jojik.name,
          depth: 1,
          href: `/td/np/jos/${jojik.nanoId}/manage/home/dv`,
          children: sueopItems.length > 0 ? sueopItems : undefined,
        });
      });

      return list;
    }

    hierarchy.jojiks.forEach((jojik) => {
      const sueopItems = jojik.sueops.map<Item>((sueop) => ({
        key: `sueop-${sueop.nanoId}`,
        label: sueop.name,
        depth: 2,
        href: null,
      }));

      list.push({
        key: `jojik-${jojik.nanoId}`,
        label: jojik.name,
        depth: 1,
        href: `/td/np/jos/${jojik.nanoId}/manage/home/dv`,
        children: sueopItems.length > 0 ? sueopItems : undefined,
      });
    });

    return list;
  }, [hierarchy, sidebarData?.jojiks]);

  const filteredHistory = useMemo(() => {
    if (!authState.gigwanNanoId) return [] as typeof history;
    return history
      .filter(
        (entry) =>
          entry.sayongjaNanoId !== myProfileData?.nanoId &&
          entry.gigwanNanoId === authState.gigwanNanoId,
      )
      .sort((a, b) => b.lastUsedAt - a.lastUsedAt);
  }, [authState.gigwanNanoId, history, myProfileData?.nanoId]);

  const handleProfileButtonClick = useCallback(() => {
    setIsProfileMenuOpen((prev) => !prev);
  }, []);

  const handleSelectHistory = useCallback(
    (entry: (typeof history)[number]) => {
      void (async () => {
        let aborted = false;

        try {
          await switchUser(entry.sayongjaNanoId, () => {
            aborted = true;
            removeHistoryEntry(entry.sayongjaNanoId);
            refreshHistory();
            setIsProfileMenuOpen(false);
            window.alert('저장된 사용자 세션이 만료되었습니다. 다시 로그인해 주세요.');
            router.replace('/td/g');
          });

          if (aborted) return;

          const token = getAccessTokenFor(entry.sayongjaNanoId);
          if (!token) throw new Error('Missing access token after user switch');

          setAuthState({
            accessToken: token,
            sayongjaNanoId: entry.sayongjaNanoId,
            gigwanNanoId: authState.gigwanNanoId,
            gigwanName: entry.gigwanName ?? authState.gigwanName,
            loginId: authState.loginId,
          });

          await queryClient.invalidateQueries({ queryKey: ['myProfile'] });

          upsertAuthHistoryEntry({
            sayongjaNanoId: entry.sayongjaNanoId,
            sayongjaName: entry.sayongjaName,
            gigwanName: entry.gigwanName ?? gigwanDisplayName,
            gigwanNanoId,
            lastUsedAt: Date.now(),
          });

          refreshHistory();
          setIsProfileMenuOpen(false);
          try {
            router.refresh();
          } catch (e) {
            console.error('Failed to refresh after user switch', e);
          }
        } catch (error) {
          console.error('Failed to switch user', error);
          removeHistoryEntry(entry.sayongjaNanoId);
          refreshHistory();
          setIsProfileMenuOpen(false);
        }
      })();
    },
    [
      authState.gigwanNanoId,
      authState.gigwanName,
      authState.loginId,
      gigwanDisplayName,
      gigwanNanoId,
      queryClient,
      refreshHistory,
      removeHistoryEntry,
      router,
      setAuthState,
    ],
  );

  const handleAddUser = useCallback(() => {
    if (!gigwanNanoId) {
      window.alert('기관 정보가 없어 사용자를 추가할 수 없습니다.');
      return;
    }
    router.push(`/td/np/gis/${gigwanNanoId}/sayongjas/home/lv`);
    setIsProfileMenuOpen(false);
  }, [gigwanNanoId, router]);

  const handleLogout = useCallback(() => {
    try {
      clearAuthState();
      storedProfileKeyRef.current = null;
      setIsProfileMenuOpen(false);
      router.replace('/td/g');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  }, [clearAuthState, router]);

  const profileImageUrl = PROFILE_PLACEHOLDER_IMAGE;

  const renderItems = (list: Item[]) =>
    list.map((item) => {
      const isActive = !!item.href && pathname.startsWith(item.href);
      const linkStyles = [
        ...styles.navLink[isActive ? 'active' : 'inactive'],
        styles.navLinkDepth[item.depth],
      ] as const;

      return (
        <li key={item.key} css={styles.navListItem}>
          {item.href ? (
            <Link href={item.href} css={linkStyles} aria-current={isActive ? 'page' : undefined}>
              <span css={styles.navIcon} aria-hidden />
              <span
                css={[styles.navLabel, styles.navLabelWeight[isActive ? 'active' : 'inactive']]}
              >
                {item.label}
              </span>
            </Link>
          ) : (
            <span css={linkStyles} aria-disabled="true">
              <span css={styles.navIcon} aria-hidden />
              <span css={[styles.navLabel, styles.navLabelWeight.inactive]}>{item.label}</span>
            </span>
          )}
          {item.children && item.children.length > 0 && (
            <ul css={styles.navChildList}>{renderItems(item.children)}</ul>
          )}
        </li>
      );
    });

  return (
    <aside
      css={effectiveIsOpen ? styles.navContainerOpen : styles.navContainerClosed}
      aria-label="기본 내비게이션"
      data-open={effectiveIsOpen ? 'true' : 'false'}
    >
      <div css={styles.toggleBar}>
        <button
          type="button"
          css={styles.toggleButton}
          onClick={handleToggle}
          aria-expanded={effectiveIsOpen}
          aria-controls="primary-nav-list"
          aria-label={effectiveIsOpen ? '메뉴 접기' : '메뉴 열기'}
        >
          {effectiveIsOpen ? <SidebarClose css={styles.icon} /> : <SidebarOpen css={styles.icon} />}
        </button>
      </div>

      <ul id="primary-nav-list" css={styles.navList[effectiveIsOpen ? 'show' : 'hide']}>
        {renderItems(items)}
      </ul>

      <div css={styles.navFooter[effectiveIsOpen ? 'show' : 'hide']}>
        <a
          href="https://example.com/purchase-strike"
          target="_blank"
          rel="noopener noreferrer"
          css={[...styles.navLink.inactive, styles.navLinkDepth[1]]}
        >
          <span css={[styles.navLabel, styles.navLabelWeight.inactive]}>
            마법사 구매 및 파업 신고
          </span>
        </a>
        <a
          href="https://example.com/feature-request"
          target="_blank"
          rel="noopener noreferrer"
          css={[...styles.navLink.inactive, styles.navLinkDepth[1]]}
        >
          <span css={[styles.navLabel, styles.navLabelWeight.inactive]}>기능 요청</span>
        </a>
        <a
          href="https://example.com/contact-dada"
          target="_blank"
          rel="noopener noreferrer"
          css={[...styles.navLink.inactive, styles.navLinkDepth[1]]}
        >
          <span css={[styles.navLabel, styles.navLabelWeight.inactive]}>다다팀에 문의하기</span>
        </a>

        <div css={styles.footerProfileSection}>
          <div css={styles.footerVersionGroup}>
            <span css={styles.footerBrand}>티키타</span>
            <span css={styles.footerVerText}>&nbsp;Ver 0.1.0</span>
          </div>
          <button
            type="button"
            css={styles.profileTriggerButton}
            onClick={handleProfileButtonClick}
            ref={profileButtonRef}
            aria-haspopup="dialog"
            aria-expanded={isProfileMenuOpen}
            aria-label="내 프로필 열기"
          >
            <Image
              src={profileImageUrl}
              alt="내 프로필"
              width={40}
              height={40}
              css={styles.profileTriggerImage}
              unoptimized
            />
          </button>
          {isProfileMenuOpen && myProfileData && (
            <MyProfileMenu
              gigwanName={gigwanDisplayName}
              userName={myProfileData.name}
              onClose={() => setIsProfileMenuOpen(false)}
              history={filteredHistory}
              onSelectHistory={handleSelectHistory}
              onAddUser={handleAddUser}
              onLogout={handleLogout}
              anchorRef={profileButtonRef}
              profileImageUrl={profileImageUrl}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
