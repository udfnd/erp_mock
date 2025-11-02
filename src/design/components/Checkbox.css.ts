import { style, globalStyle } from '@vanilla-extract/css';

import { themeVars } from '@/design/theme.css';

export const container = style({
  position: 'relative',
  display: 'inline-flex',
  width: '20px',
  height: '20px',
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
      content: '""',
      position: 'absolute',
      width: '8px',
      height: '12px',
      border: `2px solid ${themeVars.palette.white}`,
      borderTop: 'none',
      borderLeft: 'none',
      transform: 'rotate(45deg) scale(0.5)',
      opacity: 0,
      transition: 'opacity 0.15s ease, transform 0.15s ease',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '10px',
      height: '2px',
      borderRadius: '1px',
      backgroundColor: themeVars.palette.blue600,
      opacity: 0,
      transform: 'scaleX(0.4)',
      transition: 'opacity 0.15s ease, transform 0.15s ease',
    },
  },
});

/* input 상태 + 형제 box 스타일 */
globalStyle(`${input}:disabled + ${box}`, {
  cursor: 'not-allowed',
  backgroundColor: themeVars.palette.cgrey50,
  borderColor: themeVars.palette.cgrey200,
});

globalStyle(`${input}:checked + ${box}`, {
  backgroundColor: themeVars.palette.blue600,
  borderColor: themeVars.palette.blue600,
});

globalStyle(`${input}:checked + ${box}::after`, {
  opacity: 1,
  transform: 'scale(1) rotate(45deg)',
});

globalStyle(`${input}:indeterminate + ${box}`, {
  backgroundColor: themeVars.palette.blue100,
  borderColor: themeVars.palette.blue400,
});

globalStyle(`${input}:indeterminate + ${box}::before`, {
  opacity: 1,
  transform: 'scaleX(1)',
});

globalStyle(`${input}:focus-visible + ${box}`, {
  boxShadow: `0 0 0 4px ${themeVars.palette.blue50}`,
});
