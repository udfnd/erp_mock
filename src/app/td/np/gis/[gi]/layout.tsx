'use client';

import type { ReactNode } from 'react';

import { SecondaryNav } from '@/global/navigation';
import { getSecondaryNavGroup } from '@/global/navigation/nav.data';
import { cssObj } from '../../style';

const NAV_ITEMS = getSecondaryNavGroup('/td/np/gis');

type LayoutProps = {
  children: ReactNode;
};

export default function NpSecondaryNavigation({ children }: LayoutProps) {
  return (
    <div css={cssObj.secondaryNavStyle}>
      <SecondaryNav navItems={NAV_ITEMS} />
      {children}
    </div>
  );
}
