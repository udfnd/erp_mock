import { keyframes, style, styleVariants } from '@vanilla-extract/css';

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
  width: 520,
  maxWidth: '100%',
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  boxShadow: '0 12px 32px rgba(16, 24, 40, 0.12)',
  padding: themeVars.spacing.xxl,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xl,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const pageTitle = style([typography.titleSmallB, { color: themeVars.palette.black }]);

export const orgName = style([typography.bodyLargeB, { color: themeVars.palette.blue }]);

export const subtitle = style([
  typography.bodyLargeM,
  {
    color: themeVars.palette.cgrey500,
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
  gap: themeVars.spacing.xs,
});

export const label = style([typography.bodySmallSB, { color: themeVars.palette.cgrey600 }]);

const baseInput = style({
  width: '100%',
  padding: `${themeVars.spacing.md} ${themeVars.spacing.base}`,
  borderRadius: themeVars.radius.md,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  backgroundColor: themeVars.palette.white,
  color: themeVars.palette.black,
  ...typography.bodyR,
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  selectors: {
    '&::placeholder': {
      color: themeVars.palette.cgrey300,
    },
    '&:focus': {
      outline: 'none',
      borderColor: themeVars.palette.blue,
      boxShadow: `0 0 0 1px ${themeVars.palette.blue}`,
    },
    '&:disabled': {
      backgroundColor: themeVars.palette.cgrey100,
      color: themeVars.palette.cgrey400,
    },
    '&:disabled::placeholder': {
      color: themeVars.palette.cgrey300,
    },
  },
});

export const input = styleVariants({
  normal: [baseInput],
  error: [
    baseInput,
    {
      borderColor: themeVars.palette.red,
      selectors: {
        '&:focus': {
          borderColor: themeVars.palette.red,
          boxShadow: `0 0 0 1px ${themeVars.palette.red}`,
        },
      },
    },
  ],
});

export const errorMessage = style([
  typography.captionB,
  {
    color: themeVars.palette.red,
  },
]);

export const helper = style([
  typography.captionR,
  {
    color: themeVars.palette.cgrey400,
  },
]);

export const action = style({ display: 'flex', justifyContent: 'flex-end' });

export const errorNotice = style([
  typography.bodyR,
  {
    color: themeVars.palette.red,
    padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
    borderRadius: themeVars.radius.md,
    backgroundColor: themeVars.palette.red10,
  },
]);

export const loadingMessage = style([
  typography.bodyR,
  { color: themeVars.palette.cgrey400 },
]);

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const spinner = style({
  display: 'inline-flex',
  width: 20,
  height: 20,
});

export const spinnerIcon = style({
  width: '100%',
  height: '100%',
  animation: `${spin} 0.8s linear infinite`,
});
