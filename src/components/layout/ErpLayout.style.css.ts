import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';

export const container = style({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  background: themeVars.palette.cgrey10,
  overflow: 'hidden',
});

export const mainWrapper = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const header = style({
  flexShrink: 0,
});

const navWrapperBase = style({
  overflow: 'hidden',
  transition: 'height 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
  willChange: 'height, opacity, transform',
});

export const secondaryNavWrapper = styleVariants({
  visible: [
    navWrapperBase,
    {
      height: '56px',
      opacity: 1,
      transform: 'translateY(0)',
      pointerEvents: 'auto',
    },
  ],
  hidden: [
    navWrapperBase,
    {
      height: 0,
      opacity: 0,
      transform: 'translateY(-100%)',
      pointerEvents: 'none',
    },
  ],
});

export const tertiaryNavWrapper = styleVariants({
  visible: [
    navWrapperBase,
    {
      height: '48px',
      opacity: 1,
      transform: 'translateY(0)',
      pointerEvents: 'auto',
    },
  ],
  hidden: [
    navWrapperBase,
    {
      height: 0,
      opacity: 0,
      transform: 'translateY(-100%)',
      pointerEvents: 'none',
    },
  ],
});

export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: '24px 32px',

  '@media': {
    '(max-width: 959px)': {
      padding: '16px',
    },
  },
});
