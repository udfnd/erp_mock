import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const navContainer = style({
  display: 'flex',
  gap: '8px',
  padding: '0 32px',
  background: themeVars.palette.white,
  borderBottom: `1px solid ${themeVars.palette.cgrey100}`,
  height: '56px',
  alignItems: 'center',

  '@media': {
    '(max-width: 959px)': {
      padding: '0 16px',
      overflowX: 'auto',
    },
  },
});

const navLinkBase = style([
  typography.bodySB,
  {
    padding: '8px 12px',
    borderRadius: themeVars.radius.sm,
    textDecoration: 'none',
    whiteSpace: 'nowrap',

    ':hover': {
      background: themeVars.palette.cgrey50,
    },
  },
]);

export const navLink = styleVariants({
  active: [
    navLinkBase,
    {
      color: themeVars.palette.blue,
      background: themeVars.palette.blue50,
    },
  ],
  inactive: [
    navLinkBase,
    {
      color: themeVars.palette.cgrey500,
      background: 'transparent',
    },
  ],
});
