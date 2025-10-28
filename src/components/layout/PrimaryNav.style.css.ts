import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const navContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '240px',
  background: themeVars.palette.cgrey700,
  color: themeVars.palette.white,
  padding: '20px 16px',
  transition: 'width 0.2s ease-in-out',
  overflow: 'hidden',

  '@media': {
    '(min-width: 960px) and (max-width: 1280px)': {
      width: '72px',
      padding: '20px',
    },
    '(max-width: 959px)': {
      display: 'none',
    },
  },
});

export const logoPlaceholder = style({
  height: '40px',
  background: themeVars.palette.cgrey500,
  marginBottom: '20px',
});

const navLinkBase = style([
  typography.bodySB, // typo.css.ts에서 가져온 클래스
  {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: themeVars.radius.md,
    textDecoration: 'none',
    color: themeVars.palette.cgrey300,
    background: 'transparent',

    ':hover': {
      background: themeVars.palette.cgrey600,
    },

    '@media': {
      '(min-width: 960px) and (max-width: 1280px)': {
        justifyContent: 'center',
      },
    },
  },
]);

export const navLink = styleVariants({
  active: [
    navLinkBase,
    {
      color: themeVars.palette.white,
      background: themeVars.palette.blue600,
    },
  ],
  inactive: [navLinkBase],
});

export const navLinkText = style({
  whiteSpace: 'nowrap',
  opacity: 1,
  transition: 'opacity 0.2s ease-in-out',

  '@media': {
    '(min-width: 960px) and (max-width: 1280px)': {
      opacity: 0,
      position: 'absolute',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
    },
  },
});

export const iconPlaceholder = style({
  width: '24px',
  height: '24px',
  background: themeVars.palette.cgrey300,
  borderRadius: '4px',
  flexShrink: 0, // 축소 시 찌그러지지 않도록
});

export const spacer = style({
  flexGrow: 1,
});

export const profilePlaceholder = style({
  height: '40px',
  background: themeVars.palette.cgrey500,
});
