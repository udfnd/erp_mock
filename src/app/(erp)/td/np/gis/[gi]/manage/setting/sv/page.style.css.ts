import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const page = style({
  minHeight: '100%',
  display: 'flex',
  gap: themeVars.spacing.xxl,
});

export const card = style({
  background: themeVars.palette.white,
  borderRadius: '8px',
  backgroundColor: themeVars.palette.cgrey10,
  padding: themeVars.spacing.base,
  minWidth: '410px',
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

export const cardTitle = style([typography.bodyLargeB, { color: themeVars.palette.black }]);

export const cardSubtitle = style([typography.bodySmallR, { color: themeVars.palette.cgrey500 }]);

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

export const statusText = style([typography.captionR, { color: themeVars.palette.cgrey500 }]);

export const feedback = styleVariants({
  success: [typography.captionB, { color: themeVars.palette.blue600 }],
  error: [typography.captionB, { color: themeVars.palette.red }],
});

export const errorText = style([typography.bodySmallR, { color: themeVars.palette.red }]);

export const categorySection = style({
  borderRadius: themeVars.radius.md,
  display: 'flex',
  flexDirection: 'column',
  background: themeVars.palette.cgrey50,
});

export const categoryHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: themeVars.spacing.base,
});

export const categoryLabel = style([typography.bodySmallM, { color: themeVars.palette.black }]);

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
