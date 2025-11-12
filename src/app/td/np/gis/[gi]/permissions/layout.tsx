'use client';

import type { ReactNode } from 'react';

import { TertiaryNav } from '@/global/navigation';
import type { NavItem } from '@/global/navigation/nav.data';

import { cssObj } from '../../../style';

const ROOT = '/td/np/gis';
const ID_SEG = '[gi]';

const join = (...parts: string[]) =>
  '/' +
  parts
    .filter(Boolean)
    .map((part) => String(part).replace(/^\/+|\/+$/g, ''))
    .join('/');

const PERMISSIONS_BASE = join(ROOT, ID_SEG, 'permissions');

const NAV_ITEMS = [
  { name: '권한들', href: join(PERMISSIONS_BASE, 'home', 'lv') },
  { name: '권한 그룹들', href: join(PERMISSIONS_BASE, 'permission-groups', 'lv') },
] satisfies NavItem[];

type LayoutProps = { children: ReactNode };

export default function GigwanPermissionsLayout({ children }: LayoutProps) {
  return (
    <div css={cssObj.tertiaryNavStyle}>
      <TertiaryNav navItems={NAV_ITEMS} />
      {children}
    </div>
  );
}
