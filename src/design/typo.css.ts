import { style } from '@vanilla-extract/css';

import { typography as typoData } from './typo';

const createTypographyStyles = <T extends Record<string, Parameters<typeof style>[0]>>(
  styles: T,
) => {
  const entries = (Object.keys(styles) as Array<keyof T>).map((key) => [
    key,
    style(styles[key]),
  ]);

  return Object.fromEntries(entries) as { readonly [K in keyof T]: string };
};

export const typography = createTypographyStyles(typoData);

export type TypographyClassNames = typeof typography;
export type TypographyKey = keyof typeof typography;
