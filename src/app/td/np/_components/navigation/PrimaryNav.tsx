'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SidebarClose, SidebarOpen } from '@/common/icons';
import { useGetMyProfileQuery } from '@/domain/auth/api';
import { useGigwanNameQuery, useGigwanSidebarQuery } from '@/domain/gigwan/api';
import { useAuth, useAuthHistory, upsertAuthHistoryEntry } from '@/global/auth';

import * as styles from './PrimaryNav.style.css';
import MyProfileMenu from './MyProfileMenu';

import type { PrimaryNavHierarchy } from './navigation.types';

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

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
  const [isCollapsedByBreakpoint, setIsCollapsedByBreakpoint] = useState(false);
  const { state: authState, setAuthState } = useAuth();
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { history, refresh: refreshHistory } = useAuthHistory();
  const storedProfileKeyRef = useRef<string | null>(null);

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
      setIsCollapsedByBreakpoint(matches);
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

  const effectiveIsOpen = isCollapsedByBreakpoint ? false : isOpen;

  const handleToggle = useCallback(() => {
    if (isCollapsedByBreakpoint) return;
    setIsOpen((v) => !v);
  }, [isCollapsedByBreakpoint]);

  useEffect(() => {
    if (!myProfileData || !authState.accessToken) return;
    const historyKey = `${myProfileData.nanoId}-${authState.accessToken}`;
    if (storedProfileKeyRef.current === historyKey) return;

    upsertAuthHistoryEntry({
      authState: { ...authState },
      sayongjaNanoId: myProfileData.nanoId,
      sayongjaName: myProfileData.name,
      gigwanName: gigwanDisplayName,
      lastUsedAt: Date.now(),
    });
    storedProfileKeyRef.current = historyKey;
    refreshHistory();
  }, [authState, gigwanDisplayName, myProfileData, refreshHistory]);

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

  const filteredHistory = useMemo(
    () =>
      history
        .filter((entry) => entry.sayongjaNanoId !== myProfileData?.nanoId)
        .sort((a, b) => b.lastUsedAt - a.lastUsedAt),
    [history, myProfileData?.nanoId],
  );

  const handleProfileButtonClick = useCallback(() => {
    setIsProfileMenuOpen((prev) => !prev);
  }, []);

  const handleSelectHistory = useCallback(
    (entry: (typeof history)[number]) => {
      setAuthState(entry.authState);
      upsertAuthHistoryEntry(entry);
      refreshHistory();
      setIsProfileMenuOpen(false);
      try {
        router.refresh();
      } catch (error) {
        console.error('Failed to refresh after user switch', error);
      }
    },
    [refreshHistory, router, setAuthState],
  );

  const handleAddUser = useCallback(() => {
    if (!gigwanNanoId) {
      window.alert('기관 정보가 없어 사용자를 추가할 수 없습니다.');
      return;
    }
    router.push(`/td/np/gis/${gigwanNanoId}/sayongjas/home/lv`);
    setIsProfileMenuOpen(false);
  }, [gigwanNanoId, router]);

  const profileImageUrl = PROFILE_PLACEHOLDER_IMAGE;

  const renderItems = (list: Item[]) =>
    list.map((item) => {
      const isActive = !!item.href && pathname.startsWith(item.href);
      const linkCls =
        styles.navLink[isActive ? 'active' : 'inactive'] + ' ' + styles.navLinkDepth[item.depth];

      return (
        <li key={item.key} className={styles.navListItem}>
          {item.href ? (
            <Link href={item.href} className={linkCls} aria-current={isActive ? 'page' : undefined}>
              <span className={styles.navIcon} aria-hidden />
              <span
                className={cx(
                  styles.navLabel,
                  styles.navLabelWeight[isActive ? 'active' : 'inactive'],
                )}
              >
                {item.label}
              </span>
            </Link>
          ) : (
            <span className={linkCls} aria-disabled="true">
              <span className={styles.navIcon} aria-hidden />
              <span className={cx(styles.navLabel, styles.navLabelWeight.inactive)}>{item.label}</span>
            </span>
          )}
          {item.children && item.children.length > 0 && (
            <ul className={styles.navChildList}>{renderItems(item.children)}</ul>
          )}
        </li>
      );
    });

  return (
    <aside
      className={effectiveIsOpen ? styles.navContainerOpen : styles.navContainerClosed}
      aria-label="기본 내비게이션"
      data-open={effectiveIsOpen ? 'true' : 'false'}
    >
      <div className={styles.toggleBar}>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={handleToggle}
          aria-expanded={effectiveIsOpen}
          aria-controls="primary-nav-list"
          aria-label={effectiveIsOpen ? '메뉴 접기' : '메뉴 열기'}
          disabled={isCollapsedByBreakpoint}
        >
          {effectiveIsOpen ? (
            <SidebarClose className={styles.icon} />
          ) : (
            <SidebarOpen className={styles.icon} />
          )}
        </button>
      </div>

      <ul id="primary-nav-list" className={styles.navList[effectiveIsOpen ? 'show' : 'hide']}>
        {renderItems(items)}
      </ul>

      <div className={styles.navFooter[effectiveIsOpen ? 'show' : 'hide']}>
        <a
          href="https://example.com/purchase-strike"
          target="_blank"
          rel="noopener noreferrer"
          className={cx(styles.navLink.inactive, styles.navLinkDepth[1])}
        >
          <span className={cx(styles.navLabel, styles.navLabelWeight.inactive)}>
            마법사 구매 및 파업 신고
          </span>
        </a>
        <a
          href="https://example.com/feature-request"
          target="_blank"
          rel="noopener noreferrer"
          className={cx(styles.navLink.inactive, styles.navLinkDepth[1])}
        >
          <span className={cx(styles.navLabel, styles.navLabelWeight.inactive)}>기능 요청</span>
        </a>
        <a
          href="https://example.com/contact-dada"
          target="_blank"
          rel="noopener noreferrer"
          className={cx(styles.navLink.inactive, styles.navLinkDepth[1])}
        >
          <span className={cx(styles.navLabel, styles.navLabelWeight.inactive)}>
            다다팀에 문의하기
          </span>
        </a>

        <div className={styles.footerProfileSection}>
          <div className={styles.footerVersionGroup}>
            <span className={styles.footerBrand}>티키타</span>
            <span className={styles.footerVerText}>&nbsp;Ver 0.1.0</span>
          </div>
          <button
            type="button"
            className={styles.profileTriggerButton}
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
              className={styles.profileTriggerImage}
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
              anchorRef={profileButtonRef}
              profileImageUrl={profileImageUrl}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
