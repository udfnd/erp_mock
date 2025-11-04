import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const filterBaseStyles = style([
  typography.bodyM,
  {
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    isolation: 'isolate',
    flexGrow: 0,
    flexShrink: 0,
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    ':disabled': {
      cursor: 'not-allowed',
    },
  },
]);

export const filterRecipe = recipe({
  base: {},
  variants: {
    styleType: {
      solid: {},
      outlined: {},
    },
    size: {
      large: {
        height: 36,
        padding: '6px 12px',
        gap: 4,
        borderRadius: 10,
      },
      medium: {
        height: 35,
        padding: '6px 10px',
        gap: 4,
        borderRadius: 8,
      },
      small: {
        height: 30,
        padding: '3px 8px',
        gap: 4,
        borderRadius: 6,
      },
    },
    active: {
      true: {},
      false: {},
    },
    disabled: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        styleType: 'solid',
        active: false,
        disabled: false,
      },
      style: {
        background: themeVars.palette.cgrey100,
        color: themeVars.palette.cgrey700,
        ':hover': {
          background: themeVars.palette.cgrey200,
        },
        ':active': {
          background: themeVars.palette.cgrey300,
        },
      },
    },
    {
      variants: {
        styleType: 'solid',
        active: true,
        disabled: false,
      },
      style: {
        background: themeVars.palette.cgrey700,
        color: themeVars.palette.white,
        ':hover': {
          background: themeVars.palette.cgrey600,
        },
        ':active': {
          background: themeVars.palette.black,
        },
      },
    },
    {
      variants: {
        styleType: 'outlined',
        active: false,
        disabled: false,
      },
      style: {
        background: themeVars.palette.white,
        color: themeVars.palette.cgrey700,
        borderColor: themeVars.palette.cgrey200,
        ':hover': {
          background: themeVars.palette.cgrey50,
        },
        ':active': {
          background: themeVars.palette.cgrey100,
        },
      },
    },
    {
      variants: {
        styleType: 'outlined',
        active: true,
        disabled: false,
      },
      style: {
        background: themeVars.palette.blue50,
        color: themeVars.palette.blue,
        borderColor: themeVars.palette.blue,
        ':hover': {
          background: themeVars.palette.blue100,
        },
        ':active': {
          background: themeVars.palette.blue200,
        },
      },
    },
    {
      variants: {
        styleType: 'solid',
        disabled: true,
      },
      style: {
        background: themeVars.palette.cgrey100,
        color: themeVars.palette.cgrey300,
      },
    },
    {
      variants: {
        styleType: 'outlined',
        disabled: true,
      },
      style: {
        background: themeVars.palette.white,
        color: themeVars.palette.cgrey300,
        borderColor: themeVars.palette.cgrey100,
      },
    },
  ],
  defaultVariants: {
    styleType: 'solid',
    size: 'medium',
    active: false,
    disabled: false,
  },
});

export const iconWrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
