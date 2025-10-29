import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const headerCounter = style([
  typography.bodySmallR,
  { color: themeVars.palette.cgrey500 },
]);

export const tableToolbar = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeVars.spacing.base,
  flexWrap: 'wrap',
});

export const searchWrapper = style({
  position: 'relative',
  flex: '1 1 320px',
  minWidth: 220,
});

export const searchIcon = style({
  position: 'absolute',
  left: themeVars.spacing.sm,
  top: '50%',
  transform: 'translateY(-50%)',
  color: themeVars.palette.cgrey400,
  pointerEvents: 'none',
});

export const searchInput = style([
  typography.bodyR,
  {
    width: '100%',
    padding: `${themeVars.spacing.sm} ${themeVars.spacing.base} ${themeVars.spacing.sm} ${themeVars.spacing.xl}`,
    borderRadius: themeVars.radius.md,
    border: `1px solid ${themeVars.palette.cgrey200}`,
    backgroundColor: themeVars.palette.white,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    selectors: {
      '&:focus-visible': {
        outline: 'none',
        borderColor: themeVars.palette.blue300,
        boxShadow: `0 0 0 3px ${themeVars.palette.blue50}`,
      },
      '&::placeholder': {
        color: themeVars.palette.cgrey400,
      },
    },
  },
]);

export const tableSummary = style([
  typography.captionR,
  {
    color: themeVars.palette.cgrey500,
    textAlign: 'right',
  },
]);

export const listPlaceholder = style([
  typography.bodyR,
  {
    color: themeVars.palette.cgrey500,
    textAlign: 'center',
    padding: `${themeVars.spacing.xxl} 0`,
  },
]);

export const linkCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.spacing.sm,
});

export const linkIconWrapper = style({
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: themeVars.palette.cgrey100,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  position: 'relative',
});

export const linkIcon = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const linkIconPlaceholder = style([
  typography.bodyB,
  {
    color: themeVars.palette.cgrey500,
  },
]);

export const linkInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const linkName = style([
  typography.bodyB,
  { color: themeVars.palette.black },
]);

export const linkAlias = style([
  typography.captionR,
  { color: themeVars.palette.cgrey500 },
]);

export const linkUrl = style([
  typography.bodySmallR,
  {
    color: themeVars.palette.blue400,
    textDecoration: 'none',
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);

export const cellMuted = style([
  typography.bodyR,
  { color: themeVars.palette.cgrey500 },
]);

export const sidePanel = {
  header: style({
    padding: `${themeVars.spacing.xxl} ${themeVars.spacing.xxl} ${themeVars.spacing.base}`,
    borderBottom: `1px solid ${themeVars.palette.cgrey100}`,
    display: 'flex',
    flexDirection: 'column',
    gap: themeVars.spacing.xs,
  }),
  title: style([
    typography.bodyLargeB,
    { color: themeVars.palette.black },
  ]),
  subtitle: style([
    typography.captionR,
    { color: themeVars.palette.cgrey500 },
  ]),
  body: style({
    padding: themeVars.spacing.xxl,
    display: 'flex',
    flexDirection: 'column',
    gap: themeVars.spacing.xxl,
    overflowY: 'auto',
    flex: 1,
  }),
  section: style({
    display: 'flex',
    flexDirection: 'column',
    gap: themeVars.spacing.md,
  }),
  sectionHeader: style({
    display: 'flex',
    flexDirection: 'column',
    gap: themeVars.spacing.xs,
  }),
  sectionTitle: style([
    typography.bodyB,
    { color: themeVars.palette.black },
  ]),
  sectionDescription: style([
    typography.captionR,
    { color: themeVars.palette.cgrey500 },
  ]),
  infoList: style({
    display: 'flex',
    flexDirection: 'column',
    gap: themeVars.spacing.base,
  }),
  infoItem: style({
    display: 'flex',
    flexDirection: 'column',
    gap: themeVars.spacing.xs,
  }),
  infoLabel: style([
    typography.captionB,
    { color: themeVars.palette.cgrey500 },
  ]),
  infoValue: style([
    typography.bodyR,
    { color: themeVars.palette.black, wordBreak: 'break-word' },
  ]),
  muted: style([
    typography.captionR,
    { color: themeVars.palette.cgrey400 },
  ]),
  form: style({
    display: 'flex',
    flexDirection: 'column',
    gap: themeVars.spacing.xl,
  }),
  formGroup: style({
    display: 'flex',
    flexDirection: 'column',
    gap: themeVars.spacing.base,
  }),
  formActions: style({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: themeVars.spacing.sm,
  }),
  empty: style([
    typography.bodyR,
    {
      color: themeVars.palette.cgrey500,
      textAlign: 'center',
      padding: `${themeVars.spacing.xxl} 0`,
    },
  ]),
  linkPreview: style({
    display: 'flex',
    alignItems: 'center',
    gap: themeVars.spacing.sm,
  }),
  linkPreviewIcon: style({
    width: 40,
    height: 40,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeVars.palette.cgrey100,
    border: `1px solid ${themeVars.palette.cgrey200}`,
    position: 'relative',
  }),
  linkPreviewImage: style({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }),
  linkPreviewFallback: style([
    typography.bodyB,
    { color: themeVars.palette.cgrey500 },
  ]),
  linkActions: style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: themeVars.spacing.sm,
    flexWrap: 'wrap',
  }),
  linkActionGroup: style({
    display: 'flex',
    gap: themeVars.spacing.xs,
  }),
};

