import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const page = style({
  display: 'flex',
  gap: themeVars.spacing.xxl,
  width: '100%',
  alignItems: 'flex-start',
});

export const mainArea = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xxl,
});

export const header = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: themeVars.spacing.xxl,
});

export const headerText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const title = style([
  typography.titleSmallB,
  { color: themeVars.palette.black },
]);

export const description = style([
  typography.bodyR,
  { color: themeVars.palette.cgrey500 },
]);

export const headerMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.base,
});

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.sm,
});

export const filterBar = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const listSection = style({
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  padding: themeVars.spacing.xxl,
  boxShadow: themeVars.shadow.sm,
  display: 'flex',
  flexDirection: 'column',
});

export const pagination = style({
  display: 'flex',
  justifyContent: 'center',
});

export const sidePanel = style({
  width: 360,
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  boxShadow: themeVars.shadow.sm,
  alignSelf: 'stretch',
  maxHeight: 'calc(100vh - 64px)',
  position: 'sticky',
  top: themeVars.spacing.xxl,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const sidePanelPlaceholder = style([
  typography.bodyR,
  {
    color: themeVars.palette.cgrey400,
    padding: themeVars.spacing.xxl,
  },
]);
