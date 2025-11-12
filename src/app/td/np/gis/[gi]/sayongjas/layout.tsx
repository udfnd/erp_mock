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

const SAYONGJAS_BASE = join(ROOT, ID_SEG, 'sayongjas');

const NAV_ITEMS = [{ name: '사용자들', href: join(SAYONGJAS_BASE, 'home', 'lv') }] satisfies NavItem[];

type LayoutProps = { children: ReactNode };

export default function GigwanSayongjasLayout({ children }: LayoutProps) {
  return (
    <div css={cssObj.tertiaryNavStyle}>
      <TertiaryNav navItems={NAV_ITEMS} />
      {children}
    </div>
  );
}
