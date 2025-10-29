import { style } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';

export const container = style({
  position: 'relative',
  display: 'inline-flex',
  width: 20,
  height: 20,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

export const input = style({
  position: 'absolute',
  inset: 0,
  margin: 0,
  opacity: 0,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
    },
    '&:disabled + span': {
      cursor: 'not-allowed',
      backgroundColor: themeVars.palette.cgrey50,
      borderColor: themeVars.palette.cgrey200,
    },
    '&:checked + span': {
      backgroundColor: themeVars.palette.blue600,
      borderColor: themeVars.palette.blue600,
    },
    '&:checked + span::after': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '&:indeterminate + span': {
      backgroundColor: themeVars.palette.blue100,
      borderColor: themeVars.palette.blue400,
    },
    '&:indeterminate + span::before': {
      opacity: 1,
      transform: 'scaleX(1)',
    },
    '&:focus-visible + span': {
      boxShadow: `0 0 0 4px ${themeVars.palette.blue50}`,
    },
  },
});

export const box = style({
  width: '100%',
  height: '100%',
  borderRadius: themeVars.radius.sm,
  border: `1px solid ${themeVars.palette.cgrey300}`,
  backgroundColor: themeVars.palette.white,
  transition: 'all 0.15s ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      width: 8,
      height: 12,
      border: `2px solid ${themeVars.palette.white}`,
      borderTop: 'none',
      borderLeft: 'none',
      transform: 'rotate(45deg) scale(0.5)',
      opacity: 0,
      transition: 'opacity 0.15s ease, transform 0.15s ease',
    },
    '&::before': {
      content: '',
      position: 'absolute',
      width: 10,
      height: 2,
      borderRadius: 1,
      backgroundColor: themeVars.palette.blue600,
      opacity: 0,
      transform: 'scaleX(0.4)',
      transition: 'opacity 0.15s ease, transform 0.15s ease',
    },
  },
});
