import clsx from 'clsx';
import { memo } from 'react';

import * as styles from './listViewPagination.css';

type PageButton = {
  type: 'page' | 'ellipsis' | 'first' | 'prev' | 'next' | 'last';
  page?: number;
  label: string;
  disabled?: boolean;
  active?: boolean;
};

const ICONS = {
  first: '≪',
  prev: '‹',
  next: '›',
  last: '≫',
} as const;

export type ListViewPaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

const MAX_VISIBLE = 10;

export const ListViewPagination = memo(function ListViewPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: ListViewPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const currentGroupStart = Math.floor((currentPage - 1) / MAX_VISIBLE) * MAX_VISIBLE + 1;
  const currentGroupEnd = Math.min(currentGroupStart + MAX_VISIBLE - 1, totalPages);

  const buttons: PageButton[] = [];

  buttons.push({ type: 'first', label: '맨 앞으로', page: 1, disabled: currentGroupStart === 1 });
  buttons.push({
    type: 'prev',
    label: '이전 페이지',
    page: Math.max(1, currentPage - 1),
    disabled: currentPage === 1,
  });

  if (currentGroupStart > 1) {
    const previousGroupPage = Math.max(1, currentGroupStart - MAX_VISIBLE);
    buttons.push({ type: 'ellipsis', label: '이전 구간', page: previousGroupPage });
  }

  for (let page = currentGroupStart; page <= currentGroupEnd; page += 1) {
    buttons.push({
      type: 'page',
      label: `${page}페이지`,
      page,
      active: page === currentPage,
    });
  }

  if (currentGroupEnd < totalPages) {
    const nextGroupPage = Math.min(totalPages, currentGroupEnd + 1);
    buttons.push({ type: 'ellipsis', label: '다음 구간', page: nextGroupPage });
  }

  buttons.push({
    type: 'next',
    label: '다음 페이지',
    page: Math.min(totalPages, currentPage + 1),
    disabled: currentPage === totalPages,
  });
  buttons.push({
    type: 'last',
    label: '맨 뒤로',
    page: totalPages,
    disabled: currentGroupEnd === totalPages,
  });

  return (
    <nav className={styles.container} aria-label="페이지 이동">
      <ul className={styles.list}>
        {buttons.map((button, index) => (
          <li key={`${button.type}-${index}`}>
            <PaginationButton {...button} onPageChange={onPageChange} />
          </li>
        ))}
      </ul>
    </nav>
  );
});

type PaginationButtonProps = PageButton & {
  onPageChange: (page: number) => void;
};

const PaginationButton = ({
  type,
  page,
  label,
  disabled,
  active,
  onPageChange,
}: PaginationButtonProps) => {
  const handleClick = () => {
    if (disabled || !page) return;
    onPageChange(page);
  };

  if (type === 'ellipsis') {
    return (
      <button
        type="button"
        className={styles.ellipsis}
        onClick={handleClick}
        aria-label={label}
        title={label}
      >
        …
      </button>
    );
  }

  if (type === 'page') {
    return (
      <button
        type="button"
        className={clsx(styles.pageButton, active && styles.activePageButton)}
        onClick={handleClick}
        aria-current={active ? 'page' : undefined}
        aria-label={label}
        title={label}
      >
        {page}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={styles.navigationButton}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      <span aria-hidden>{ICONS[type]}</span>
      <span className={styles.visuallyHidden}>{label}</span>
    </button>
  );
};
