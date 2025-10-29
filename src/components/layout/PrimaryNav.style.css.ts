import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

const collapsedRange = '(min-width: 960px) and (max-width: 1279px)';

export const navContainer = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '256px',
  padding: `${themeVars.spacing.xxl} ${themeVars.spacing.lg}`,
  background: `linear-gradient(180deg, ${themeVars.palette.cgrey700} 0%, ${themeVars.palette.cgrey600} 100%)`,
  color: themeVars.palette.white,
  gap: themeVars.spacing.xl,
  borderRight: `1px solid ${themeVars.palette.cgrey600}`,
  transition: 'width 0.2s ease-in-out',
  height: '100vh',
  boxSizing: 'border-box',

  '@media': {
    [collapsedRange]: {
      width: '88px',
      padding: `${themeVars.spacing.xxl} ${themeVars.spacing.sm}`,
      alignItems: 'center',
    },
    '(max-width: 959px)': {
      display: 'none',
    },
  },
});

export const brandArea = style([
  typography.bodySB,
  {
    display: 'flex',
    alignItems: 'center',
    gap: themeVars.spacing.sm,
    color: 'inherit',
    textDecoration: 'none',
    letterSpacing: '-0.01em',
    padding: `0 ${themeVars.spacing.xs}`,

    ':focus-visible': {
      outline: `2px solid ${themeVars.palette.blue400}`,
      outlineOffset: '4px',
    },

    '@media': {
      [collapsedRange]: {
        flexDirection: 'column',
        gap: themeVars.spacing.xs,
        padding: 0,
      },
    },
  },
]);

export const brandMark = style([
  typography.bodySB,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: themeVars.radius.md,
    background: themeVars.palette.blue600,
    fontWeight: 700,
    letterSpacing: '0.08em',
  },
]);

export const brandLabel = style([
  typography.bodySB,
  {
    color: themeVars.palette.white,
    whiteSpace: 'nowrap',

    '@media': {
      [collapsedRange]: {
        display: 'none',
      },
    },
  },
]);

export const navList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
  flex: 1,
  width: '100%',
});

export const navListItem = style({
  width: '100%',
});

const navLinkBase = style([
  typography.bodySB,
  {
    display: 'flex',
    alignItems: 'center',
    gap: themeVars.spacing.sm,
    padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
    borderRadius: themeVars.radius.md,
    textDecoration: 'none',
    color: themeVars.palette.cgrey100,
    transition: 'background 0.2s ease, color 0.2s ease',

    ':hover': {
      background: 'rgba(255,255,255,0.08)',
    },

    ':focus-visible': {
      outline: `2px solid ${themeVars.palette.blue400}`,
      outlineOffset: '4px',
    },

    '@media': {
      [collapsedRange]: {
        justifyContent: 'center',
        padding: `${themeVars.spacing.sm} ${themeVars.spacing.xs}`,
      },
    },
  },
]);

export const navLink = styleVariants({
  active: [
    navLinkBase,
    {
      color: themeVars.palette.white,
      background: 'rgba(255,255,255,0.14)',
    },
  ],
  inactive: [navLinkBase],
});

export const navIcon = style({
  width: '28px',
  height: '28px',
  borderRadius: themeVars.radius.sm,
  background: 'rgba(255,255,255,0.24)',
  flexShrink: 0,
});

export const navLabel = style({
  whiteSpace: 'nowrap',
  transition: 'opacity 0.2s ease',

  '@media': {
    [collapsedRange]: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    },
  },
});

export const navFooter = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
  marginTop: 'auto',
  width: '100%',
});

export const profileCard = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.sm,
  padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
  borderRadius: themeVars.radius.md,
  background: 'rgba(255,255,255,0.06)',

  '@media': {
    [collapsedRange]: {
      flexDirection: 'column',
      padding: themeVars.spacing.sm,
    },
  },
});

export const profileAvatar = style({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: themeVars.palette.blue400,
  flexShrink: 0,
});

export const profileMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  color: themeVars.palette.white,

  '@media': {
    [collapsedRange]: {
      display: 'none',
    },
  },
});

export const profileName = style([
  typography.bodySB,
  {
    lineHeight: 1.2,
  },
]);

export const profileRole = style([
  typography.bodyM,
  {
    lineHeight: 1.2,
    color: 'rgba(255,255,255,0.72)',
  },
]);
