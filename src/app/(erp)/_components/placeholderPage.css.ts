import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const panelBase = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '32px',
  borderRadius: themeVars.radius.lg,
  background: themeVars.palette.white,
  boxShadow: themeVars.shadow.sm,

  '@media': {
    '(max-width: 959px)': {
      padding: '24px',
    },
  },
});

export const hero = style([
  panelBase,
  {
    gap: '16px',
  },
]);

export const section = style([
  panelBase,
  {
    padding: '28px 32px',

    '@media': {
      '(max-width: 959px)': {
        padding: '20px 24px',
      },
    },
  },
]);

export const title = style([
  typography.heading3SB,
  {
    color: themeVars.palette.cgrey800,
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
  gap: '8px',
});

export const metaChip = style([
  typography.captionSB,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: themeVars.radius.round,
    background: themeVars.palette.blue50,
    color: themeVars.palette.blue600,
  },
]);

export const sectionHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const sectionTitle = style([
  typography.heading4SB,
  {
    color: themeVars.palette.cgrey700,
  },
]);

export const sectionDescription = style([
  typography.bodyS,
  {
    color: themeVars.palette.cgrey400,
    lineHeight: 1.6,
  },
]);

export const sectionBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const cardGrid = style({
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
});

export const card = style([
  typography.bodyS,
  {
    minHeight: '120px',
    borderRadius: themeVars.radius.md,
    border: `1px dashed ${themeVars.palette.cgrey200}`,
    background: themeVars.palette.cgrey25,
    color: themeVars.palette.cgrey400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '16px',
  },
]);
