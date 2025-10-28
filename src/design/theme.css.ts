import { createGlobalTheme, createGlobalThemeContract } from '@vanilla-extract/css';

import { color } from './colors';

export const themeVars = createGlobalThemeContract(
  {
    palette: {
      black: null,
      white: null,
      cgrey10: null,
      cgrey50: null,
      cgrey100: null,
      cgrey200: null,
      cgrey300: null,
      cgrey400: null,
      cgrey500: null,
      cgrey600: null,
      cgrey700: null,
      blue: null,
      blue600: null,
      blue400: null,
      blue300: null,
      blue200: null,
      blue100: null,
      blue50: null,
      blue10: null,
      purple: null,
      purple10: null,
      red: null,
      red10: null,
      yellow: null,
      yellow10: null,
    },
    radius: {
      sm: null,
      md: null,
      lg: null,
      xl: null,
    },
    shadow: {
      sm: null,
      md: null,
      lg: null,
    },
    spacing: {
      xs: null,
      sm: null,
      md: null,
      base: null,
      lg: null,
      xl: null,
      '2xl': null,
    },
  },
  (_value, path) => `th-${path.join('-')}`,
);

createGlobalTheme(':root', themeVars, {
  palette: color,
  radius: { sm: '6px', md: '10px', lg: '14px', xl: '20px' },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 10px 24px rgba(0,0,0,0.12)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    base: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
  },
});
