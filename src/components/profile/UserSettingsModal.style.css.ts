import { style, styleVariants } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(17, 24, 39, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 4000,
});

export const dialog = style({
  width: '960px',
  maxWidth: '96vw',
  height: '640px',
  maxHeight: '90vh',
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.xl,
  boxShadow: themeVars.shadow.lg,
  display: 'flex',
  overflow: 'hidden',
});

export const sideNav = style({
  width: '220px',
  backgroundColor: themeVars.palette.cgrey10,
  display: 'flex',
  flexDirection: 'column',
  padding: themeVars.spacing.xl,
  gap: themeVars.spacing.sm,
  borderRight: `1px solid ${themeVars.palette.cgrey100}`,
});

export const sideNavButton = styleVariants({
  active: [
    typography.bodyB,
    {
      padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
      borderRadius: themeVars.radius.md,
      backgroundColor: themeVars.palette.white,
      color: themeVars.palette.blue600,
      border: `1px solid ${themeVars.palette.blue200}`,
      textAlign: 'left',
      cursor: 'pointer',
    },
  ],
  inactive: [
    typography.bodyM,
    {
      padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
      borderRadius: themeVars.radius.md,
      backgroundColor: 'transparent',
      color: themeVars.palette.cgrey600,
      border: '1px solid transparent',
      textAlign: 'left',
      cursor: 'pointer',
      selectors: {
        '&:hover': {
          backgroundColor: themeVars.palette.white,
          borderColor: themeVars.palette.cgrey100,
          color: themeVars.palette.cgrey700,
        },
      },
    },
  ],
});

export const content = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: themeVars.spacing.xl,
  position: 'relative',
});

export const contentHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: themeVars.spacing.lg,
});

export const contentTitle = style([typography.heading4, { color: themeVars.palette.black }]);

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.md,
});

export const description = style([
  typography.captionR,
  { color: themeVars.palette.cgrey600 },
]);

export const infoGrid = style({
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  rowGap: themeVars.spacing.sm,
  columnGap: themeVars.spacing.base,
});

export const infoTerm = style([typography.captionB, { color: themeVars.palette.cgrey600 }]);

export const infoDescription = style([typography.bodyM, { color: themeVars.palette.black }]);

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

export const passwordForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.md,
  width: '360px',
  maxWidth: '100%',
});

export const passwordFormActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: themeVars.spacing.sm,
});

export const formField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const formLabel = style([typography.captionB, { color: themeVars.palette.cgrey700 }]);

export const textInput = style({
  width: '100%',
  padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
  borderRadius: themeVars.radius.md,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  outline: 'none',
  fontSize: '14px',
  selectors: {
    '&:focus': {
      borderColor: themeVars.palette.blue400,
      boxShadow: `0 0 0 3px ${themeVars.palette.blue50}`,
    },
  },
});

export const errorText = style([typography.captionR, { color: themeVars.palette.red }]);

export const placeholder = style([
  typography.bodyM,
  {
    color: themeVars.palette.cgrey600,
    backgroundColor: themeVars.palette.cgrey10,
    padding: themeVars.spacing.lg,
    borderRadius: themeVars.radius.lg,
  },
]);

