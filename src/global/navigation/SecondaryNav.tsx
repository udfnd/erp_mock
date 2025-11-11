'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { Chip } from '@/common/components';

import { NavItem, getDynamicHref } from './nav.data';
import { useNavigationHierarchy } from './NavigationHierarchyContext';
import * as styles from './SecondaryNav.style';

import type { PrimaryNavHierarchy } from './navigation.types';

type Props = {
  navItems: NavItem[];
  hierarchy?: PrimaryNavHierarchy;
};

const getParamValue = (params: ReturnType<typeof useParams>, key: string): string | null => {
  const value = (params as Record<string, string | string[] | undefined>)[key];
  if (!value) return null;
  return typeof value === 'string' ? value : (value[0] ?? null);
};

export const SecondaryNav = ({ navItems, hierarchy }: Props) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const hierarchyFromContext = useNavigationHierarchy();
  const effectiveHierarchy = hierarchy ?? hierarchyFromContext;

  const gigwanParam = useMemo(() => getParamValue(params, 'gi'), [params]);
  const jojikParam = useMemo(() => getParamValue(params, 'jo'), [params]);

  const gigwanName = useMemo(() => {
    if (!effectiveHierarchy?.gigwan) {
      return gigwanParam;
    }

    if (gigwanParam && effectiveHierarchy.gigwan.nanoId !== gigwanParam) {
      return gigwanParam;
    }

    return effectiveHierarchy.gigwan.name;
  }, [effectiveHierarchy, gigwanParam]);

  const jojikName = useMemo(() => {
    if (!jojikParam) return null;
    const matched = effectiveHierarchy?.jojiks.find((item) => item.nanoId === jojikParam);
    return matched?.name ?? jojikParam;
  }, [effectiveHierarchy, jojikParam]);

  const resolveDisplayName = useCallback(
    (name: string) => {
      let result = name;
      if (gigwanName) {
        result = result.replace(/{기관명}/g, gigwanName);
      }
      if (jojikName) {
        result = result.replace(/{조직명}/g, jojikName);
      }
      return result;
    },
    [gigwanName, jojikName],
  );

  if (!navItems || navItems.length === 0) return null;

  return (
    <nav css={styles.navContainer} aria-label="세부 내비게이션">
      <ul css={styles.navList}>
        {navItems.map((item) => {
          const href = getDynamicHref(item.href, params);
          const resolvedBasePath = item.basePath
            ? getDynamicHref(item.basePath, params)
            : undefined;
          const isActive = resolvedBasePath
            ? pathname.startsWith(resolvedBasePath)
            : href
              ? pathname === href
              : false;

          return (
            <li key={item.name} css={styles.navListItem}>
              {href ? (
                <Chip
                  size="lg"
                  variant="outlined"
                  active={isActive}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => router.push(href)}
                >
                  {resolveDisplayName(item.name)}
                </Chip>
              ) : (
                <Chip size="sm" variant="outlined" disabled>
                  {resolveDisplayName(item.name)}
                </Chip>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
