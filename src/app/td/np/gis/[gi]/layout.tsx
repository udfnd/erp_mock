import type { CSSProperties, ReactNode } from 'react';

import { SecondaryNav } from '@/global/navigation';
import { getSecondaryNavGroup } from '@/global/navigation/nav.data';

const NAV_ITEMS = getSecondaryNavGroup('/td/np/gis');

const contentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

type LayoutProps = {
  children: ReactNode;
};

export default function GigwanSectionLayout({ children }: LayoutProps) {
  return (
    <div style={contentStyle}>
      <SecondaryNav navItems={NAV_ITEMS} />
      {children}
    </div>
  );
}
