import { style } from '@vanilla-extract/css';

import { typography as typoData } from './typo';

type TypoKeys = keyof typeof typoData;

export const typography = Object.keys(typoData).reduce(
  (acc, key) => {
    const typedKey = key as TypoKeys;
    acc[typedKey] = style(typoData[typedKey]);
    return acc;
  },
  {} as Record<TypoKeys, string>,
);
