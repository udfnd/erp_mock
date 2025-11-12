'use client';

import type { ReactNode } from 'react';
import { SecondaryNav } from '@/global/navigation';
import { cssObj } from '../../style';

const ROOT = '/td/np/gis';
const ID_SEG = '[gi]';

const join = (...parts: string[]) =>
  '/' +
  parts
    .filter(Boolean)
    .map((p) => String(p).replace(/^\/+|\/+$/g, ''))
    .join('/');

const MANAGE_BASE = join(ROOT, ID_SEG, 'manage');
const JOJIKS_BASE = join(ROOT, ID_SEG, 'jojiks');
const USERS_BASE = join(ROOT, ID_SEG, 'sayongjas');
const PERMS_BASE = join(ROOT, ID_SEG, 'permissions');

const NAV_ITEMS = [
  {
    name: '{기관명} 관리',
    href: join(MANAGE_BASE, 'home', 'dv'),
    basePath: MANAGE_BASE,
  },
  {
    name: '조직들',
    href: join(JOJIKS_BASE, 'home', 'lv'),
    basePath: JOJIKS_BASE,
  },
  {
    name: '사용자들',
    href: join(USERS_BASE, 'home', 'lv'),
    basePath: USERS_BASE,
  },
  {
    name: '권한들',
    href: join(PERMS_BASE, 'home', 'lv'),
    basePath: PERMS_BASE,
  },
];

type LayoutProps = { children: ReactNode };

export default function NpSecondaryNavigation({ children }: LayoutProps) {
  return (
    <div css={cssObj.secondaryNavStyle}>
      <SecondaryNav navItems={NAV_ITEMS} />
      {children}
    </div>
  );
}
