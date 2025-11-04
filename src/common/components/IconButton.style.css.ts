import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { themeVars } from '@/design/theme.css';

export const buttonBaseStyles = style({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid transparent',
  padding: 0,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textDecoration: 'none',
  flexShrink: 0,
  ':disabled': {
    cursor: 'not-allowed',
  },
  color: themeVars.palette.cgrey700,
});

export const iconButtonRecipe = recipe({
  base: {},
  variants: {
    styleType: {
      normal: {
        background: 'transparent',
      },
      solid: {
        borderRadius: '1000px',
        background: themeVars.palette.blue,
        color: themeVars.palette.white,
      },
      outlined: {
        borderRadius: '1000px',
        background: themeVars.palette.white,
        borderColor: themeVars.palette.cgrey200,
        color: themeVars.palette.cgrey700,
      },
      background: {
        background: themeVars.palette.cgrey50,
        borderRadius: '4px',
      },
    },
    size: {
      default: {},
      medium: {},
      small: {},
      micro: {},
    },
    disabled: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { styleType: 'normal', size: 'default' },
      style: { width: 24, height: 24, color: themeVars.palette.cgrey500 },
    },
    {
      variants: { styleType: 'normal', size: 'small' },
      style: { width: 20, height: 20, color: themeVars.palette.cgrey500 },
    },
    {
      variants: { styleType: 'normal', disabled: false },
      style: {
        ':hover': { background: themeVars.palette.cgrey50 },
      },
    },
    {
      variants: { styleType: 'normal', disabled: false },
      style: {
        ':active': { background: themeVars.palette.cgrey100 },
      },
    },
    {
      variants: { styleType: 'background', size: 'default' },
      style: { width: 24, height: 24, color: themeVars.palette.cgrey500 },
    },
    {
      variants: { styleType: 'background', size: 'small' },
      style: { width: 20, height: 20, color: themeVars.palette.cgrey500 },
    },
    {
      variants: { styleType: 'background', disabled: false },
      style: {
        ':hover': { background: themeVars.palette.cgrey100 },
      },
    },
    {
      variants: { styleType: 'background', disabled: false },
      style: {
        ':active': { background: themeVars.palette.cgrey200 },
      },
    },
    {
      variants: { styleType: 'solid', size: 'default' },
      style: { width: 40, height: 40, padding: 8 },
    },
    {
      variants: { styleType: 'solid', size: 'medium' },
      style: { width: 32, height: 32, padding: 4 },
    },
    {
      variants: { styleType: 'solid', size: 'small' },
      style: { width: 24, height: 24, padding: 4 },
    },
    {
      variants: { styleType: 'solid', size: 'micro' },
      style: { width: 16, height: 16, padding: 2 },
    },
    {
      variants: { styleType: 'solid', disabled: false },
      style: {
        ':hover': { background: themeVars.palette.blue600 },
      },
    },
    {
      variants: { styleType: 'solid', disabled: false },
      style: {
        ':active': {
          background: themeVars.palette.blue,
          boxShadow: 'inset 0 0 100px 100px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    {
      variants: { styleType: 'outlined', size: 'default' },
      style: { width: 40, height: 40, padding: 8 },
    },
    {
      variants: { styleType: 'outlined', size: 'medium' },
      style: { width: 32, height: 32, padding: 4 },
    },
    {
      variants: { styleType: 'outlined', size: 'small' },
      style: { width: 24, height: 24, padding: 4 },
    },
    {
      variants: { styleType: 'outlined', size: 'micro' },
      style: { width: 16, height: 16, padding: 2 },
    },
    {
      variants: { styleType: 'outlined', disabled: false },
      style: {
        ':hover': { background: themeVars.palette.cgrey50 },
      },
    },
    {
      variants: { styleType: 'outlined', disabled: false },
      style: {
        ':active': { background: themeVars.palette.cgrey100 },
      },
    },
    {
      variants: { styleType: 'normal', disabled: true },
      style: { color: themeVars.palette.cgrey300, background: 'transparent' },
    },
    {
      variants: { styleType: 'background', disabled: true },
      style: {
        color: themeVars.palette.cgrey300,
        background: themeVars.palette.cgrey50,
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
        background: themeVars.palette.white,
        color: themeVars.palette.cgrey300,
        borderColor: themeVars.palette.cgrey100,
      },
    },
  ],

  defaultVariants: {
    styleType: 'normal',
    size: 'default',
    disabled: false,
  },
});
