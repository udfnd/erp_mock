import { keyframes, style } from '@vanilla-extract/css';

import { themeVars, typography } from '@/design';

export const page = style({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: themeVars.palette.cgrey50,
  padding: themeVars.spacing.xxl,
});

export const card = style({
  width: 480,
  maxWidth: '100%',
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  boxShadow: '0 12px 32px rgba(16, 24, 40, 0.12)',
  padding: themeVars.spacing.xxl,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xl,
});

export const heading = style([typography.titleSmallB, { color: themeVars.palette.black }]);

export const description = style([
  typography.bodyLargeM,
  {
    color: themeVars.palette.cgrey500,
    lineHeight: '28px',
  },
]);

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.lg,
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const helper = style([typography.captionR, { color: themeVars.palette.cgrey400 }]);

export const error = style([
  typography.captionB,
  {
    color: themeVars.palette.red,
  },
]);

export const actions = style({
  display: 'flex',
  gap: themeVars.spacing.md,
  justifyContent: 'flex-end',
});

export const spinner = style({
  width: 20,
  height: 20,
});

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const spinning = style({
  animation: `${spin} 0.8s linear infinite`,
});

export const button = style({
  minWidth: 120,
});
