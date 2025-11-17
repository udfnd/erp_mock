import { css, type Interpolation, type Theme } from '@emotion/react';

import { color } from '@/style/color';
import { spacing, radius } from '@/style/primitive';
import { typography } from '@/style/typo';

type IT = Interpolation<Theme>;

const collapsedRange = '(min-width: 960px) and (max-width: 1279px)';

const navContainerBase = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '200px',
  maxWidth: '200px',
  minWidth: '40px',
  padding: '10px 12px 24px',
  background: color.cgrey10,
  borderRight: `1px solid ${color.cgrey100}`,
  color: color.black,
  gap: spacing.xl,
  height: '100vh',
  boxSizing: 'border-box',
  flexShrink: 0,
  transition: 'max-width 0.2s ease-in-out, padding 0.2s ease-in-out',
  '@media (max-width: 959px)': {
    display: 'none',
  },
});

export const navContainerOpen: IT[] = [
  navContainerBase,
  css({
    maxWidth: '200px',
    padding: '10px 12px 24px',
    alignItems: 'initial',
    overflow: 'visible',
    [`@media ${collapsedRange}`]: {
      maxWidth: '200px',
      padding: '10px 12px 24px',
      alignItems: 'initial',
      overflow: 'visible',
    },
  }),
];

export const navContainerClosed: IT[] = [
  navContainerBase,
  css({
    maxWidth: '40px',
    padding: '8px',
    alignItems: 'center',
    overflow: 'hidden',
    [`@media ${collapsedRange}`]: {
      maxWidth: '40px',
      padding: '8px',
      alignItems: 'center',
      overflow: 'hidden',
    },
  }),
];

export const toggleBar = css({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
});

export const toggleButton = css({
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  lineHeight: 0,
  cursor: 'pointer',
  '&:focus-visible': {
    outline: `2px solid ${color.blue400}`,
    outlineOffset: '2px',
  },
});

export const icon = css({
  width: '24px',
  height: '24px',
});

const navListBase = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
  flex: 1,
  width: '100%',
});

export const navList: Record<'show' | 'hide', IT[]> = {
  show: [navListBase],
  hide: [navListBase, css({ display: 'none' })],
};

export const navChildList = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
  width: '100%',
});

export const navListItem = css({
  width: '100%',
});

const navLinkBase = css({
  ...typography.captionR,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  padding: `${spacing.sm} ${spacing.base}`,
  borderRadius: radius.md,
  textDecoration: 'none',
  color: color.black,
  transition: 'background 0.2s ease, color 0.2s ease',
  '&:focus-visible': {
    outline: `2px solid ${color.blue400}`,
    outlineOffset: '4px',
  },
});

export const navLinkDepth = {
  1: css({}),
  2: css({ paddingLeft: '20px' }),
  3: css({ paddingLeft: '32px' }),
} as const;

export const navLink: Record<'active' | 'inactive', IT[]> = {
  active: [
    navLinkBase,
    css({
      color: color.blue600,
      background: color.blue200,
      borderRadius: '8px',
      '&:hover': {
        background: color.blue200,
      },
    }),
  ],
  inactive: [
    navLinkBase,
    css({
      '&:hover': {
        background: color.cgrey50,
      },
    }),
  ],
};

export const navIcon = css({
  width: '16px',
  height: '16px',
  borderRadius: '100px',
  background: color.cgrey200,
  flexShrink: 0,
});

export const navLabel = css({
  whiteSpace: 'nowrap',
  transition: 'opacity 0.2s ease',
  [`@media ${collapsedRange}`]: {
    ['aside[data-open="false"] &']: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      border: 0,
    },
  },
});

export const navLabelWeight = {
  active: css({ ...typography.captionB }),
  inactive: css({ ...typography.captionR }),
};

const navFooterBase = css({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
  marginTop: 'auto',
  width: '100%',
});

export const navFooter: Record<'show' | 'hide', IT[]> = {
  show: [navFooterBase],
  hide: [navFooterBase, css({ display: 'none' })],
};

export const footerVersion = css({
  marginTop: spacing.md,
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
});

export const footerBrand = css({
  ...typography.captionR,
  color: color.blue600,
});

export const footerVerText = css({
  ...typography.captionR,
  color: color.cgrey600,
});

export const footerProfileSection = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing.sm,
  position: 'relative',
});

export const footerVersionGroup = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
});

export const profileTriggerButton = css({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: `1px solid ${color.cgrey200}`,
  padding: 0,
  overflow: 'hidden',
  backgroundColor: color.white,
  cursor: 'pointer',
  flexShrink: 0,
  '&:focus-visible': {
    outline: `2px solid ${color.blue400}`,
    outlineOffset: '2px',
  },
});

export const profileTriggerImage = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});
