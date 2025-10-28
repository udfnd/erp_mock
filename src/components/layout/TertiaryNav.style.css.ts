import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const navContainer = style({
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${themeVars.spacing['2xl']}`,
  background: themeVars.palette.white,
  boxShadow: themeVars.shadow.sm,
  minHeight: '52px',
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
  gap: themeVars.spacing.lg,
  overflowX: 'auto',
  width: '100%',
});

export const navListItem = style({
  flexShrink: 0,
});

const navLinkBase = style([
  typography.bodyM,
  {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${themeVars.spacing.sm} 0`,
    textDecoration: 'none',
    color: themeVars.palette.cgrey400,
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease',

    ':hover': {
      color: themeVars.palette.cgrey600,
    },

    ':focus-visible': {
      outline: `2px solid ${themeVars.palette.blue200}`,
      outlineOffset: '4px',
    },

    '::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '-12px',
      height: '2px',
      borderRadius: themeVars.radius.sm,
      background: 'transparent',
      transition: 'background 0.2s ease',
    },
  },
]);

export const navLink = styleVariants({
  active: [
    navLinkBase,
    typography.bodySB,
    {
      color: themeVars.palette.cgrey700,
      '::after': {
        background: themeVars.palette.blue,
      },
    },
  ],
  inactive: [navLinkBase],
});
