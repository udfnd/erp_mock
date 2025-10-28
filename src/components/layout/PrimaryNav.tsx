'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { getDynamicHref, primaryNavItems } from './nav.data';
import * as styles from './PrimaryNav.style.css';

export default function PrimaryNav() {
  const pathname = usePathname();
  const params = useParams();

  return (
    <aside className={styles.navContainer} aria-label="기본 내비게이션">
      <Link href="/" className={styles.brandArea} aria-label="ERP 홈">
        <span className={styles.brandMark} aria-hidden>
          ERP
        </span>
        <span className={styles.brandLabel}>Mock ERP</span>
      </Link>

      <ul className={styles.navList}>
        {primaryNavItems.map((item) => {
          const href = getDynamicHref(item.href, params);
          const resolvedBasePath = item.basePath
            ? getDynamicHref(item.basePath, params)
            : undefined;
          const isActive = resolvedBasePath
            ? pathname.startsWith(resolvedBasePath)
            : pathname === href;

          return (
            <li key={item.name} className={styles.navListItem}>
              <Link
                href={href}
                className={styles.navLink[isActive ? 'active' : 'inactive']}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={styles.navIcon} aria-hidden />
                <span className={styles.navLabel}>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.navFooter}>
        <div className={styles.profileCard}>
          <span className={styles.profileAvatar} aria-hidden />
          <div className={styles.profileMeta}>
            <span className={styles.profileName}>홍길동</span>
            <span className={styles.profileRole}>관리자</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
