import { ReactNode } from 'react';

import * as styles from './listViewLayout.css';

export type ListViewLayoutProps = {
  title: string;
  description?: string;
  meta?: ReactNode;
  headerActions?: ReactNode;
  filterBar?: ReactNode;
  list: ReactNode;
  pagination?: ReactNode;
  sidePanel?: ReactNode;
  emptyState?: ReactNode;
};

export function ListViewLayout({
  title,
  description,
  meta,
  headerActions,
  filterBar,
  list,
  pagination,
  sidePanel,
  emptyState,
}: ListViewLayoutProps) {
  const listContent = list ?? emptyState ?? null;
  const shouldRenderSidePanel = Boolean(sidePanel);
  const shouldRenderListSection = Boolean(filterBar) || Boolean(listContent);

  return (
    <div className={styles.page}>
      <div className={styles.mainArea}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{title}</h1>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
          <div className={styles.headerMeta}>
            {meta}
            {headerActions ? <div className={styles.headerActions}>{headerActions}</div> : null}
          </div>
        </header>
        {shouldRenderListSection ? (
          <section className={styles.listSection}>
            {filterBar ? <div className={styles.listSectionHeader}>{filterBar}</div> : null}
            {listContent ? (
              <div
                className={filterBar ? styles.listSectionBody : styles.listSectionBodyStandalone}
              >
                {listContent}
              </div>
            ) : null}
          </section>
        ) : null}
        {pagination ? <footer className={styles.pagination}>{pagination}</footer> : null}
      </div>
      {shouldRenderSidePanel ? <aside className={styles.sidePanel}>{sidePanel}</aside> : null}
    </div>
  );
}

export default ListViewLayout;
