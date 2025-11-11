'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { SidebarClose, SidebarOpen } from '@/common/icons';
import { useGetMyProfileQuery } from '@/domain/auth/api';
import { useGigwanNameQuery, useGigwanSidebarQuery } from '@/domain/gigwan/api';
import { useAuth, useAuthStore } from '@/global/auth';
import { getAccessTokenFor, switchUser } from '@/global/apiClient';

import * as styles from './PrimaryNav.style';
import MyProfileMenu from './MyProfileMenu';

import type { PrimaryNavHierarchy } from './navigation.types';
import type { AuthHistoryEntry } from '@/global/auth';

type ItemEntityType = 'gigwan' | 'jojik' | 'sueop' | 'kon';

type Item = {
  key: string;
  label: string;
  depth: 1 | 2 | 3;
  href?: string | null;
  baseHref?: string | null;
  children?: Item[];
  entityType?: ItemEntityType;
  entityNanoId?: string;
};

type Props = {
  onHierarchyChange?: (hierarchy: PrimaryNavHierarchy) => void;
};

const getParamValue = (params: ReturnType<typeof useParams>, key: string): string | null => {
  const value = (params as Record<string, string | string[] | undefined>)[key];
  if (!value) return null;
  return typeof value === 'string' ? value : (value[0] ?? null);
};

const normalizePath = (path: string | null | undefined) => {
  if (!path) return '/';
  if (path.length <= 1) return path;
  return path.replace(/\/+$/, '');
};

const isWithinPath = (currentPath: string, target: string | null | undefined) => {
  if (!target) return false;
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedTarget = normalizePath(target);
  return (
    normalizedCurrent === normalizedTarget || normalizedCurrent.startsWith(`${normalizedTarget}/`)
  );
};

const PROFILE_PLACEHOLDER_IMAGE = 'https://placehold.co/48x48';

