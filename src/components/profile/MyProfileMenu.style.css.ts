import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const container = style({
  position: 'absolute',
  top: '50%',
  left: 'calc(100% + 12px)',
  transform: 'translateY(-50%)',
  width: '320px',
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  boxShadow: themeVars.shadow.lg,
  padding: themeVars.spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.lg,
  zIndex: 2000,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const orgName = style([typography.captionB, { color: themeVars.palette.cgrey600 }]);

export const userNameRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.sm,
});

export const actionButton = style({
  width: '100%',
});

export const divider = style({
  width: '100%',
  height: '1px',
  backgroundColor: themeVars.palette.cgrey100,
});

export const historySection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const historyHeader = style([typography.captionB, { color: themeVars.palette.cgrey700 }]);

export const historyList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
  maxHeight: '200px',
  overflowY: 'auto',
});

export const historyItemButton = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
  borderRadius: themeVars.radius.md,
  border: `1px solid ${themeVars.palette.cgrey100}`,
  backgroundColor: themeVars.palette.white,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, border-color 0.2s ease',
  ':hover': {
    backgroundColor: themeVars.palette.cgrey10,
    borderColor: themeVars.palette.cgrey200,
  },
});

export const historyItemInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  textAlign: 'left',
});

export const historyItemName = style([typography.bodyB, { color: themeVars.palette.black }]);

export const historyItemDescription = style([
  typography.captionR,
  { color: themeVars.palette.cgrey600 },
]);

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const addUserButton = style({
  width: '100%',
});

export const emptyHistory = style([
  typography.captionR,
  {
    color: themeVars.palette.cgrey500,
    textAlign: 'center',
  },
]);

export const closeButton = style({
  position: 'absolute',
  top: themeVars.spacing.sm,
  right: themeVars.spacing.sm,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: themeVars.palette.cgrey500,
  lineHeight: 0,
});

