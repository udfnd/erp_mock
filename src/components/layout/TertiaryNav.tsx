'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { Button } from '@/design';

import { NavItem, getDynamicHref } from './nav.data';
import * as styles from './TertiaryNav.style.css';

type Props = {
  navItems: NavItem[];
};

export default function TertiaryNav({ navItems }: Props) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  if (!navItems || navItems.length === 0) return null;

  return (
    <nav className={styles.navContainer} aria-label="세부 섹션 내비게이션">
      <ul className={styles.navList}>
        {navItems.map((item) => {
          const href = getDynamicHref(item.href, params);
          const isActive = href ? pathname === href : false;

          return (
            <li key={item.name} className={styles.navListItem}>
              {href ? (
                <Button
                  size="small"
                  variant={isActive ? 'secondary' : 'assistive'}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => router.push(href)}
                >
                  {item.name}
                </Button>
              ) : (
                <Button size="small" variant="assistive" disabled>
                  {item.name}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
