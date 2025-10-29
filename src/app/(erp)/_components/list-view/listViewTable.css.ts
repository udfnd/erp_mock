import { style, globalStyle } from '@vanilla-extract/css';
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
});

globalStyle(`${table} thead tr`, {
  backgroundColor: themeVars.palette.cgrey50,
});
globalStyle(`${table} tbody tr:last-of-type td`, {
  borderBottom: 'none',
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

const rowBase = style({
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
});

export const row = recipe({
  base: [rowBase],
  variants: {
    selected: {
      true: {
        backgroundColor: themeVars.palette.blue100,
      },
      false: {},
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.6,
      },
      false: {},
    },
  },
});

globalStyle(`${rowBase}:hover`, {
  backgroundColor: themeVars.palette.blue50,
});
globalStyle(`${rowBase}:hover td`, {
  backgroundColor: themeVars.palette.blue50,
});

const rowSelected = row({ selected: true });
globalStyle(`${rowSelected} td`, {
  backgroundColor: themeVars.palette.blue100,
});
globalStyle(`${rowSelected}:hover td`, {
  backgroundColor: themeVars.palette.blue100,
});

const rowDisabled = row({ disabled: true });
globalStyle(`${rowDisabled}:hover`, {
  backgroundColor: 'transparent',
});
globalStyle(`${rowDisabled} td`, {
  backgroundColor: themeVars.palette.white,
});
globalStyle(`${rowDisabled}:hover td`, {
  backgroundColor: themeVars.palette.white,
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
