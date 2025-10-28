import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const pageContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing['2xl'],
  paddingBottom: themeVars.spacing['2xl'],
});

export const sectionCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.lg,
  padding: '32px',
  borderRadius: themeVars.radius.lg,
  background: themeVars.palette.white,
  boxShadow: themeVars.shadow.sm,
});

export const descriptionList = style({
  display: 'grid',
  gap: themeVars.spacing.base,
});

export const descriptionItem = style({
  display: 'grid',
  gap: themeVars.spacing.xs,
});

export const eyebrow = style([
  typography.bodySmallSB,
  {
    color: themeVars.palette.cgrey400,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
]);

export const sectionTitle = style([
  typography.titleSmallB,
  {
    color: themeVars.palette.cgrey700,
  },
]);

export const sectionDescription = style([
  typography.bodyM,
  {
    color: themeVars.palette.cgrey500,
  },
]);

export const descriptionTerm = style([
  typography.bodySB,
  {
    color: themeVars.palette.cgrey600,
  },
]);

export const descriptionDetail = style([
  typography.bodyR,
  {
    color: themeVars.palette.cgrey500,
  },
]);
