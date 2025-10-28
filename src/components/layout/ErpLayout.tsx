'use client';

import { useParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import * as styles from './ErpLayout.style.css';
import { getDynamicHref, primaryNavItems, secondaryNavItems } from './nav.data';
import PrimaryNav from './PrimaryNav';
import SecondaryNav from './SecondaryNav';
import TertiaryNav from './TertiaryNav';

type HeaderVisibility = 'full' | 'compact' | 'hidden';

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef(0);
  const [headerVisibility, setHeaderVisibility] = useState<HeaderVisibility>('full');

  const activePrimaryItem = useMemo(() => {
    return primaryNavItems.find((item) => {
      if (!item.basePath) return false;
      const resolvedBase = getDynamicHref(item.basePath, params);
      return resolvedBase ? pathname.startsWith(resolvedBase) : false;
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
      return dynamicBasePath ? pathname.startsWith(dynamicBasePath) : false;
    });
  }, [pathname, params, currentSecondaryNavItems]);

  const currentTertiaryNavItems = useMemo(() => {
    return activeSecondaryItem?.items ?? [];
  }, [activeSecondaryItem]);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const handleScroll = () => {
      const currentTop = contentEl.scrollTop;
      if (currentTop <= 0) {
        setHeaderVisibility('full');
      } else if (currentTop > lastScrollTop.current) {
        setHeaderVisibility('hidden');
      } else {
        setHeaderVisibility('compact');
      }

      lastScrollTop.current = currentTop;
    };

    lastScrollTop.current = contentEl.scrollTop;
    contentEl.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      contentEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    lastScrollTop.current = 0;

    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname]);

  const secondaryVisibility = headerVisibility === 'full' ? 'visible' : 'hidden';
  const tertiaryVisibility = headerVisibility === 'hidden' ? 'hidden' : 'visible';

  return (
    <div className={styles.container}>
      <PrimaryNav />
      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          {currentSecondaryNavItems.length > 0 ? (
            <div className={styles.secondaryNavWrapper[secondaryVisibility]}>
              <SecondaryNav navItems={currentSecondaryNavItems} />
            </div>
          ) : null}
          {currentTertiaryNavItems.length > 0 ? (
            <div className={styles.tertiaryNavWrapper[tertiaryVisibility]}>
              <TertiaryNav navItems={currentTertiaryNavItems} />
            </div>
          ) : null}
        </header>
        <main ref={contentRef} className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
