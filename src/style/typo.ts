import { CSSObject } from '@emotion/styled';

const baseStyles: CSSObject = {
  lineHeight: '150%',
  letterSpacing: 0,
};

export const typoWeights = {
  B: 700,
  SB: 600,
  M: 500,
  R: 400,
} as const;

export const typography: { [key: string]: CSSObject } = {
  titleB: { ...baseStyles, fontSize: '32px', fontWeight: typoWeights.B },
  titleM: { ...baseStyles, fontSize: '32px', fontWeight: typoWeights.M },
  titleSmallB: { ...baseStyles, fontSize: '22px', fontWeight: typoWeights.B },
  titleSmallM: { ...baseStyles, fontSize: '20px', fontWeight: typoWeights.M },
  bodyLargeB: { ...baseStyles, fontSize: '18px', fontWeight: typoWeights.B },
  bodyLargeM: { ...baseStyles, fontSize: '18px', fontWeight: typoWeights.M },
  bodyB: { ...baseStyles, fontSize: '16px', fontWeight: typoWeights.B },
  bodySB: { ...baseStyles, fontSize: '16px', fontWeight: typoWeights.SB },
  bodyM: { ...baseStyles, fontSize: '16px', fontWeight: typoWeights.M },
  bodyR: { ...baseStyles, fontSize: '16px', fontWeight: typoWeights.R },
  bodySmallSB: { ...baseStyles, fontSize: '14px', fontWeight: typoWeights.SB },
  bodySmallM: { ...baseStyles, fontSize: '14px', fontWeight: typoWeights.M },
  bodySmallR: { ...baseStyles, fontSize: '14px', fontWeight: typoWeights.R },
  captionB: { ...baseStyles, fontSize: '12px', fontWeight: typoWeights.B },
  captionR: { ...baseStyles, fontSize: '12px', fontWeight: typoWeights.R },
} as const;
