import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

const collapsedRange = '(min-width: 960px) and (max-width: 1279px)';

const navContainerBase = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '200px',
  padding: '10px 12px 24px',
  background: themeVars.palette.cgrey10,
  borderRight: `1px solid ${themeVars.palette.cgrey100}`,
  color: themeVars.palette.black,
  gap: themeVars.spacing.xl,
  transition: 'width 0.2s ease-in-out, padding 0.2s ease-in-out',
  height: '100vh',
  boxSizing: 'border-box',
  '@media': {
    [collapsedRange]: {
      width: '40px',
      padding: '8px',
      alignItems: 'center',
    },
    '(max-width: 959px)': {
      display: 'none',
    },
  },
});

export const navContainerOpen = style([navContainerBase]);

export const navContainerClosed = style([
  navContainerBase,
  {
    width: '40px',
    padding: '8px',
    alignItems: 'center',
    overflow: 'hidden',
  },
]);

export const toggleBar = style({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
});

export const toggleButton = style({
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  lineHeight: 0,
  cursor: 'pointer',
  ':focus-visible': {
    outline: `2px solid ${themeVars.palette.blue400}`,
    outlineOffset: '2px',
  },
});

export const icon = style({
  width: '24px',
  height: '24px',
});

const navListBase = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
  flex: 1,
  width: '100%',
});

export const navList = styleVariants({
  show: [navListBase],
  hide: [navListBase, { display: 'none' }],
});

export const navChildList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
  width: '100%',
});

export const navListItem = style({
  width: '100%',
});

const navLinkBase = style([
  typography.captionR,
  {
    display: 'flex',
    alignItems: 'center',
    gap: themeVars.spacing.sm,
    padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
    borderRadius: themeVars.radius.md,
    textDecoration: 'none',
    color: themeVars.palette.black,
    transition: 'background 0.2s ease, color 0.2s ease',
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

export const navLinkDepth = styleVariants({
  1: {},
  2: { paddingLeft: '20px' },
  3: { paddingLeft: '32px' },
});

export const navLink = styleVariants({
  active: [
    navLinkBase,
    {
      color: themeVars.palette.blue600,
      background: themeVars.palette.blue200,
      borderRadius: '8px',
      ':hover': {
        background: themeVars.palette.blue200,
      },
    },
  ],
  inactive: [
    navLinkBase,
    {
      ':hover': {
        background: themeVars.palette.cgrey50,
      },
    },
  ],
});

export const navIcon = style({
  width: '16px',
  height: '16px',
  borderRadius: '100px',
  background: themeVars.palette.cgrey200,
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

export const navLabelWeight = styleVariants({
  active: [typography.captionB],
  inactive: [typography.captionR],
});

const navFooterBase = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
  marginTop: 'auto',
  width: '100%',
});

export const navFooter = styleVariants({
  show: [navFooterBase],
  hide: [navFooterBase, { display: 'none' }],
});

export const footerVersion = style({
  marginTop: themeVars.spacing.md,
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
});

export const footerBrand = style([typography.captionR, { color: themeVars.palette.blue600 }]);

export const footerVerText = style([typography.captionR, { color: themeVars.palette.cgrey600 }]);
