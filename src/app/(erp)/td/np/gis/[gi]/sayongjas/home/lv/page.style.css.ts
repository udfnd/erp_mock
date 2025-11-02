import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const controls = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: themeVars.spacing.base,
  flexWrap: 'wrap',
});

export const searchWrapper = style({
  position: 'relative',
  flex: '1 1 280px',
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
    padding: `${themeVars.spacing.sm} ${themeVars.spacing.base} ${themeVars.spacing.sm} ${themeVars.spacing.xxl}`,
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
    },
  },
]);

export const filterButtons = style({
  display: 'flex',
  gap: themeVars.spacing.sm,
});

export const filterPopover = style({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  width: 360,
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  boxShadow: themeVars.shadow.lg,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
});

export const filterGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
  padding: `${themeVars.spacing.base} ${themeVars.spacing.xxl}`,
});

export const filterGroupHeader = style([
  typography.captionB,
  { color: themeVars.palette.cgrey500, cursor: 'pointer' },
]);

export const filterDivider = style({
  height: 1,
  backgroundColor: themeVars.palette.cgrey100,
  margin: 0,
});

export const filterOption = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeVars.spacing.sm,
});

export const filterOptionLabel = style([typography.bodyR, { color: themeVars.palette.black }]);

export const filterFooter = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: themeVars.spacing.base,
  padding: `${themeVars.spacing.base} ${themeVars.spacing.xxl}`,
  borderTop: `1px solid ${themeVars.palette.cgrey100}`,
});

export const filterSummary = style([typography.captionR, { color: themeVars.palette.cgrey500 }]);

export const sortPopover = style({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  width: 220,
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  boxShadow: themeVars.shadow.lg,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
});

export const sortOptionButton = style([
  typography.bodyR,
  {
    padding: `${themeVars.spacing.sm} ${themeVars.spacing.xxl}`,
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        backgroundColor: themeVars.palette.blue50,
      },
    },
  },
]);

export const sortOptionActive = style({
  backgroundColor: themeVars.palette.blue100,
  color: themeVars.palette.blue600,
});

export const tableToolbar = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const filterSubGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
  marginTop: themeVars.spacing.xs,
});

export const filterSubGroupHeader = style([
  typography.captionB,
  { color: themeVars.palette.cgrey400, cursor: 'pointer' },
]);

export const filterHint = style([typography.captionR, { color: themeVars.palette.cgrey400 }]);

export const sidePanelHeader = style({
  padding: `${themeVars.spacing.xxl} ${themeVars.spacing.xxl} ${themeVars.spacing.base}`,
  borderBottom: `1px solid ${themeVars.palette.cgrey100}`,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const sidePanelTitle = style([typography.bodyLargeB, { color: themeVars.palette.black }]);

export const sidePanelSubtitle = style([
  typography.captionR,
  { color: themeVars.palette.cgrey500 },
]);

export const sidePanelBody = style({
  padding: themeVars.spacing.xxl,
  overflowY: 'auto',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xl,
});

export const infoGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const infoLabel = style([typography.captionB, { color: themeVars.palette.cgrey500 }]);

export const infoValue = style([typography.bodyR, { color: themeVars.palette.black }]);

export const placeholder = style([
  typography.bodyR,
  {
    color: themeVars.palette.cgrey500,
    padding: themeVars.spacing.xxl,
  },
]);

export const selectedCount = style([typography.captionB, { color: themeVars.palette.blue600 }]);

export const panelFooter = style({
  padding: themeVars.spacing.xxl,
  borderTop: `1px solid ${themeVars.palette.cgrey100}`,
  display: 'flex',
  justifyContent: 'flex-end',
});

export const fetchStatus = style([typography.captionR, { color: themeVars.palette.cgrey400 }]);

export const sidePanelSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.md,
});

export const sectionTitle = style([typography.bodyB, { color: themeVars.palette.black }]);

export const sectionSubtitle = style([typography.captionR, { color: themeVars.palette.cgrey500 }]);

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const fieldRow = style({
  display: 'flex',
  flexDirection: 'row',
  gap: themeVars.spacing.xl,
  flexWrap: 'wrap',
});

export const fieldLabel = style([typography.captionB, { color: themeVars.palette.cgrey500 }]);

export const fieldValue = style([typography.bodyR, { color: themeVars.palette.black }]);

export const textInput = style([
  typography.bodyR,
  {
    width: '100%',
    padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
    borderRadius: themeVars.radius.md,
    border: `1px solid ${themeVars.palette.cgrey200}`,
    backgroundColor: themeVars.palette.white,
    selectors: {
      '&:focus-visible': {
        outline: 'none',
        borderColor: themeVars.palette.blue300,
        boxShadow: `0 0 0 3px ${themeVars.palette.blue50}`,
      },
    },
  },
]);

export const select = style([textInput]);

export const toggleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeVars.spacing.base,
});

export const toggleLabel = style([typography.bodyR, { color: themeVars.palette.black }]);

export const sectionActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: themeVars.spacing.sm,
});

export const errorText = style([typography.captionR, { color: themeVars.palette.red }]);

export const permissionList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
  marginTop: themeVars.spacing.xs,
});

export const permissionItem = style({
  padding: `${themeVars.spacing.sm} ${themeVars.spacing.base}`,
  borderRadius: themeVars.radius.md,
  border: `1px solid ${themeVars.palette.cgrey100}`,
  backgroundColor: themeVars.palette.cgrey10,
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
});

export const permissionName = style([typography.bodyB, { color: themeVars.palette.black }]);

export const permissionMeta = style([typography.captionR, { color: themeVars.palette.cgrey500 }]);

export const permissionActions = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'flex-end',
});

export const permissionModal = style({
  position: 'absolute',
  top: 0,
  right: '100%',
  marginRight: themeVars.spacing.sm,
  width: 280,
  maxHeight: 360,
  backgroundColor: themeVars.palette.white,
  borderRadius: themeVars.radius.lg,
  border: `1px solid ${themeVars.palette.cgrey200}`,
  boxShadow: themeVars.shadow.lg,
  display: 'flex',
  flexDirection: 'column',
  padding: themeVars.spacing.base,
  zIndex: 20,
});

export const permissionModalHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.xs,
  marginBottom: themeVars.spacing.sm,
});

export const permissionModalTitle = style([typography.bodyB, { color: themeVars.palette.black }]);

export const permissionModalHint = style([typography.captionR, { color: themeVars.palette.cgrey400 }]);

export const permissionModalBody = style({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

export const permissionModalList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.spacing.sm,
});

export const permissionModalOption = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeVars.spacing.sm,
  padding: `${themeVars.spacing.xs} ${themeVars.spacing.sm}`,
  borderRadius: themeVars.radius.md,
  border: `1px solid ${themeVars.palette.cgrey100}`,
});

export const permissionModalOptionLabel = style([typography.bodyR, { color: themeVars.palette.black }]);

export const permissionModalEmpty = style([typography.captionR, { color: themeVars.palette.cgrey400 }]);

export const permissionModalFooter = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: themeVars.spacing.sm,
  marginTop: themeVars.spacing.base,
});
