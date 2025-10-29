import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const page = style({
  minHeight: '100%',
  background: themeVars.palette.cgrey10,
  padding: `${themeVars.spacing.xxl}`,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xxl,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const pageTitle = style([
  typography.titleSmallB,
  { color: themeVars.palette.black },
]);

export const pageDescription = style([
  typography.bodyR,
  { color: themeVars.palette.cgrey500 },
]);

export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: themeVars.spacing.xxl,
  alignItems: 'stretch',
});

export const card = style({
  background: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  boxShadow: themeVars.shadow.md,
  padding: themeVars.spacing.xxl,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xl,
});

export const cardHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: themeVars.spacing.lg,
});

export const cardTitleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const cardTitle = style([
  typography.bodyLargeB,
  { color: themeVars.palette.black },
]);

export const cardSubtitle = style([
  typography.bodySmallR,
  { color: themeVars.palette.cgrey500 },
]);

export const cardBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.lg,
});

export const cardFooter = style({
  marginTop: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeVars.spacing.lg,
});

export const statusText = style([
  typography.captionR,
  { color: themeVars.palette.cgrey500 },
]);

export const feedback = styleVariants({
  success: [
    typography.captionB,
    { color: themeVars.palette.blue600 },
  ],
  error: [
    typography.captionB,
    { color: themeVars.palette.red },
  ],
});

export const errorText = style([
  typography.bodySmallR,
  { color: themeVars.palette.red },
]);

export const categorySection = style({
  border: `1px solid ${themeVars.palette.cgrey100}`,
  borderRadius: themeVars.radius.md,
  padding: themeVars.spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.md,
  background: themeVars.palette.cgrey50,
});

export const categoryHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: themeVars.spacing.base,
});

export const categoryLabel = style([
  typography.bodySB,
  { color: themeVars.palette.black },
]);

export const statusList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const statusItem = style({
  display: 'flex',
  gap: themeVars.spacing.sm,
  alignItems: 'center',
});

export const statusInput = style({ flex: 1 });

export const addButtonWrapper = style({
  display: 'flex',
  justifyContent: 'flex-start',
});
