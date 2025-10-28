'use client';

import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';

// vanilla-extract 스타일 import
import * as styles from './ErpLayout.style.css';
import { getDynamicHref, primaryNavItems, secondaryNavItems } from './nav.data';
import PrimaryNav from './PrimaryNav';
import SecondaryNav from './SecondaryNav';
import TertiaryNav from './TertiaryNav';

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();

  const activePrimaryItem = useMemo(() => {
    return primaryNavItems.find((item) => pathname.startsWith(item.basePath!));
  }, [pathname]);

  const currentSecondaryNavItems = useMemo(() => {
    if (!activePrimaryItem) return [];
    return secondaryNavItems[activePrimaryItem.basePath!] || [];
  }, [activePrimaryItem]);

  const activeSecondaryItem = useMemo(() => {
    if (currentSecondaryNavItems.length === 0 || !params) return null;

    return currentSecondaryNavItems.find((item) => {
      if (!item.basePath) return false;
      const dynamicBasePath = getDynamicHref(item.basePath, params);
      return pathname.startsWith(dynamicBasePath);
    });
  }, [pathname, params, currentSecondaryNavItems]);

  const currentTertiaryNavItems = useMemo(() => {
    return activeSecondaryItem?.items || [];
  }, [activeSecondaryItem]);

  return (
    <div className={styles.container}>
      <PrimaryNav />
      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <SecondaryNav navItems={currentSecondaryNavItems} />
          <TertiaryNav navItems={currentTertiaryNavItems} />
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
