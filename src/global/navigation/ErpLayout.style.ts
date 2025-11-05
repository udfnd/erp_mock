import { css, cx } from '@emotion/css';

import { color } from '@/style/color';
import { spacing } from '@/style/primitive';

export const container = css({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  background: color.white,
  overflow: 'hidden',
});

export const mainWrapper = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: color.white,
});

export const header = css({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  position: 'relative',
  zIndex: 1,
});

const secondaryWrapperBase = css({
  overflow: 'hidden',
  transition: 'max-height 0.2s ease, opacity 0.2s ease',
  willChange: 'max-height, opacity',
});

export const secondaryNavWrapper = {
  visible: cx(
    secondaryWrapperBase,
    css({
      maxHeight: '72px',
      opacity: 1,
    }),
  ),
  hidden: cx(
    secondaryWrapperBase,
    css({
      maxHeight: 0,
      opacity: 0,
      pointerEvents: 'none',
    }),
  ),
};

const tertiaryWrapperBase = css({
  overflow: 'hidden',
  transition: 'max-height 0.2s ease, opacity 0.2s ease',
  willChange: 'max-height, opacity',
});

export const tertiaryNavWrapper = {
  visible: cx(
    tertiaryWrapperBase,
    css({
      maxHeight: '64px',
      opacity: 1,
    }),
  ),
  hidden: cx(
    tertiaryWrapperBase,
    css({
      maxHeight: 0,
      opacity: 0,
      pointerEvents: 'none',
    }),
  ),
};

export const content = css({
  flex: 1,
  overflowY: 'auto',
  padding: `${spacing.base} ${spacing.base}`,
  scrollBehavior: 'smooth',
  '@media (max-width: 959px)': {
    padding: `${spacing.base} ${spacing.base}`,
  },
});

export const contentInner = css({
  margin: '0 auto',
  width: '100%',
  maxWidth: '1200px',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xxl,
});
