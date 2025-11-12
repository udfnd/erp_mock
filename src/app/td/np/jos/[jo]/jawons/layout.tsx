'use client';

import type { ReactNode } from 'react';

import { TertiaryNav } from '@/global/navigation';
import type { NavItem } from '@/global/navigation/nav.data';

import { cssObj } from '../../../style';

const ROOT = '/td/np/jos';
const ID_SEG = '[jo]';

const join = (...parts: string[]) =>
  '/' +
  parts
    .filter(Boolean)
    .map((part) => String(part).replace(/^\/+|\/+$/g, ''))
    .join('/');

const JAWONS_BASE = join(ROOT, ID_SEG, 'jawons');

const NAV_ITEMS = [
  { name: '메모들', href: join(JAWONS_BASE, 'memos', 'lv') },
  { name: '외부링크들', href: join(JAWONS_BASE, 'oebu-links', 'lv') },
  { name: '주소들', href: join(JAWONS_BASE, 'jusos', 'lv') },
] satisfies NavItem[];

type LayoutProps = { children: ReactNode };

export default function JojikJawonsLayout({ children }: LayoutProps) {
  return (
    <div css={cssObj.tertiaryNavStyle}>
      <TertiaryNav navItems={NAV_ITEMS} />
      {children}
    </div>
  );
}
