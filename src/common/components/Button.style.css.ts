import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const buttonBaseStyles = style([
  typography.bodyB,
  {
    border: '1px solid transparent',
    borderRadius: '8px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    ':disabled': {
      cursor: 'not-allowed',
    },
  },
]);

export const buttonRecipe = recipe({
  base: {},
  variants: {
    styleType: {
      solid: {},
      outlined: {
        background: 'transparent',
      },
      text: {
        background: 'transparent',
      },
    },
    variant: {
      primary: {},
      secondary: {},
      assistive: {},
    },
    size: {
      large: {
        height: '48px',
        paddingLeft: '24px',
        paddingRight: '24px',
        gap: '8px',
      },
      medium: {
        height: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        gap: '8px',
      },
      small: {
        height: '32px',
        paddingLeft: '12px',
        paddingRight: '12px',
        gap: '4px',
      },
    },
    iconOnly: {
      true: {
        paddingLeft: 0,
        paddingRight: 0,
        aspectRatio: '1 / 1',
      },
    },
    disabled: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      variants: { styleType: 'solid', variant: 'primary', disabled: false },
      style: {
        background: themeVars.palette.blue,
        color: themeVars.palette.white,
        ':hover': { background: themeVars.palette.blue600 },
        ':active': {
          background: themeVars.palette.blue,
          boxShadow: 'inset 0 0 100px 100px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    {
      variants: { styleType: 'solid', variant: 'secondary', disabled: false },
      style: {
        background: themeVars.palette.blue100,
        color: themeVars.palette.blue,
        ':hover': { background: themeVars.palette.blue200 },
        ':active': {
          background: themeVars.palette.blue100,
          boxShadow: 'inset 0 0 100px 100px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    {
      variants: { styleType: 'solid', variant: 'assistive', disabled: false },
      style: {
        background: themeVars.palette.cgrey50,
        color: themeVars.palette.cgrey500,
        ':hover': { background: themeVars.palette.cgrey100 },
        ':active': {
          background: themeVars.palette.cgrey50,
          boxShadow: 'inset 0 0 100px 100px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    {
      variants: { styleType: 'outlined', variant: 'primary', disabled: false },
      style: {
        color: themeVars.palette.blue,
        borderColor: themeVars.palette.blue,
        ':hover': { background: themeVars.palette.blue50 },
        ':active': { background: themeVars.palette.blue100 },
      },
    },
    {
      variants: { styleType: 'outlined', variant: 'secondary', disabled: false },
      style: {
        color: themeVars.palette.cgrey500,
        borderColor: themeVars.palette.cgrey200,
        ':hover': { background: themeVars.palette.cgrey50 },
        ':active': { background: themeVars.palette.cgrey100 },
      },
    },
    {
      variants: { styleType: 'outlined', variant: 'assistive', disabled: false },
      style: {
        color: themeVars.palette.cgrey500,
        borderColor: themeVars.palette.cgrey200,
        ':hover': { background: themeVars.palette.cgrey50 },
        ':active': { background: themeVars.palette.cgrey100 },
      },
    },
    {
      variants: { styleType: 'text', variant: 'primary', disabled: false },
      style: {
        color: themeVars.palette.blue,
        ':hover': { background: themeVars.palette.blue50 },
        ':active': { background: themeVars.palette.blue100 },
      },
    },
    {
      variants: { styleType: 'text', variant: 'secondary', disabled: false },
      style: {
        color: themeVars.palette.cgrey500,
        ':hover': { background: themeVars.palette.cgrey50 },
        ':active': { background: themeVars.palette.cgrey100 },
      },
    },
    {
      variants: { styleType: 'text', variant: 'assistive', disabled: false },
      style: {
        color: themeVars.palette.cgrey500,
        ':hover': { background: themeVars.palette.cgrey50 },
        ':active': { background: themeVars.palette.cgrey100 },
      },
    },
    {
      variants: { styleType: 'solid', disabled: true },
      style: {
        background: themeVars.palette.cgrey100,
        color: themeVars.palette.cgrey300,
      },
    },
    {
      variants: { styleType: 'outlined', disabled: true },
      style: {
        color: themeVars.palette.cgrey300,
        borderColor: themeVars.palette.cgrey100,
      },
    },
    {
      variants: { styleType: 'text', disabled: true },
      style: {
        color: themeVars.palette.cgrey300,
      },
    },
    {
      variants: { iconOnly: true, size: 'large' },
      style: { width: '48px' },
    },
    {
      variants: { iconOnly: true, size: 'medium' },
      style: { width: '40px' },
    },
    {
      variants: { iconOnly: true, size: 'small' },
      style: { width: '32px' },
    },
  ],

  defaultVariants: {
    styleType: 'solid',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    iconOnly: false,
  },
});

export const iconWrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
