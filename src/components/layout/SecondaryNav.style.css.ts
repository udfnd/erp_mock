import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const navContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: `0 ${themeVars.spacing['2xl']}`,
  background: themeVars.palette.white,
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

const navLinkBase = style([
  typography.bodySB,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
    borderRadius: themeVars.radius.sm,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s ease, color 0.2s ease',

    ':hover': {
      background: themeVars.palette.cgrey50,
    },

    ':focus-visible': {
      outline: `2px solid ${themeVars.palette.blue300}`,
      outlineOffset: '2px',
    },
  },
]);

export const navLink = styleVariants({
  active: [
    navLinkBase,
    {
      color: themeVars.palette.blue,
      background: themeVars.palette.blue50,
    },
  ],
  inactive: [
    navLinkBase,
    {
      color: themeVars.palette.cgrey500,
    },
  ],
});
