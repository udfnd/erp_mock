'use client'; // useParams, usePathname 사용으로 'use client' 유지

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';

// vanilla-extract 스타일 import
import { getDynamicHref, primaryNavItems } from './nav.data';
import * as styles from './PrimaryNav.style.css';

export default function PrimaryNav() {
  const pathname = usePathname();
  const params = useParams();

  const activePrimaryItem = useMemo(() => {
    if (!params || Object.keys(params).length === 0) return null;
    return primaryNavItems.find((item) => pathname.startsWith(item.basePath!));
  }, [pathname, params]);

  if (!params || Object.keys(params).length === 0) {
    return null;
  }

  return (
    // styled 컴포넌트 대신 태그와 className 사용
    <nav className={styles.navContainer}>
      {/* TODO: 로고 영역 */}
      <div className={styles.logoPlaceholder}></div>

      {primaryNavItems.map((item) => {
        const isActive = activePrimaryItem?.basePath === item.basePath;
        const href = getDynamicHref(item.href, params);

        return (
          <Link
            key={item.name}
            href={href}
            // styleVariants를 사용하여 조건부 클래스 적용
            className={styles.navLink[isActive ? 'active' : 'inactive']}
          >
            <div className={styles.iconPlaceholder} />
            <span className={styles.navLinkText}>{item.name}</span>
          </Link>
        );
      })}

      <div className={styles.spacer} />

      {/* TODO: 사용자 프로필 영역 */}
      <div className={styles.profilePlaceholder}></div>
    </nav>
  );
}