export const PrimaryNav = ({ onHierarchyChange }: Props) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(true);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const storedProfileKeyRef = useRef<string | null>(null);

  const { state: authState, accessToken, setAuthState, clearAll } = useAuth();

  const history = useAuthStore((s) => s.history);
  const upsertHistory = useCallback(
    (
      entry: Omit<AuthHistoryEntry, 'lastUsedAt'> & Partial<Pick<AuthHistoryEntry, 'lastUsedAt'>>,
    ) => {
      useAuthStore.getState().upsertHistory(entry);
    },
    [],
  );
  const removeHistoryEntry = useCallback((sayongjaNanoId: string) => {
    useAuthStore.getState().removeHistory(sayongjaNanoId);
  }, []);

  const gigwanNanoIdFromParams = useMemo(() => getParamValue(params, 'gi'), [params]);
  const gigwanNanoId = authState.gigwanNanoId ?? gigwanNanoIdFromParams ?? null;
  const [resolvedGigwanNanoId, setResolvedGigwanNanoId] = useState<string | null>(gigwanNanoId);

  useEffect(() => {
    if (gigwanNanoId) {
      setResolvedGigwanNanoId(gigwanNanoId);
    }
  }, [gigwanNanoId]);

  const { data: gigwanNameData } = useGigwanNameQuery(resolvedGigwanNanoId ?? '', {
    enabled: Boolean(resolvedGigwanNanoId),
  });

  const { data: sidebarData } = useGigwanSidebarQuery(resolvedGigwanNanoId ?? '', {
    enabled: Boolean(resolvedGigwanNanoId),
  });

  const { data: myProfileData } = useGetMyProfileQuery({
    enabled: Boolean(accessToken),
  });

  const gigwanDisplayName = gigwanNameData?.name ?? authState.gigwanName ?? '기관';

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px) and (max-width: 1279px)');
    const update = (matches: boolean) => {
      if (matches) setIsOpen(false);
    };
    update(mq.matches);
    const onChange = (e: MediaQueryListEvent) => update(e.matches);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  const effectiveIsOpen = isOpen;

  const handleToggle = () => setIsOpen((v) => !v);

  useEffect(() => {
    if (!myProfileData || !accessToken || !authState.gigwanNanoId) return;
    const historyKey = myProfileData.nanoId;
    if (storedProfileKeyRef.current === historyKey) return;

    upsertHistory({
      sayongjaNanoId: myProfileData.nanoId,
      sayongjaName: myProfileData.name,
      gigwanName: gigwanDisplayName,
      gigwanNanoId,
      lastUsedAt: Date.now(),
    });
    storedProfileKeyRef.current = historyKey;
  }, [
    accessToken,
    authState.gigwanNanoId,
    gigwanDisplayName,
    gigwanNanoId,
    myProfileData,
    upsertHistory,
  ]);

  const normalizedPathname = useMemo(() => normalizePath(pathname), [pathname]);

  const hierarchy = useMemo<PrimaryNavHierarchy>(() => {
    return {
      gigwan: resolvedGigwanNanoId
        ? {
            nanoId: resolvedGigwanNanoId,
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
  }, [gigwanDisplayName, resolvedGigwanNanoId, sidebarData?.jojiks]);

  useEffect(() => {
    if (!onHierarchyChange) return;
    onHierarchyChange(hierarchy);
  }, [hierarchy, onHierarchyChange]);

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];

    if (hierarchy.gigwan) {
      const { nanoId, name } = hierarchy.gigwan;
      const gigwanBaseHref = `/td/np/gis/${nanoId}`;

      list.push({
        key: `gigwan-${nanoId}`,
        label: name,
        depth: 1,
        href: `${gigwanBaseHref}/manage/home/dv`,
        baseHref: gigwanBaseHref,
        entityType: 'gigwan',
        entityNanoId: nanoId,
      });
    }

    type SidebarKon = { nanoId: string; name: string };
    type SidebarSueop = { nanoId: string; name: string; kons?: SidebarKon[] | null };
    type SidebarJojik = { nanoId: string; name: string; sueops?: SidebarSueop[] | null };

    const rawJojiks = sidebarData?.jojiks as SidebarJojik[] | undefined;
    const sourceJojiks: SidebarJojik[] =
      rawJojiks && rawJojiks.length > 0
        ? rawJojiks
        : hierarchy.jojiks.map((jojik) => ({
            nanoId: jojik.nanoId,
            name: jojik.name,
            sueops: jojik.sueops.map((sueop) => ({ nanoId: sueop.nanoId, name: sueop.name })),
          }));

    const mapSueopToItem = (sueop: SidebarSueop): Item => {
      const konItems = (sueop.kons ?? []).map<Item>((kon) => ({
        key: `kon-${kon.nanoId}`,
        label: kon.name,
        depth: 3,
        href: null,
        entityType: 'kon',
        entityNanoId: kon.nanoId,
      }));

      return {
        key: `sueop-${sueop.nanoId}`,
        label: sueop.name,
        depth: 2,
        href: null,
        children: konItems.length > 0 ? konItems : undefined,
        entityType: 'sueop',
        entityNanoId: sueop.nanoId,
      };
    };

    const jojikItems = sourceJojiks.map<Item>((jojik) => {
      const sueopItems = (jojik.sueops ?? []).map(mapSueopToItem);

      const jojikBaseHref = `/td/np/jos/${jojik.nanoId}`;

      return {
        key: `jojik-${jojik.nanoId}`,
        label: jojik.name,
        depth: 1,
        href: `${jojikBaseHref}/manage/home/dv`,
        baseHref: jojikBaseHref,
        children: sueopItems.length > 0 ? sueopItems : undefined,
        entityType: 'jojik',
        entityNanoId: jojik.nanoId,
      };
    });

    return [...list, ...jojikItems];
  }, [hierarchy, sidebarData?.jojiks]);

  const activeJojikNanoId = useMemo(() => getParamValue(params, 'jo'), [params]);
  const activeSueopNanoId = useMemo(() => getParamValue(params, 'su'), [params]);
  const activeKonNanoId = useMemo(() => getParamValue(params, 'ko'), [params]);

  const flattenedItems = useMemo(() => {
    const result: Item[] = [];
    const visit = (nodes: Item[]) => {
      nodes.forEach((node) => {
        result.push(node);
        if (node.children) visit(node.children);
      });
    };
    visit(items);
    return result;
  }, [items]);

  const activeItemKey = useMemo(() => {
    const findByEntity = (type: ItemEntityType, nanoId: string | null | undefined) => {
      if (!nanoId) return null;
      return (
        flattenedItems.find((item) => item.entityType === type && item.entityNanoId === nanoId)
          ?.key ?? null
      );
    };

    const prioritizedEntityKey =
      findByEntity('kon', activeKonNanoId) ??
      findByEntity('sueop', activeSueopNanoId) ??
      findByEntity('jojik', activeJojikNanoId) ??
      findByEntity('gigwan', resolvedGigwanNanoId);

    if (prioritizedEntityKey) return prioritizedEntityKey;

    const scoredByPath = flattenedItems
      .map((item) => {
        const candidates = [item.href, item.baseHref].filter(Boolean) as string[];
        let bestScore = -1;
        candidates.forEach((candidate) => {
          const normalizedCandidate = normalizePath(candidate);
          if (isWithinPath(normalizedPathname, normalizedCandidate)) {
            const exactMatch = normalizedPathname === normalizedCandidate ? 1 : 0;
            const score = normalizedCandidate.length * 2 + exactMatch;
            if (score > bestScore) bestScore = score;
          }
        });
        return bestScore >= 0 ? { key: item.key, score: bestScore } : null;
      })
      .filter((value): value is { key: string; score: number } => Boolean(value))
      .sort((a, b) => b.score - a.score);

    if (scoredByPath[0]) return scoredByPath[0].key;

    return flattenedItems[0]?.key ?? null;
  }, [
    activeJojikNanoId,
    activeKonNanoId,
    activeSueopNanoId,
    flattenedItems,
    normalizedPathname,
    resolvedGigwanNanoId,
  ]);

  const getIsItemActive = useCallback((item: Item) => item.key === activeItemKey, [activeItemKey]);

  const filteredHistory = useMemo(() => {
    if (!authState.gigwanNanoId) return [] as AuthHistoryEntry[];
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
    (entry: AuthHistoryEntry) => {
      void (async () => {
        let aborted = false;

        try {
          await switchUser(entry.sayongjaNanoId, () => {
            aborted = true;
            removeHistoryEntry(entry.sayongjaNanoId);
            setIsProfileMenuOpen(false);
            window.alert('저장된 사용자 세션이 만료되었습니다. 다시 로그인해 주세요.');
            router.replace('/td/g');
          });

          if (aborted) return;

          const token = getAccessTokenFor(entry.sayongjaNanoId);
          if (!token) throw new Error('Missing access token after user switch');

          setAuthState({
            gigwanNanoId: authState.gigwanNanoId,
            gigwanName: entry.gigwanName ?? gigwanDisplayName,
            loginId: authState.loginId,
          });

          await queryClient.invalidateQueries({ queryKey: ['myProfile'] });

          upsertHistory({
            sayongjaNanoId: entry.sayongjaNanoId,
            sayongjaName: entry.sayongjaName,
            gigwanName: entry.gigwanName ?? gigwanDisplayName,
            gigwanNanoId,
            lastUsedAt: Date.now(),
          });

          setIsProfileMenuOpen(false);
          try {
            router.refresh();
          } catch (e) {
            console.error('Failed to refresh after user switch', e);
          }
        } catch (error) {
          console.error('Failed to switch user', error);
          removeHistoryEntry(entry.sayongjaNanoId);
          setIsProfileMenuOpen(false);
        }
      })();
    },
    [
      authState.gigwanNanoId,
      authState.loginId,
      gigwanDisplayName,
      gigwanNanoId,
      queryClient,
      removeHistoryEntry,
      router,
      setAuthState,
      upsertHistory,
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
      clearAll();
      storedProfileKeyRef.current = null;
      setIsProfileMenuOpen(false);
      router.replace('/td/g');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  }, [clearAll, router]);

  const profileImageUrl = PROFILE_PLACEHOLDER_IMAGE;

  const renderItems = (list: Item[]) =>
    list.map((item) => {
      const isActive = getIsItemActive(item);
      const linkStyles = [
        ...styles.navLink[isActive ? 'active' : 'inactive'],
        styles.navLinkDepth[item.depth],
      ] as const;
      const labelStyles = [
        styles.navLabel,
        styles.navLabelWeight[isActive ? 'active' : 'inactive'],
      ] as const;

      return (
        <li key={item.key} css={styles.navListItem}>
          {item.href ? (
            <Link href={item.href} css={linkStyles} aria-current={isActive ? 'page' : undefined}>
              <span css={styles.navIcon} aria-hidden />
              <span css={labelStyles}>{item.label}</span>
            </Link>
          ) : (
            <span css={linkStyles} aria-disabled="true">
              <span css={styles.navIcon} aria-hidden />
              <span css={labelStyles}>{item.label}</span>
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
};
