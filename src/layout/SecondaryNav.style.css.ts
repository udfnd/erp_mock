import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';

export const navContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: `0 ${themeVars.spacing.xxl}`,
  background: themeVars.palette.cgrey10,
  borderBottom: `1px solid ${themeVars.palette.cgrey100}`,
  minHeight: '64px',
  boxSizing: 'border-box',
  '@media': {
    '(max-width: 959px)': {
      padding: `0 ${themeVars.spacing.base}`,
    },
  },
});

export const navList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  gap: themeVars.spacing.sm,
  alignItems: 'center',
  overflowX: 'auto',
  width: '100%',
});

export const navListItem = style({
  flexShrink: 0,
});
