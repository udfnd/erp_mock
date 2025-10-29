import { keyframes, style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const page = style({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: themeVars.palette.cgrey10,
  padding: themeVars.spacing.xxl,
});

export const card = style({
  width: '100%',
  maxWidth: 440,
  background: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  boxShadow: themeVars.shadow.md,
  padding: `${themeVars.spacing.xxl} ${themeVars.spacing.xxl}`,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xxl,
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

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xl,
});

export const buttonWrapper = style({ display: 'flex', justifyContent: 'flex-end' });

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const spinner = style({
  animation: `${spin} 1s linear infinite`,
  fontSize: 18,
});
