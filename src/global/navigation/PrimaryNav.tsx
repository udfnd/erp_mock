'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { SidebarCloseIcon, SidebarOpenIcon } from '@/common/icons';
import { useGetMyProfileQuery } from '@/domain/auth/api';
import { useGigwanNameQuery, useGigwanSidebarQuery } from '@/domain/gigwan/api';
import { useAuth, useAuthStore, switchUser } from '@/global/auth';

import { cssObj } from './PrimaryNav.style';
import MyProfileMenu from './MyProfileMenu';
import MyProfileModal from './MyProfileModal';

import type { AuthHistoryEntry } from '@/global/auth';

type PrimaryNavHierarchy = {
  gigwan: { nanoId: string; name: string } | null;
  jojiks: Array<{
    nanoId: string;
    name: string;
    sueops: Array<{
      nanoId: string;
      name: string;
      kons: Array<{
        nanoId: string;
        name: string;
        boons: Array<{ nanoId: string; name: string }>;
      }>;
    }>;
  }>;
};

type ItemEntityType = 'gigwan' | 'jojik' | 'sueop' | 'kon' | 'boon';

type Item = {
  key: string;
  label: string;
  depth: 1 | 2 | 3 | 4;
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

const useHydrated = (): boolean =>
  useSyncExternalStore(
    (cb) => {
      if (typeof window !== 'undefined') {
        const id = requestAnimationFrame(cb);
        return () => cancelAnimationFrame(id);
      }

      return () => {};
    },
    () => true,
    () => false,
  );

export const PrimaryNav = ({ onHierarchyChange }: Props) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(true);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const storedProfileKeyRef = useRef<string | null>(null);
  const [activeItemKey, setActiveItemKey] = useState<string | null>(null);
  const [isGigwanExpanded, setIsGigwanExpanded] = useState(true);

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
  const activeJojikNanoId = useMemo(() => getParamValue(params, 'jo'), [params]);
  const activeSueopNanoId = useMemo(() => getParamValue(params, 'su'), [params]);
  const activeKonNanoId = useMemo(() => getParamValue(params, 'ko'), [params]);
  const activeBoonNanoId = useMemo(() => getParamValue(params, 'bo'), [params]);
  const [selectedJojikNanoId, setSelectedJojikNanoId] = useState<string | null>(
    activeJojikNanoId,
  );
  const [selectedSueopNanoId, setSelectedSueopNanoId] = useState<string | null>(
    activeSueopNanoId,
  );
  const [selectedKonNanoId, setSelectedKonNanoId] = useState<string | null>(activeKonNanoId);
  const [selectedBoonNanoId, setSelectedBoonNanoId] = useState<string | null>(activeBoonNanoId);

  useEffect(() => {
    if (gigwanNanoId) {
      setResolvedGigwanNanoId(gigwanNanoId);
    }
  }, [gigwanNanoId]);

  useEffect(() => {
    setSelectedJojikNanoId(activeJojikNanoId);
  }, [activeJojikNanoId]);

  useEffect(() => {
    setSelectedSueopNanoId(activeSueopNanoId);
  }, [activeSueopNanoId]);

  useEffect(() => {
    setSelectedKonNanoId(activeKonNanoId);
  }, [activeKonNanoId]);

  useEffect(() => {
    setSelectedBoonNanoId(activeBoonNanoId);
  }, [activeBoonNanoId]);

  const { data: gigwanNameData } = useGigwanNameQuery(resolvedGigwanNanoId ?? '', {
    enabled: Boolean(resolvedGigwanNanoId),
  });

  const { data: sidebarData } = useGigwanSidebarQuery(resolvedGigwanNanoId ?? '', {
    enabled: Boolean(resolvedGigwanNanoId),
  });

  const { data: myProfileData } = useGetMyProfileQuery({
    enabled: Boolean(accessToken),
  });

  const gigwanDisplayName = gigwanNameData?.name ?? '기관';

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
          kons: (sueop.kons ?? []).map((kon) => ({
            nanoId: kon.nanoId,
            name: kon.name,
            boons: (kon.boons ?? []).map((boon) => ({
              nanoId: boon.nanoId,
              name: boon.name,
            })),
          })),
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

    type SidebarBoon = { nanoId: string; name: string };
    type SidebarKon = { nanoId: string; name: string; boons?: SidebarBoon[] | null };
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
      const konItems = (sueop.kons ?? []).map<Item>((kon) => {
        const boonItems = (kon.boons ?? []).map<Item>((boon) => ({
          key: `boon-${boon.nanoId}`,
          label: boon.name,
          depth: 4,
          href: null,
          entityType: 'boon',
          entityNanoId: boon.nanoId,
        }));

        return {
          key: `kon-${kon.nanoId}`,
          label: kon.name,
          depth: 3,
          href: null,
          children: boonItems.length > 0 ? boonItems : undefined,
          entityType: 'kon',
          entityNanoId: kon.nanoId,
        };
      });

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

  const activeItemKeyFromPath = useMemo(() => {
    const findByEntity = (type: ItemEntityType, nanoId: string | null | undefined) => {
      if (!nanoId) return null;
      return (
        flattenedItems.find((item) => item.entityType === type && item.entityNanoId === nanoId)
          ?.key ?? null
      );
    };

    const prioritizedEntityKey =
      findByEntity('boon', activeBoonNanoId) ??
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
    activeBoonNanoId,
    activeJojikNanoId,
    activeKonNanoId,
    activeSueopNanoId,
    flattenedItems,
    normalizedPathname,
    resolvedGigwanNanoId,
  ]);

  useEffect(() => {
    setActiveItemKey(activeItemKeyFromPath);
  }, [activeItemKeyFromPath]);

  useEffect(() => {
    setIsGigwanExpanded(Boolean(resolvedGigwanNanoId));
  }, [resolvedGigwanNanoId]);

  const selectedJojikItem = useMemo(() => {
    if (!selectedJojikNanoId) return null;
    return (
      flattenedItems.find(
        (item) => item.entityType === 'jojik' && item.entityNanoId === selectedJojikNanoId,
      ) ?? null
    );
  }, [flattenedItems, selectedJojikNanoId]);

  const selectedJojikChildren = useMemo(() => {
    if (!selectedJojikItem) return [] as Item[];
    return getVisibleChildren(selectedJojikItem);
  }, [getVisibleChildren, selectedJojikItem]);

  const getIsItemActive = useCallback(
    (item: Item) => {
      if (item.entityType === 'boon') return selectedBoonNanoId === item.entityNanoId;
      if (item.entityType === 'kon') return selectedKonNanoId === item.entityNanoId;
      if (item.entityType === 'sueop') return selectedSueopNanoId === item.entityNanoId;
      if (item.entityType === 'jojik') return selectedJojikNanoId === item.entityNanoId;
      if (item.entityType === 'gigwan') return Boolean(resolvedGigwanNanoId);
      return item.key === activeItemKey;
    },
    [
      activeItemKey,
      resolvedGigwanNanoId,
      selectedBoonNanoId,
      selectedJojikNanoId,
      selectedKonNanoId,
      selectedSueopNanoId,
    ],
  );

  const getVisibleChildren = useCallback(
    (item: Item): Item[] => {
      if (!item.children) return [];
      if (item.entityType === 'gigwan') {
        if (!isGigwanExpanded) return [];
        if (selectedJojikNanoId) {
          return item.children.filter((child) => child.entityNanoId === selectedJojikNanoId);
        }
        return item.children;
      }

      if (item.entityType === 'jojik') {
        if (selectedJojikNanoId && item.entityNanoId !== selectedJojikNanoId) return [];
        if (selectedSueopNanoId) {
          return (item.children ?? []).filter((child) => child.entityNanoId === selectedSueopNanoId);
        }
        return item.children ?? [];
      }

      if (item.entityType === 'sueop') {
        if (selectedSueopNanoId && item.entityNanoId !== selectedSueopNanoId) return [];
        if (selectedKonNanoId) {
          return (item.children ?? []).filter((child) => child.entityNanoId === selectedKonNanoId);
        }
        return item.children ?? [];
      }

      if (item.entityType === 'kon') {
        if (selectedKonNanoId && item.entityNanoId !== selectedKonNanoId) return [];
        return item.children ?? [];
      }

      return item.children ?? [];
    },
    [isGigwanExpanded, selectedJojikNanoId, selectedKonNanoId, selectedSueopNanoId],
  );

  const navigateIfHref = useCallback(
    (href?: string | null) => {
      if (!href) return;
      router.push(href);
    },
    [router],
  );

  const handleItemClick = useCallback(
    (item: Item) => {
      setActiveItemKey(item.key);

      switch (item.entityType) {
        case 'gigwan': {
          setIsGigwanExpanded((prev) => !prev);
          setSelectedJojikNanoId(null);
          setSelectedSueopNanoId(null);
          setSelectedKonNanoId(null);
          setSelectedBoonNanoId(null);
          navigateIfHref(item.href);
          return;
        }
        case 'jojik': {
          if (selectedJojikNanoId === item.entityNanoId) {
            setSelectedJojikNanoId(null);
            setSelectedSueopNanoId(null);
            setSelectedKonNanoId(null);
            setSelectedBoonNanoId(null);
            setIsGigwanExpanded(true);
            if (hierarchy.gigwan?.nanoId) {
              navigateIfHref(`/td/np/gis/${hierarchy.gigwan.nanoId}/manage/home/dv`);
            }
            return;
          }
          setSelectedJojikNanoId(item.entityNanoId ?? null);
          setSelectedSueopNanoId(null);
          setSelectedKonNanoId(null);
          setSelectedBoonNanoId(null);
          setIsGigwanExpanded(true);
          navigateIfHref(item.href);
          return;
        }
        case 'sueop': {
          if (selectedSueopNanoId === item.entityNanoId) {
            setSelectedSueopNanoId(null);
            setSelectedKonNanoId(null);
            setSelectedBoonNanoId(null);
            return;
          }
          setSelectedSueopNanoId(item.entityNanoId ?? null);
          setSelectedKonNanoId(null);
          setSelectedBoonNanoId(null);
          return;
        }
        case 'kon': {
          if (selectedKonNanoId === item.entityNanoId) {
            setSelectedKonNanoId(null);
            setSelectedBoonNanoId(null);
            return;
          }
          setSelectedKonNanoId(item.entityNanoId ?? null);
          setSelectedBoonNanoId(null);
          return;
        }
        case 'boon': {
          if (selectedBoonNanoId === item.entityNanoId) {
            setSelectedBoonNanoId(null);
            return;
          }
          setSelectedBoonNanoId(item.entityNanoId ?? null);
          return;
        }
        default:
          navigateIfHref(item.href);
      }
    },
    [
      hierarchy.gigwan?.nanoId,
      navigateIfHref,
      selectedBoonNanoId,
      selectedJojikNanoId,
      selectedKonNanoId,
      selectedSueopNanoId,
    ],
  );

  const handleBackToGigwan = useCallback(() => {
    setSelectedJojikNanoId(null);
    setSelectedSueopNanoId(null);
    setSelectedKonNanoId(null);
    setSelectedBoonNanoId(null);
    setIsGigwanExpanded(true);
    if (hierarchy.gigwan?.nanoId) {
      navigateIfHref(`/td/np/gis/${hierarchy.gigwan.nanoId}/manage/home/dv`);
    }
  }, [hierarchy.gigwan?.nanoId, navigateIfHref]);

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

          const token = useAuthStore.getState().getCurrentAccessToken();
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
    setIsProfileModalOpen(true);
    setIsProfileMenuOpen(false);
  }, []);

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
  const hydrated = useHydrated();

  if (!hydrated) return null;

  const renderItems = (list: Item[]) =>
    list.map((item) => {
      const isActive = getIsItemActive(item);
      const visibleChildren = getVisibleChildren(item);
      const isExpanded = visibleChildren.length > 0;
      const linkStyles = [
        ...cssObj.navLink[isActive ? 'active' : 'inactive'],
        cssObj.navLinkDepth[item.depth],
      ] as const;
      const labelStyles = [
        cssObj.navLabel,
        cssObj.navLabelWeight[isActive ? 'active' : 'inactive'],
      ] as const;
      const iconStyles = isActive ? [cssObj.navIcon, cssObj.navIconActive] : [cssObj.navIcon];
      const commonProps = {
        css: linkStyles,
        onClick: () => handleItemClick(item),
        'aria-current': isActive ? 'page' : undefined,
        'aria-expanded': item.children ? isExpanded : undefined,
      };

      return (
        <li key={item.key} css={cssObj.navListItem}>
          {item.href ? (
            <Link href={item.href} {...commonProps}>
              <span css={iconStyles} aria-hidden />
              <span css={labelStyles}>{item.label}</span>
            </Link>
          ) : (
            <button type="button" {...commonProps}>
              <span css={iconStyles} aria-hidden />
              <span css={labelStyles}>{item.label}</span>
            </button>
          )}
          {visibleChildren.length > 0 && (
            <ul css={cssObj.navChildList}>{renderItems(visibleChildren)}</ul>
          )}
        </li>
      );
    });

  return (
    <aside
      css={effectiveIsOpen ? cssObj.navContainerOpen : cssObj.navContainerClosed}
      aria-label="기본 내비게이션"
      data-open={effectiveIsOpen ? 'true' : 'false'}
    >
      <div css={cssObj.toggleBar}>
        <button
          type="button"
          css={cssObj.toggleButton}
          onClick={handleToggle}
          aria-expanded={effectiveIsOpen}
          aria-controls="primary-nav-list"
          aria-label={effectiveIsOpen ? '메뉴 접기' : '메뉴 열기'}
        >
          {effectiveIsOpen ? (
            <SidebarCloseIcon css={cssObj.icon} />
          ) : (
            <SidebarOpenIcon css={cssObj.icon} />
          )}
        </button>
      </div>

      <ul id="primary-nav-list" css={cssObj.navList[effectiveIsOpen ? 'show' : 'hide']}>
        {selectedJojikItem ? (
          <>
            {hierarchy.gigwan && (
              <li key="gigwan-back" css={cssObj.navListItem}>
                <button
                  type="button"
                  css={[...cssObj.navLink.inactive, cssObj.navBackButton]}
                  onClick={handleBackToGigwan}
                >
                  <span css={cssObj.navLabel}>{`< ${hierarchy.gigwan.name}`}</span>
                </button>
              </li>
            )}
            <li
              key={`selected-jojik-${selectedJojikItem.key}`}
              css={[cssObj.navListItem, cssObj.selectedJojikContainer]}
            >
              <span css={cssObj.selectedJojikLabel}>{selectedJojikItem.label}</span>
            </li>
            {renderItems(selectedJojikChildren)}
          </>
        ) : (
          renderItems(items)
        )}
      </ul>

      <div css={cssObj.navFooter[effectiveIsOpen ? 'show' : 'hide']}>
        <a
          href="https://example.com/purchase-strike"
          target="_blank"
          rel="noopener noreferrer"
          css={[...cssObj.navLink.inactive, cssObj.navLinkDepth[1]]}
        >
          <span css={[cssObj.navLabel, cssObj.navLabelWeight.inactive]}>
            마법사 구매 및 파업 신고
          </span>
        </a>
        <a
          href="https://example.com/feature-request"
          target="_blank"
          rel="noopener noreferrer"
          css={[...cssObj.navLink.inactive, cssObj.navLinkDepth[1]]}
        >
          <span css={[cssObj.navLabel, cssObj.navLabelWeight.inactive]}>기능 요청</span>
        </a>
        <a
          href="https://example.com/contact-dada"
          target="_blank"
          rel="noopener noreferrer"
          css={[...cssObj.navLink.inactive, cssObj.navLinkDepth[1]]}
        >
          <span css={[cssObj.navLabel, cssObj.navLabelWeight.inactive]}>다다팀에 문의하기</span>
        </a>

        <div css={cssObj.footerProfileSection}>
          <div css={cssObj.footerVersionGroup}>
            <span css={cssObj.footerBrand}>티키타</span>
            <span css={cssObj.footerVerText}>&nbsp;Ver 0.1.0</span>
          </div>
          <button
            type="button"
            css={cssObj.profileTriggerButton}
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
              css={cssObj.profileTriggerImage}
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
      <MyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        sayongjaNanoId={myProfileData?.nanoId ?? null}
        gigwanNanoId={gigwanNanoId}
        userName={myProfileData?.name ?? ''}
      />
    </aside>
  );
};
