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

const JAEWONSAENGS_BASE = join(ROOT, ID_SEG, 'jaewonsaengs');

const NAV_ITEMS = [
  { name: '재원생들', href: join(JAEWONSAENGS_BASE, 'home', 'lv') },
  { name: '재원생 그룹들', href: join(JAEWONSAENGS_BASE, 'group', 'lv') },
  { name: '재원생 하다 신청', href: join(JAEWONSAENGS_BASE, 'hada-requests', 'lv') },
] satisfies NavItem[];

type LayoutProps = { children: ReactNode };

export default function JojikJaewonsaengsLayout({ children }: LayoutProps) {
  return (
    <div css={cssObj.tertiaryNavStyle}>
      <TertiaryNav navItems={NAV_ITEMS} />
      {children}
    </div>
  );
}
