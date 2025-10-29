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
        {filterBar ? <div className={styles.filterBar}>{filterBar}</div> : null}
        <section className={styles.listSection}>
          {list}
          {!list && emptyState}
        </section>
        {pagination ? <footer className={styles.pagination}>{pagination}</footer> : null}
      </div>
      <aside className={styles.sidePanel}>
        {sidePanel ?? emptyState ?? <div className={styles.sidePanelPlaceholder}>우측 패널에 표시할 정보가 없습니다.</div>}
      </aside>
    </div>
  );
}

export default ListViewLayout;
