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

// 기존 export 들 유지

export const statusValue = style([
  typography.bodyR,
  { color: themeVars.palette.black, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
]);

export const statusField = style({
  // 텍스트필드 형태의 컨테이너
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.sm,
  padding: `${themeVars.spacing.xs} ${themeVars.spacing.sm}`,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  borderRadius: themeVars.radius.md,
  background: themeVars.palette.white,
  transition: 'border-color 120ms ease',
  selectors: {
    '&:hover': { borderColor: themeVars.palette.cgrey300 },
    '&:focus-within': { borderColor: themeVars.palette.blue600 },
  },
});

export const statusInputField = style([
  typography.bodyR,
  {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: themeVars.palette.black,
    selectors: {
      '&::placeholder': { color: themeVars.palette.cgrey400 },
    },
    minWidth: 0, // 긴 텍스트 줄바꿈/축소 대응
  },
]);

export const statusActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.xs,
  marginLeft: themeVars.spacing.sm,
});


export const addButtonWrapper = style({
  display: 'flex',
  justifyContent: 'flex-start',
});
