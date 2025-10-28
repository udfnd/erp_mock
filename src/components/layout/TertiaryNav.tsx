'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { NavItem, getDynamicHref } from './nav.data';
import * as styles from './TertiaryNav.style.css';

type Props = {
  navItems: NavItem[];
};

export default function TertiaryNav({ navItems }: Props) {
  const pathname = usePathname();
  const params = useParams();

  if (!navItems || navItems.length === 0) {
    return null;
  }

  return (
    <nav className={styles.navContainer} aria-label="세부 섹션 내비게이션">
      <ul className={styles.navList}>
        {navItems.map((item) => {
          const href = getDynamicHref(item.href, params);
          const isActive = pathname === href;

          return (
            <li key={item.name} className={styles.navListItem}>
              <Link
                href={href}
                className={styles.navLink[isActive ? 'active' : 'inactive']}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
