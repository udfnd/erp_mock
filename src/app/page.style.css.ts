import { style } from '@vanilla-extract/css';

import { typography } from '@/design/typo.css';

export const main = style({
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
});

export const h1 = style([
  typography.titleB,
  {
    marginBottom: 16,
  },
]);

export const section = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 24,
  alignItems: 'flex-start',
});
