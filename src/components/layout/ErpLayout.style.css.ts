import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';

export const container = style({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  background: themeVars.palette.cgrey25,
  overflow: 'hidden',
});

export const mainWrapper = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: themeVars.palette.cgrey25,
});

export const header = style({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  position: 'relative',
  zIndex: 1,
});

const secondaryWrapperBase = style({
  overflow: 'hidden',
  transition: 'max-height 0.2s ease, opacity 0.2s ease',
  willChange: 'max-height, opacity',
});

export const secondaryNavWrapper = styleVariants({
  visible: [secondaryWrapperBase, { maxHeight: '72px', opacity: 1 }],
  hidden: [secondaryWrapperBase, { maxHeight: 0, opacity: 0, pointerEvents: 'none' }],
});

const tertiaryWrapperBase = style({
  overflow: 'hidden',
  transition: 'max-height 0.2s ease, opacity 0.2s ease',
  willChange: 'max-height, opacity',
});

export const tertiaryNavWrapper = styleVariants({
  visible: [tertiaryWrapperBase, { maxHeight: '64px', opacity: 1 }],
  hidden: [tertiaryWrapperBase, { maxHeight: 0, opacity: 0, pointerEvents: 'none' }],
});

export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: `${themeVars.spacing.xxl} ${themeVars.spacing.xxl}`,
  scrollBehavior: 'smooth',

  '@media': {
    '(max-width: 959px)': {
      padding: `${themeVars.spacing.base} ${themeVars.spacing.base}`,
    },
  },
});

export const contentInner = style({
  margin: '0 auto',
  width: '100%',
  maxWidth: '1200px',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xxl,
});
