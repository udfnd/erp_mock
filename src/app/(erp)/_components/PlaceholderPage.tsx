import * as styles from './placeholderPage.css';

import type { ReactNode } from 'react';

type PlaceholderPageProps = {
  title: string;
  description: string;
  meta?: ReactNode;
  children?: ReactNode;
};

export default function PlaceholderPage({
  title,
  description,
  meta,
  children,
}: PlaceholderPageProps) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        {meta ? <div className={styles.meta}>{meta}</div> : null}
      </section>
      {children}
    </div>
  );
}

type PlaceholderSectionProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PlaceholderSection({ title, description, children }: PlaceholderSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description ? <p className={styles.sectionDescription}>{description}</p> : null}
      </div>
      {children ? <div className={styles.sectionBody}>{children}</div> : null}
    </section>
  );
}

type PlaceholderCardProps = {
  label: string;
};

export function PlaceholderCard({ label }: PlaceholderCardProps) {
  return <div className={styles.card}>{label}</div>;
}
