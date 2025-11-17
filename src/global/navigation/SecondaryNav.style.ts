import { css } from '@emotion/react';

import { color } from '@/style/color';
import { spacing } from '@/style/primitive';

export const navContainer = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingTop: '4px',
  paddingLeft: '8px',
  background: color.cgrey10,
  boxSizing: 'border-box',
  '@media (max-width: 959px)': {
    padding: `0 ${spacing.base}`,
  },
});

export const navList = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  gap: spacing.sm,
  alignItems: 'center',
  overflowX: 'auto',
  width: '100%',
});

export const navListItem = css({
  flexShrink: 0,
});
