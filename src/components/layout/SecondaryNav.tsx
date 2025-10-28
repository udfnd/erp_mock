'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { NavItem, getDynamicHref } from './nav.data';
import * as styles from './SecondaryNav.style.css';

type Props = {
  navItems: NavItem[];
};

export default function SecondaryNav({ navItems }: Props) {
  const pathname = usePathname();
  const params = useParams();

  if (!navItems || navItems.length === 0) {
    return null;
  }

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
                <Link
                  href={href}
                  className={styles.navLink[isActive ? 'active' : 'inactive']}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={styles.navLink[isActive ? 'active' : 'inactive']}
                  aria-disabled="true"
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
