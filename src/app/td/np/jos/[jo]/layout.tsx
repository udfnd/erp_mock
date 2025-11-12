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

const NAV_ITEMS = [
  {
    name: '{조직명} 관리',
    href: join(MANAGE_BASE, 'home', 'dv'),
    basePath: MANAGE_BASE,
    items: [
      { name: '홈', href: join(MANAGE_BASE, 'home', 'dv') },
      { name: '조직 설정', href: join(MANAGE_BASE, 'setting', 'sv') },
    ],
  },
  {
    name: '자원들',
    href: join(JAWONS_BASE, 'memos', 'lv'),
    basePath: JAWONS_BASE,
    items: [
      { name: '메모들', href: join(JAWONS_BASE, 'memos', 'lv') },
      { name: '외부링크들', href: join(JAWONS_BASE, 'oebu-links', 'lv') },
      { name: '주소들', href: join(JAWONS_BASE, 'jusos', 'lv') },
    ],
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
