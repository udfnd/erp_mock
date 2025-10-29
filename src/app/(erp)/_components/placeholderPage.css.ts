import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xl,
});

const panelBase = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.md,
  padding: themeVars.spacing.xxl,
  borderRadius: themeVars.radius.lg,
  background: themeVars.palette.white,
  boxShadow: themeVars.shadow.sm,

  '@media': {
    '(max-width: 959px)': {
      padding: themeVars.spacing.xl,
    },
  },
});

export const hero = style([
  panelBase,
  {
    gap: themeVars.spacing.base,
  },
]);

export const section = style([
  panelBase,
  {
    paddingBlock: themeVars.spacing.xl,
    paddingInline: themeVars.spacing.xxl,

    '@media': {
      '(max-width: 959px)': {
        paddingBlock: themeVars.spacing.lg,
        paddingInline: themeVars.spacing.xl,
      },
    },
  },
]);

export const title = style([
  typography.titleB,
  {
    color: themeVars.palette.cgrey700,
  },
]);

export const description = style([
  typography.bodyM,
  {
    color: themeVars.palette.cgrey500,
    lineHeight: 1.6,
  },
]);

export const meta = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: themeVars.spacing.sm,
});

export const metaChip = style([
  typography.captionB,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: themeVars.spacing.xs,
    paddingBlock: themeVars.spacing.xs,
    paddingInline: themeVars.spacing.sm,
    borderRadius: themeVars.radius.xl,
    background: themeVars.palette.blue50,
    color: themeVars.palette.blue600,
  },
]);

export const sectionHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const sectionTitle = style([
  typography.titleSmallB,
  {
    color: themeVars.palette.cgrey700,
  },
]);

export const sectionDescription = style([
  typography.bodySmallR,
  {
    color: themeVars.palette.cgrey400,
    lineHeight: 1.6,
  },
]);

export const sectionBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.base,
});

export const cardGrid = style({
  display: 'grid',
  gap: themeVars.spacing.base,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
});

export const card = style([
  typography.bodySmallR,
  {
    minHeight: '120px',
    borderRadius: themeVars.radius.md,
    border: `1px dashed ${themeVars.palette.cgrey200}`,
    background: themeVars.palette.cgrey50,
    color: themeVars.palette.cgrey400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: themeVars.spacing.base,
  },
]);
