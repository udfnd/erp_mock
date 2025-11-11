'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { Chip } from '@/common/components';
import { useGigwanNameQuery } from '@/domain/gigwan/api';
import { useJojikQuery } from '@/domain/jojik/api';

import { NavItem, getDynamicHref } from './nav.data';
import * as styles from './SecondaryNav.style';


type Props = {
  navItems: NavItem[];
};

const getParamValue = (params: ReturnType<typeof useParams>, key: string): string | null => {
  const value = (params as Record<string, string | string[] | undefined>)[key];
  if (!value) return null;
  return typeof value === 'string' ? value : (value[0] ?? null);
};

export const SecondaryNav = ({ navItems }: Props) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const gi = useMemo(() => getParamValue(params, 'gi'), [params]);
  const jo = useMemo(() => getParamValue(params, 'jo'), [params]);

  const { data: gigwanData } = useGigwanNameQuery(gi ?? '', { enabled: Boolean(gi) });
  const { data: jojikData } = useJojikQuery(jo ?? '', { enabled: Boolean(jo) });

  const gigwanName = useMemo(() => gigwanData?.name ?? gi ?? null, [gigwanData, gi]);
  const jojikName = useMemo(() => jojikData?.name ?? jo ?? null, [jojikData, jo]);

  const resolveDisplayName = useCallback(
    (raw: string) => {
      if (!raw) return raw;
      let result = raw;
      if (result.includes('{기관명}')) result = result.replaceAll('{기관명}', gigwanName ?? '');
      if (result.includes('{조직명}')) result = result.replaceAll('{조직명}', jojikName ?? '');
      return result;
    },
    [gigwanName, jojikName]
  );

  if (!navItems || navItems.length === 0) return null;

  return (
    <nav css={styles.navContainer} aria-label="세부 내비게이션">
      <ul css={styles.navList}>
        {navItems.map((item) => {
          const href = getDynamicHref(item.href, params);
          const resolvedBasePath = item.basePath ? getDynamicHref(item.basePath, params) : undefined;
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
