'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { Chip } from '@/design';

import { NavItem, getDynamicHref } from './nav.data';
import * as styles from './SecondaryNav.style.css';

type Props = {
  navItems: NavItem[];
};

export default function SecondaryNav({ navItems }: Props) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  if (!navItems || navItems.length === 0) return null;

  return (
    <nav className={styles.navContainer} aria-label="세부 내비게이션">
      <ul className={styles.navList}>
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
            <li key={item.name} className={styles.navListItem}>
              {href ? (
                <Chip
                  size="lg"
                  variant="outlined"
                  active={isActive}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => router.push(href)}
                >
                  {item.name}
                </Chip>
              ) : (
                <Chip size="sm" variant="outlined" disabled>
                  {item.name}
                </Chip>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
