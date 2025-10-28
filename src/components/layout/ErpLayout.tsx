'use client';

import { useParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// vanilla-extract 스타일 import
import * as styles from './ErpLayout.style.css';
import { getDynamicHref, primaryNavItems, secondaryNavItems } from './nav.data';
import PrimaryNav from './PrimaryNav';
import SecondaryNav from './SecondaryNav';
import TertiaryNav from './TertiaryNav';

type NavVisibilityState = 'both' | 'tertiary' | 'none';

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const [navVisibility, setNavVisibility] = useState<NavVisibilityState>('both');
  const lastScrollTopRef = useRef(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

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

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    const currentTarget = event.currentTarget;
    const scrollTop = currentTarget.scrollTop;
    const lastScrollTop = lastScrollTopRef.current;

    if (scrollTop <= 0) {
      setNavVisibility((prev) => (prev === 'both' ? prev : 'both'));
    } else if (scrollTop > lastScrollTop) {
      setNavVisibility((prev) => (prev === 'none' ? prev : 'none'));
    } else if (scrollTop < lastScrollTop) {
      setNavVisibility((prev) => (prev === 'tertiary' ? prev : 'tertiary'));
    }

    lastScrollTopRef.current = scrollTop;
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0 });
    }
    queueMicrotask(() => {
      setNavVisibility('both');
    });
    lastScrollTopRef.current = 0;
  }, [pathname]);

  return (
    <div className={styles.container}>
      <PrimaryNav />
      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <div
            className={
              styles.secondaryNavWrapper[navVisibility === 'both' ? 'visible' : 'hidden']
            }
          >
            <SecondaryNav navItems={currentSecondaryNavItems} />
          </div>
          <div
            className={
              styles.tertiaryNavWrapper[navVisibility === 'none' ? 'hidden' : 'visible']
            }
          >
            <TertiaryNav navItems={currentTertiaryNavItems} />
          </div>
        </header>
        <main ref={contentRef} className={styles.content} onScroll={handleScroll}>
          {children}
        </main>
      </div>
    </div>
  );
}
