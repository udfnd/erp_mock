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
    <nav className={styles.navContainer}>
      {navItems.map((item) => {
        const dynamicBasePath = item.basePath ? getDynamicHref(item.basePath, params) : '';
        const isActive = dynamicBasePath
          ? pathname.startsWith(dynamicBasePath)
          : pathname === getDynamicHref(item.href, params);
        const href = getDynamicHref(item.href, params);

        return (
          <Link
            key={item.name}
            href={href}
            className={styles.navLink[isActive ? 'active' : 'inactive']}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
