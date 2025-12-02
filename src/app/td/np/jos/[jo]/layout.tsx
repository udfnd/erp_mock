'use client';

import type { ReactNode } from 'react';
import { SecondaryNav } from '@/global/navigation';
import { cssObj } from '../../style';

const ROOT = '/td/np/jos';
const ID_SEG = '[jo]';

const join = (...parts: string[]) =>
  '/' +
  parts
    .filter(Boolean)
    .map((p) => String(p).replace(/^\/+|\/+$/g, ''))
    .join('/');

const MANAGE_BASE = join(ROOT, ID_SEG, 'manage');
const JAWONS_BASE = join(ROOT, ID_SEG, 'jawons');
const SUEOPS_BASE = join(ROOT, ID_SEG, 'sueops');
const JAEWONSAENGS_BASE = join(ROOT, ID_SEG, 'jaewonsaengs');

const NAV_ITEMS = [
  {
    name: '{조직명} 관리',
    href: join(MANAGE_BASE, 'home', 'dv'),
    basePath: MANAGE_BASE,
  },
  {
    name: '수업들',
    href: join(SUEOPS_BASE, 'sueops', 'lv'),
    basePath: SUEOPS_BASE,
  },
  {
    name: '재원생들',
    href: join(JAEWONSAENGS_BASE, 'home', 'lv'),
    basePath: JAEWONSAENGS_BASE,
  },
  {
    name: '자원들',
    href: join(JAWONS_BASE, 'memos', 'lv'),
    basePath: JAWONS_BASE,
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
