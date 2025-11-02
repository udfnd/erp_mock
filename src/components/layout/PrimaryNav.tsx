'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { SidebarOpen, SidebarClose } from '@/components/icons';

import * as styles from './PrimaryNav.style.css';

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

type Item = {
  key: string;
  label: string;
  depth: 1 | 2 | 3;
  href?: string | null;
  children?: Item[];
};

export default function PrimaryNav() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const loginHref = `/td/g`;

  const handleLogout = () => {
    try {
      const re = /auth|token|persist|zustand|session/i;
      const explicitKeys = [
        'auth-store',
        'persist:auth',
        'accessToken',
        'refreshToken',
        'session',
        'auth',
      ];
      try {
        Object.keys(localStorage).forEach((k) => {
          if (re.test(k) || explicitKeys.includes(k)) localStorage.removeItem(k);
        });
        Object.keys(sessionStorage).forEach((k) => {
          if (re.test(k) || explicitKeys.includes(k)) sessionStorage.removeItem(k);
        });
      } catch {}
      try {
        const cookieNames = Array.from(
          new Set(
            document.cookie
              .split(';')
              .map((c) => c.split('=')[0].trim())
              .filter(Boolean)
              .concat(['auth', 'session', 'access_token', 'refresh_token', 'boot-id']),
          ),
        );
        cookieNames.forEach((name) => {
          document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
          document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}; SameSite=Lax`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
      } catch {}
      try {
        router.replace(loginHref);
      } catch {
        window.location.href = loginHref;
      }
    } catch {
      window.location.href = loginHref;
    }
  };

  const items: Item[] = [
    {
      key: '기관명',
      label: '기관명',
      depth: 1,
      href: `/td/np/gis/${(params as any)?.gi ?? 'gi'}/manage/home/dv`,
    },
    {
      key: '조직명',
      label: '조직명',
      depth: 1,
      href: `/td/np/jos/${(params as any)?.jo ?? 'jo'}/manage/home/dv`,
    },
    {
      key: '수업명',
      label: '수업명',
      depth: 1,
      href: null,
      children: [
        {
          key: '수업-d2',
          label: '수업',
          depth: 2,
          href: null,
          children: [{ key: '수업-d3', label: '수업', depth: 3, href: null }],
        },
      ],
    },
  ];

  const renderItems = (list: Item[]) =>
    list.map((item) => {
      const isActive = !!item.href && pathname.startsWith(item.href);
      const linkCls =
        styles.navLink[isActive ? 'active' : 'inactive'] + ' ' + styles.navLinkDepth[item.depth];

      return (
        <li key={item.key} className={styles.navListItem}>
          {item.href ? (
            <Link href={item.href} className={linkCls} aria-current={isActive ? 'page' : undefined}>
              <span className={styles.navIcon} aria-hidden />
              <span
                className={cx(
                  styles.navLabel,
                  styles.navLabelWeight[isActive ? 'active' : 'inactive'],
                )}
              >
                {item.label}
              </span>
            </Link>
          ) : (
            <span className={linkCls} aria-disabled="true">
              <span className={styles.navIcon} aria-hidden />
              <span className={cx(styles.navLabel, styles.navLabelWeight.inactive)}>
                {item.label}
              </span>
            </span>
          )}
          {item.children && item.children.length > 0 && (
            <ul className={styles.navChildList}>{renderItems(item.children)}</ul>
          )}
        </li>
      );
    });

  return (
    <aside
      className={isOpen ? styles.navContainerOpen : styles.navContainerClosed}
      aria-label="기본 내비게이션"
      data-open={isOpen ? 'true' : 'false'}
    >
      <div className={styles.toggleBar}>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="primary-nav-list"
          aria-label={isOpen ? '메뉴 접기' : '메뉴 열기'}
        >
          {isOpen ? (
            <SidebarClose className={styles.icon} />
          ) : (
            <SidebarOpen className={styles.icon} />
          )}
        </button>
      </div>

      <ul id="primary-nav-list" className={styles.navList[isOpen ? 'show' : 'hide']}>
        {renderItems(items)}
      </ul>

      <div className={styles.navFooter[isOpen ? 'show' : 'hide']}>
        <a
          href="https://example.com/purchase-strike"
          target="_blank"
          rel="noopener noreferrer"
          className={cx(styles.navLink.inactive, styles.navLinkDepth[1])}
        >
          <span className={cx(styles.navLabel, styles.navLabelWeight.inactive)}>
            마법사 구매 및 파업 신고
          </span>
        </a>
        <a
          href="https://example.com/feature-request"
          target="_blank"
          rel="noopener noreferrer"
          className={cx(styles.navLink.inactive, styles.navLinkDepth[1])}
        >
          <span className={cx(styles.navLabel, styles.navLabelWeight.inactive)}>기능 요청</span>
        </a>
        <a
          href="https://example.com/contact-dada"
          target="_blank"
          rel="noopener noreferrer"
          className={cx(styles.navLink.inactive, styles.navLinkDepth[1])}
        >
          <span className={cx(styles.navLabel, styles.navLabelWeight.inactive)}>
            다다팀에 문의하기
          </span>
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className={cx(styles.navLink.inactive, styles.navLinkDepth[1])}
          aria-label="로그아웃"
        >
          <span className={cx(styles.navLabel, styles.navLabelWeight.inactive)}>로그아웃</span>
        </button>
        <div className={styles.footerVersion}>
          <span className={styles.footerBrand}>티키타</span>
          <span className={styles.footerVerText}>&nbsp;Ver 0.1.0</span>
        </div>
      </div>
    </aside>
  );
}
