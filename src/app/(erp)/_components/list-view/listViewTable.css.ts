import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const tableWrapper = style({
  width: '100%',
  overflow: 'hidden',
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
});

const baseHeaderCell = style([
  typography.captionB,
  {
    textAlign: 'left',
    paddingBottom: themeVars.spacing.base,
    color: themeVars.palette.cgrey500,
    borderBottom: `1px solid ${themeVars.palette.cgrey200}`,
  },
]);

const baseCell = style([
  typography.bodyR,
  {
    paddingTop: themeVars.spacing.base,
    paddingBottom: themeVars.spacing.base,
    color: themeVars.palette.black,
    borderBottom: `1px solid ${themeVars.palette.cgrey100}`,
  },
]);

export const headerCell = {
  left: style([baseHeaderCell, { textAlign: 'left' }]),
  center: style([baseHeaderCell, { textAlign: 'center' }]),
  right: style([baseHeaderCell, { textAlign: 'right' }]),
};

export const cell = {
  left: style([baseCell, { textAlign: 'left' }]),
  center: style([baseCell, { textAlign: 'center' }]),
  right: style([baseCell, { textAlign: 'right' }]),
};

export const checkboxHeader = style({
  width: 48,
  paddingBottom: themeVars.spacing.base,
  borderBottom: `1px solid ${themeVars.palette.cgrey200}`,
});

export const checkboxCell = style({
  width: 48,
  paddingTop: themeVars.spacing.base,
  paddingBottom: themeVars.spacing.base,
  borderBottom: `1px solid ${themeVars.palette.cgrey100}`,
});

export const row = recipe({
  base: {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    selectors: {
      '&:hover': {
        backgroundColor: themeVars.palette.blue50,
      },
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: themeVars.palette.blue100,
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
  },
});

export const emptyRow = style({
  height: 160,
});

export const emptyCell = style([
  typography.bodyR,
  {
    textAlign: 'center',
    color: themeVars.palette.cgrey400,
  },
]);
