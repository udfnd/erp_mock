// Textfield.style.css.ts
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: themeVars.spacing.sm,
  width: '343px',
});

export const labelWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: themeVars.spacing.xs,
  width: '100%',
});

export const label = style([typography.bodySmallM, { color: themeVars.palette.cgrey700 }]);

export const requiredAsterisk = style([typography.bodySmallM, { color: themeVars.palette.red }]);

export const inputWrapperRecipe = recipe({
  base: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    padding: `${themeVars.spacing.md} ${themeVars.spacing.base}`,
    width: '100%',
    background: themeVars.palette.white,
    borderRadius: themeVars.radius.md,
    borderWidth: '1px',
    borderStyle: 'solid',
    transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
  },
  variants: {
    status: {
      normal: {
        borderColor: themeVars.palette.cgrey200,
        ':focus-within': {
          borderColor: themeVars.palette.blue,
          boxShadow: `0 0 0 1px ${themeVars.palette.blue}`,
        },
      },
      negative: {
        borderColor: themeVars.palette.red,
        ':focus-within': {
          borderColor: themeVars.palette.red,
          boxShadow: `0 0 0 1px ${themeVars.palette.red}`,
        },
      },
    },
    disabled: {
      true: {
        background: themeVars.palette.cgrey100,
        borderColor: themeVars.palette.cgrey100,
      },
      false: {},
    },
  },
  defaultVariants: {
    status: 'normal',
    disabled: false,
  },
});

export const textareaRecipe = recipe({
  base: [
    typography.bodyR,
    {
      width: '100%',
      border: 'none',
      outline: 'none',
      padding: 0,
      background: 'transparent',
      resize: 'none',
      color: themeVars.palette.black,
      selectors: {
        '&::placeholder': { color: themeVars.palette.cgrey300 },
        '&:disabled': { color: themeVars.palette.cgrey400 },
        '&:disabled::placeholder': { color: themeVars.palette.cgrey300 },
      },
    },
  ],
  variants: {
    resize: {
      normal: { height: 'auto', minHeight: 24 },
      limit: {
        height: 134,
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: `${themeVars.palette.cgrey200} ${themeVars.palette.white}`,
        selectors: {
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { background: themeVars.palette.white },
          '&::-webkit-scrollbar-thumb': {
            background: themeVars.palette.cgrey200,
            borderRadius: 2,
          },
        },
      },
    },
  },
  defaultVariants: { resize: 'normal' },
});

export const inputRecipe = recipe({
  base: [
    typography.bodyR,
    {
      width: '100%',
      border: 'none',
      outline: 'none',
      padding: 0,
      background: 'transparent',
      color: themeVars.palette.black,
      selectors: {
        '&::placeholder': { color: themeVars.palette.cgrey300 },
        '&:disabled': { color: themeVars.palette.cgrey400 },
        '&:disabled::placeholder': { color: themeVars.palette.cgrey300 },
      },
    },
  ],
});

export const footer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 0,
  gap: themeVars.spacing.sm,
  width: '100%',
});

export const counter = style([
  typography.captionR,
  { color: themeVars.palette.cgrey300, flexGrow: 1 },
]);

export const actionButtonStyle = style([
  typography.captionB,
  {
    color: themeVars.palette.cgrey300,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '3px 0px',
  },
]);

export const helperTextRecipe = recipe({
  base: [typography.captionR, { alignSelf: 'stretch' }],
  variants: {
    status: {
      normal: { color: themeVars.palette.cgrey400 },
      negative: { color: themeVars.palette.red },
    },
  },
  defaultVariants: { status: 'normal' },
});
