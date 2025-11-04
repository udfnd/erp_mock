import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { themeVars } from '@/design/theme.css';

export const toggleContainer = style({
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: '9999px',
  position: 'relative',
  transition: 'background-color 0.2s ease, opacity 0.2s ease',
  boxSizing: 'border-box',
  padding: '2px',
  border: 'none',
});

export const toggleHandle = style({
  display: 'block',
  backgroundColor: themeVars.palette.white,
  borderRadius: '50%',
  position: 'absolute',
  top: '2px',
  left: '2px',
  transition: 'transform 0.2s ease',
  boxShadow: themeVars.shadow.sm,
});

export const toggleRecipe = recipe({
  base: toggleContainer,
  variants: {
    size: {
      sm: {
        width: 40,
        height: 24,
      },
      md: {
        width: 52,
        height: 32,
      },
    },
    active: {
      true: {
        backgroundColor: themeVars.palette.blue,
      },
      false: {
        backgroundColor: themeVars.palette.cgrey200,
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    active: false,
    disabled: false,
  },
});

export const handleRecipe = recipe({
  base: toggleHandle,
  variants: {
    size: {
      sm: {
        width: 20,
        height: 20,
      },
      md: {
        width: 28,
        height: 28,
      },
    },
    active: {
      true: {},
      false: {
        transform: 'translateX(0)',
      },
    },
  },
  compoundVariants: [
    {
      variants: { size: 'sm', active: true },
      style: { transform: `translateX(${40 - 20 - 2 * 2}px)` },
    },
    {
      variants: { size: 'md', active: true },
      style: { transform: `translateX(${52 - 28 - 2 * 2}px)` },
    },
  ],
  defaultVariants: {
    size: 'md',
    active: false,
  },
});
