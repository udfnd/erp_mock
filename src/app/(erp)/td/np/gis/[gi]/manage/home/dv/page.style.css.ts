import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xxl,
  padding: themeVars.spacing.xxl,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const title = style([
  typography.titleSmallB,
  { color: themeVars.palette.black },
]);

export const subtitle = style([
  typography.bodyR,
  { color: themeVars.palette.cgrey500 },
]);

export const hero = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.base,
  padding: `${themeVars.spacing.xxl} ${themeVars.spacing.xxl}`,
  borderRadius: themeVars.radius.lg,
  background: themeVars.palette.blue50,
});

export const heroIcon = style({
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: themeVars.palette.blue200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeVars.palette.white,
  fontSize: 28,
});

export const heroContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const heroTitle = style([
  typography.bodyLargeB,
  { color: themeVars.palette.blue600 },
]);

export const heroDescription = style([
  typography.bodyR,
  { color: themeVars.palette.blue600 },
]);
