import { style } from '@vanilla-extract/css';

import { themeVars, typography } from '@/design';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xl,
  padding: themeVars.spacing.xxl,
});

export const hero = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.lg,
  padding: `${themeVars.spacing.xl} ${themeVars.spacing.xxl}`,
  borderRadius: themeVars.radius.lg,
  background: themeVars.palette.cgrey50,
  border: `1px solid ${themeVars.palette.cgrey100}`,
});

export const iconWrapper = style({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: themeVars.palette.blue10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeVars.palette.blue,
});

export const title = style([typography.titleSmallB, { color: themeVars.palette.black }]);

export const subtitle = style([typography.bodyLargeM, { color: themeVars.palette.cgrey500 }]);

export const content = style([
  typography.bodyR,
  {
    color: themeVars.palette.cgrey500,
  },
]);
