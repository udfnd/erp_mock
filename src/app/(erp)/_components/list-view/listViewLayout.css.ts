import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const page = style({
  display: 'flex',
  gap: themeVars.spacing.xxl,
  width: '100%',
  alignItems: 'stretch',
});

export const mainArea = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xl,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeVars.spacing.lg,
  flexWrap: 'wrap',
});

export const headerText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const title = style([typography.titleSmallB, { color: themeVars.palette.black }]);

export const description = style([typography.bodyR, { color: themeVars.palette.cgrey500 }]);

export const headerMeta = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: themeVars.spacing.md,
  flexWrap: 'wrap',
});

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.sm,
  color: themeVars.palette.black,
});

export const listSection = style({
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  boxShadow: themeVars.shadow.sm,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const listSectionHeader = style({
  padding: `${themeVars.spacing.xl}`,
  borderBottom: `1px solid ${themeVars.palette.cgrey100}`,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const listSectionBody = style({
  padding: `${themeVars.spacing.lg} ${themeVars.spacing.xl} ${themeVars.spacing.xl}`,
});

export const listSectionBodyStandalone = style({
  padding: `${themeVars.spacing.xl}`,
});

export const pagination = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: themeVars.spacing.base,
});

export const sidePanel = style({
  width: 360,
  flexShrink: 0,
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  boxShadow: themeVars.shadow.sm,
  maxHeight: 'calc(100vh - 64px)',
  position: 'sticky',
  top: themeVars.spacing.xl,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});
