import { css } from '@emotion/react';
import { color, typography } from '@/style';

export const cssObj = {
  page: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '160px 0',
  }),

  image: css({
    objectFit: 'cover',
    marginBottom: '20px',
  }),

  header: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  }),

  title: css([typography.titleSmallB, { color: color.black }]),

  subtitle: css([typography.bodyR, { color: color.cgrey400 }]),
} as const;
