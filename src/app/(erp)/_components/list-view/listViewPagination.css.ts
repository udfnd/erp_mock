import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const container = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

export const list = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.sm,
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const pageButton = style([
  typography.bodyR,
  {
    borderRadius: themeVars.radius.sm,
    padding: `${themeVars.spacing.xs} ${themeVars.spacing.sm}`,
    border: `1px solid ${themeVars.palette.cgrey200}`,
    backgroundColor: themeVars.palette.white,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
    selectors: {
      '&:hover': {
        backgroundColor: themeVars.palette.blue50,
        borderColor: themeVars.palette.blue200,
      },
      '&:focus-visible': {
        outline: `2px solid ${themeVars.palette.blue300}`,
        outlineOffset: 2,
      },
    },
  },
]);

export const activePageButton = style({
  backgroundColor: themeVars.palette.blue600,
  borderColor: themeVars.palette.blue600,
  color: themeVars.palette.white,
});

export const ellipsis = style([
  typography.bodyR,
  {
    padding: `${themeVars.spacing.xs} ${themeVars.spacing.base}`,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: themeVars.palette.cgrey500,
    selectors: {
      '&:hover': {
        color: themeVars.palette.blue600,
      },
    },
  },
]);

export const arrowButton = style({
  minWidth: 40,
});

export const visuallyHidden = style({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});
