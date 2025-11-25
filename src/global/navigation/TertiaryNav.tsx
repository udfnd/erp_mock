'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { Button } from '@/common/components';

import { NavItem, getDynamicHref } from './nav.data';
import { cssObj } from './TertiaryNav.style';

type Props = {
  navItems: NavItem[];
};

export const TertiaryNav = ({ navItems }: Props) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  if (!navItems || navItems.length === 0) return null;

  return (
    <nav css={cssObj.navContainer} aria-label="세부 섹션 내비게이션">
      <ul css={cssObj.navList}>
        {navItems.map((item) => {
          const href = getDynamicHref(item.href, params);
          const isActive = href ? pathname === href : false;

          return (
            <li key={item.name} css={cssObj.navListItem}>
              {href ? (
                <button
                  css={cssObj.tertiaryNavButton(isActive)}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => router.push(href)}
                >
                  {item.name}
                </button>
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
};
