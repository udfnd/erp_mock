import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const tableWrapper = style({
  width: '100%',
});

export const table = style({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  tableLayout: 'fixed',
  selectors: {
    '& thead tr': {
      backgroundColor: themeVars.palette.cgrey50,
    },
    '& tbody tr:last-of-type td': {
      borderBottom: 'none',
    },
  },
});

const baseHeaderCell = style([
  typography.captionB,
  {
    textAlign: 'left',
    padding: `${themeVars.spacing.base} ${themeVars.spacing.xl}`,
    color: themeVars.palette.cgrey500,
    borderBottom: `1px solid ${themeVars.palette.cgrey200}`,
    verticalAlign: 'middle',
    height: 52,
  },
]);

const baseCell = style([
  typography.bodyR,
  {
    padding: `${themeVars.spacing.base} ${themeVars.spacing.xl}`,
    color: themeVars.palette.black,
    borderBottom: `1px solid ${themeVars.palette.cgrey100}`,
    verticalAlign: 'middle',
    backgroundColor: themeVars.palette.white,
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
  width: 64,
  padding: `${themeVars.spacing.base} ${themeVars.spacing.lg}`,
  borderBottom: `1px solid ${themeVars.palette.cgrey200}`,
  verticalAlign: 'middle',
});

export const checkboxCell = style({
  width: 64,
  padding: `${themeVars.spacing.base} ${themeVars.spacing.lg}`,
  borderBottom: `1px solid ${themeVars.palette.cgrey100}`,
  verticalAlign: 'middle',
});

export const row = recipe({
  base: {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    selectors: {
      '&:hover': {
        backgroundColor: themeVars.palette.blue50,
      },
      '&:hover td': {
        backgroundColor: themeVars.palette.blue50,
      },
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: themeVars.palette.blue100,
        selectors: {
          '& td': {
            backgroundColor: themeVars.palette.blue100,
          },
        },
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.6,
        selectors: {
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '& td': {
            backgroundColor: themeVars.palette.white,
          },
          '&:hover td': {
            backgroundColor: themeVars.palette.white,
          },
        },
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
