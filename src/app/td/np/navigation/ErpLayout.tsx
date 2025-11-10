'use client';

import { useParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import * as styles from './ErpLayout.style';
import PrimaryNav from './PrimaryNav';
import SecondaryNav from './SecondaryNav';
import TertiaryNav from './TertiaryNav';
import { getDynamicHref, primaryNavItems, secondaryNavItems } from './nav.data';

import type { PrimaryNavHierarchy } from './navigation.types';

type HeaderVisibility = 'full' | 'compact' | 'hidden';

const isPrimaryNavHierarchyEqual = (a: PrimaryNavHierarchy, b: PrimaryNavHierarchy) => {
  if (Boolean(a.gigwan) !== Boolean(b.gigwan)) return false;
  if (a.gigwan && b.gigwan) {
    if (a.gigwan.nanoId !== b.gigwan.nanoId || a.gigwan.name !== b.gigwan.name) {
      return false;
    }
  }

  if (a.jojiks.length !== b.jojiks.length) return false;

  for (let i = 0; i < a.jojiks.length; i += 1) {
    const aj = a.jojiks[i];
    const bj = b.jojiks[i];

    if (aj.nanoId !== bj.nanoId || aj.name !== bj.name) {
      return false;
    }

    if (aj.sueops.length !== bj.sueops.length) {
      return false;
    }

    for (let j = 0; j < aj.sueops.length; j += 1) {
      const as = aj.sueops[j];
      const bs = bj.sueops[j];

      if (as.nanoId !== bs.nanoId || as.name !== bs.name) {
        return false;
      }
    }
  }

  return true;
};

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef(0);
  const [headerVisibility, setHeaderVisibility] = useState<HeaderVisibility>('full');
  const [primaryNavHierarchy, setPrimaryNavHierarchy] = useState<PrimaryNavHierarchy>({
    gigwan: null,
    jojiks: [],
  });

  const handlePrimaryNavHierarchyChange = useCallback((next: PrimaryNavHierarchy) => {
    setPrimaryNavHierarchy((prev) => {
      if (isPrimaryNavHierarchyEqual(prev, next)) {
        return prev;
      }
      return next;
    });
  }, []);

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
    <div css={styles.container}>
      <PrimaryNav onHierarchyChange={handlePrimaryNavHierarchyChange} />
      <div css={styles.mainWrapper}>
        <header css={styles.header}>
          {currentSecondaryNavItems.length > 0 ? (
            <div css={styles.secondaryNavWrapper[secondaryVisibility]}>
              <SecondaryNav navItems={currentSecondaryNavItems} hierarchy={primaryNavHierarchy} />
            </div>
          ) : null}
          {currentTertiaryNavItems.length > 0 ? (
            <div css={styles.tertiaryNavWrapper[tertiaryVisibility]}>
              <TertiaryNav navItems={currentTertiaryNavItems} />
            </div>
          ) : null}
        </header>
        <main ref={contentRef} css={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
