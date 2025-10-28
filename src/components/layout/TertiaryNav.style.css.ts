import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const navContainer = style({
  display: 'flex',
  gap: '20px',
  padding: '0 32px',
  background: themeVars.palette.white,
  boxShadow: themeVars.shadow.sm,
  height: '48px',
  alignItems: 'center',

  '@media': {
    '(max-width: 959px)': {
      padding: '0 16px',
      overflowX: 'auto',
    },
  },
});

const navLinkBase = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  textDecoration: 'none',
  whiteSpace: 'nowrap',

  ':hover': {
    color: themeVars.palette.cgrey700,
  },

  '::after': {
    content: '""',
    display: 'none',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: themeVars.palette.blue,
  },
});

export const navLink = styleVariants({
  active: [
    navLinkBase,
    typography.bodySB, // 활성: bodySB
    {
      color: themeVars.palette.cgrey700,
      '::after': {
        display: 'block', // 활성 시 밑줄 표시
      },
    },
  ],
  inactive: [
    navLinkBase,
    typography.bodyM, // 비활성: bodyM
    {
      color: themeVars.palette.cgrey400,
    },
  ],
});
