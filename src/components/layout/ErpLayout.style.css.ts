import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';

export const container = style({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  background: themeVars.palette.cgrey10,
  overflow: 'hidden',
});

export const mainWrapper = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const header = style({
  flexShrink: 0,
});

export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: '24px 32px',

  '@media': {
    '(max-width: 959px)': {
      padding: '16px',
    },
  },
});
