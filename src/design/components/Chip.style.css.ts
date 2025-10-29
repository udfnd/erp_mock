import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const chipBaseStyles = style({
  boxSizing: 'border-box',
  display: 'inline-flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px',
  isolation: 'isolate',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  border: '1px solid transparent',
  selectors: {
    '&:disabled': { cursor: 'not-allowed' },
  },
});

const solidGradient =
  'linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), linear-gradient(0deg, rgba(0, 0, 0, 0.53), rgba(0, 0, 0, 0.53)), #0A3FFF';

export const chipRecipe = recipe({
  base: {},
  variants: {
    size: {
      lg: [typography.bodyB, { height: '36px', padding: '6px 12px', borderRadius: '10px' }],
      md: [
        typography.bodySmallSB,
        { height: '32px', padding: '6px 10px 5px', borderRadius: '8px' },
      ],
      sm: [typography.captionB, { height: '24px', padding: '3px 8px', borderRadius: '6px' }],
    },
    variant: {
      solid: {},
      outlined: { background: 'transparent' },
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
      variants: { variant: 'solid', active: false, disabled: false },
      style: {
        background: solidGradient,
        color: themeVars.palette.white,
        ':hover': { background: themeVars.palette.blue600 },
        ':active': { background: themeVars.palette.blue600 },
      },
    },
    {
      variants: { variant: 'solid', active: true, disabled: false },
      style: {
        background: themeVars.palette.black,
        color: themeVars.palette.white,
        ':hover': { background: themeVars.palette.black },
        ':active': { background: themeVars.palette.black },
      },
    },
    {
      variants: { variant: 'outlined', active: false, disabled: false },
      style: {
        background: 'transparent',
        color: themeVars.palette.cgrey500,
        borderColor: themeVars.palette.cgrey200,
        ':hover': { background: themeVars.palette.cgrey50 },
        ':active': { background: themeVars.palette.cgrey100 },
      },
    },
    {
      variants: { variant: 'outlined', active: true, disabled: false },
      style: {
        background: 'transparent',
        color: themeVars.palette.blue,
        borderColor: themeVars.palette.blue,
        ':hover': { background: 'transparent' },
        ':active': { background: 'transparent' },
      },
    },
    {
      variants: { variant: 'solid', disabled: true },
      style: {
        background: themeVars.palette.cgrey100,
        color: themeVars.palette.cgrey300,
        borderColor: 'transparent',
      },
    },
    {
      variants: { variant: 'outlined', disabled: true },
      style: {
        background: 'transparent',
        color: themeVars.palette.cgrey300,
        borderColor: themeVars.palette.cgrey100,
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    variant: 'solid',
    active: false,
    disabled: false,
  },
});

export const chipIconWrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
