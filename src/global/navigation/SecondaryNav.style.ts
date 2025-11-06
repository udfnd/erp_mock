import { css } from '@emotion/react';

import { color } from '@/style/color';
import { spacing } from '@/style/primitive';

export const navContainer = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: `0 ${spacing.xxl}`,
  background: color.cgrey10,
  borderBottom: `1px solid ${color.cgrey100}`,
  minHeight: '64px',
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
