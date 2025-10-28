'use client';

import { useParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import * as styles from './ErpLayout.style.css';
import { getDynamicHref, primaryNavItems, secondaryNavItems } from './nav.data';
import PrimaryNav from './PrimaryNav';
import SecondaryNav from './SecondaryNav';
import TertiaryNav from './TertiaryNav';

type HeaderVisibility = 'full' | 'compact' | 'hidden';

type VisibilityMap = {
  secondary: keyof typeof styles.secondaryNavWrapper;
  tertiary: keyof typeof styles.tertiaryNavWrapper;
};

const getVisibilityMap = (state: HeaderVisibility): VisibilityMap => {
  switch (state) {
    case 'hidden':
      return { secondary: 'hidden', tertiary: 'hidden' };
    case 'compact':
      return { secondary: 'hidden', tertiary: 'visible' };
    case 'full':
    default:
      return { secondary: 'visible', tertiary: 'visible' };
  }
};

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const lastScrollTop = useRef(0);
  const [headerVisibility, setHeaderVisibility] = useState<HeaderVisibility>('full');

  const activePrimaryItem = useMemo(() => {
    return primaryNavItems.find((item) => {
      if (!item.basePath) return false;
      const resolvedBase = getDynamicHref(item.basePath, params);
      return pathname.startsWith(resolvedBase);
    });
  }, [pathname, params]);

  const currentSecondaryNavItems = useMemo(() => {
    if (!activePrimaryItem?.basePath) return [];
    return secondaryNavItems[activePrimaryItem.basePath] ?? [];
  }, [activePrimaryItem]);

  const activeSecondaryItem = useMemo(() => {
    if (currentSecondaryNavItems.length === 0) return null;

    return currentSecondaryNavItems.find((item) => {
      if (!item.basePath) return false;
      const dynamicBasePath = getDynamicHref(item.basePath, params);
      return pathname.startsWith(dynamicBasePath);
    });
  }, [pathname, params, currentSecondaryNavItems]);

  const currentTertiaryNavItems = useMemo(() => {
    return activeSecondaryItem?.items ?? [];
  }, [activeSecondaryItem]);

  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    const handleScroll = () => {
      const currentTop = scrollEl.scrollTop;

      if (currentTop <= 0) {
        setHeaderVisibility('full');
      } else if (currentTop > lastScrollTop.current) {
        setHeaderVisibility('hidden');
      } else {
        setHeaderVisibility('compact');
      }

      lastScrollTop.current = currentTop;
    };

    lastScrollTop.current = scrollEl.scrollTop;
    scrollEl.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    lastScrollTop.current = 0;
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) {
      return;
    }

    scrollEl.scrollTo({ top: 0, behavior: 'auto' });
    let frame: number | null = null;

    frame = window.requestAnimationFrame(() => {
      setHeaderVisibility('full');
    });

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [pathname]);

  const visibility = getVisibilityMap(headerVisibility);

  return (
    <div className={styles.container}>
      <PrimaryNav />
      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          {currentSecondaryNavItems.length > 0 ? (
            <div className={styles.secondaryNavWrapper[visibility.secondary]}>
              <SecondaryNav navItems={currentSecondaryNavItems} />
            </div>
          ) : null}

          {currentTertiaryNavItems.length > 0 ? (
            <div className={styles.tertiaryNavWrapper[visibility.tertiary]}>
              <TertiaryNav navItems={currentTertiaryNavItems} />
            </div>
          ) : null}
        </header>

        <main
          ref={scrollContainerRef}
          className={styles.content}
          id="erp-main-content"
          tabIndex={-1}
        >
          <div className={styles.contentInner}>{children}</div>
        </main>
      </div>
    </div>
  );
}
