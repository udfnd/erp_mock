import { style } from '@vanilla-extract/css';

import { typography as typoData } from './typo';

const createTypographyClasses = <Tokens extends Record<string, Parameters<typeof style>[0]>>(
  tokens: Tokens,
) => {
  const result = {} as { [Key in keyof Tokens]: string };

  for (const key in tokens) {
    if (Object.prototype.hasOwnProperty.call(tokens, key)) {
      const typedKey = key as keyof Tokens;
      result[typedKey] = style(tokens[typedKey]);
    }
  }

  return result;
};

export const typography = createTypographyClasses(typoData);
