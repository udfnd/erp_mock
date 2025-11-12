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

const MANAGE_BASE = join(ROOT, ID_SEG, 'manage');

const NAV_ITEMS = [
  { name: '홈', href: join(MANAGE_BASE, 'home', 'dv') },
  { name: '기관 설정', href: join(MANAGE_BASE, 'setting', 'sv') },
] satisfies NavItem[];

type LayoutProps = { children: ReactNode };

export default function GigwanManageLayout({ children }: LayoutProps) {
  return (
    <div css={cssObj.tertiaryNavStyle}>
      <TertiaryNav navItems={NAV_ITEMS} />
      {children}
    </div>
  );
}
