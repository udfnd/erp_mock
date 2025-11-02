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

export const pageTitle = style([typography.titleSmallB, { color: themeVars.palette.black }]);

export const pageDescription = style([typography.bodyR, { color: themeVars.palette.cgrey500 }]);

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

export const cardWide = style({
  gridColumn: 'span 2',
  '@media': {
    'screen and (max-width: 1200px)': {
      gridColumn: 'span 1',
    },
  },
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
  flexWrap: 'wrap',
});

export const statusText = style([typography.captionR, { color: themeVars.palette.cgrey500 }]);

export const feedback = styleVariants({
  success: [typography.captionB, { color: themeVars.palette.blue600 }],
  error: [typography.captionB, { color: themeVars.palette.red }],
});

export const errorText = style([typography.bodySmallR, { color: themeVars.palette.red }]);

export const linkField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const linkRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.sm,
  flexWrap: 'wrap',
});

export const linkInput = style({
  flex: 1,
  minWidth: '220px',
});

export const copyStatus = style([typography.captionR, { color: themeVars.palette.cgrey500 }]);

export const inputRow = style({
  display: 'flex',
  gap: themeVars.spacing.sm,
  flexWrap: 'wrap',
  alignItems: 'flex-end',
});

export const schoolInput = style({
  flex: 1,
  minWidth: '220px',
});

export const chipList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: themeVars.spacing.sm,
});

export const chipButton = style({
  background: 'transparent',
});

export const emptyText = style([typography.bodySmallR, { color: themeVars.palette.cgrey400 }]);

export const selectGroupGrid = style({
  display: 'grid',
  gap: themeVars.spacing.lg,
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
});

export const selectGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const fieldLabel = style([typography.bodySmallSB, { color: themeVars.palette.black }]);

export const fieldDescription = style([typography.captionR, { color: themeVars.palette.cgrey500 }]);

export const select = style({
  width: '100%',
  height: '44px',
  borderRadius: themeVars.radius.md,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  background: themeVars.palette.white,
  color: themeVars.palette.black,
  padding: `0 ${themeVars.spacing.base}`,
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  selectors: {
    '&:focus': {
      borderColor: themeVars.palette.blue400,
      boxShadow: `0 0 0 3px ${themeVars.palette.blue50}`,
    },
    '&:disabled': {
      background: themeVars.palette.cgrey50,
      color: themeVars.palette.cgrey400,
    },
  },
});

export const openFileSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const openFileList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
  borderRadius: themeVars.radius.md,
  border: `1px solid ${themeVars.palette.cgrey100}`,
  background: themeVars.palette.cgrey50,
  padding: themeVars.spacing.lg,
});

export const openFileItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.sm,
});

export const openFileName = style([typography.bodySmallR, { color: themeVars.palette.black }]);

export const openFileDescription = style([
  typography.captionR,
  { color: themeVars.palette.cgrey500 },
]);

export const sectionTitle = style([typography.bodySB, { color: themeVars.palette.black }]);

export const sectionDescription = style([
  typography.captionR,
  { color: themeVars.palette.cgrey500 },
]);

export const actions = style({
  display: 'flex',
  gap: themeVars.spacing.sm,
  alignItems: 'center',
  flexWrap: 'wrap',
});
