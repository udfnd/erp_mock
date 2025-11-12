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

const JOJIKS_BASE = join(ROOT, ID_SEG, 'jojiks');

const NAV_ITEMS = [{ name: '조직들', href: join(JOJIKS_BASE, 'home', 'lv') }] satisfies NavItem[];

type LayoutProps = { children: ReactNode };

export default function GigwanJojiksLayout({ children }: LayoutProps) {
  return (
    <div css={cssObj.tertiaryNavStyle}>
      <TertiaryNav navItems={NAV_ITEMS} />
      {children}
    </div>
  );
}
