import { css, type Interpolation, type Theme } from '@emotion/react';

import { color } from '@/style/color';
import { radius, spacing } from '@/style/primitive';
import { typography } from '@/style/typo';

type IT = Interpolation<Theme>;

export const navContainer = css({
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${spacing.xxl}`,
  background: color.cgrey10,
  minHeight: '52px',
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
  gap: spacing.lg,
  overflowX: 'auto',
  width: '100%',
});

export const navListItem = css({
  flexShrink: 0,
});

const navLinkBase = css({
  ...typography.bodyM,
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${spacing.sm} 0`,
  textDecoration: 'none',
  color: color.cgrey400,
  whiteSpace: 'nowrap',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: color.cgrey600,
  },
  '&:focus-visible': {
    outline: `2px solid ${color.blue200}`,
    outlineOffset: '4px',
  },
  '&::after': {
    content: "''",
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '-12px',
    height: '2px',
    borderRadius: radius.sm,
    background: 'transparent',
    transition: 'background 0.2s ease',
  },
});

export const navLink: Record<'active' | 'inactive', IT[]> = {
  active: [
    navLinkBase,
    css({
      ...typography.bodySB,
      color: color.cgrey700,
      '&::after': {
        background: color.blue,
      },
    }),
  ],
  inactive: [navLinkBase],
};
