import { css, cx } from '@emotion/css';

import { color, typography } from '@/style';

export const buttonBaseStyles = css({
  ...typography.bodyB,
  border: '1px solid transparent',
  borderRadius: '8px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  '&:disabled': {
    cursor: 'not-allowed',
  },
});

const styleTypeStyles = {
  solid: css({}),
  outlined: css({
    background: 'transparent',
  }),
  text: css({
    background: 'transparent',
  }),
} as const;

const sizeStyles = {
  large: css({
    height: '48px',
    paddingLeft: '24px',
    paddingRight: '24px',
    gap: '8px',
  }),
  medium: css({
    height: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
    gap: '8px',
  }),
  small: css({
    height: '32px',
    paddingLeft: '12px',
    paddingRight: '12px',
    gap: '4px',
  }),
} as const;

const iconOnlyBase = css({
  paddingLeft: 0,
  paddingRight: 0,
  aspectRatio: '1 / 1',
});

const iconOnlySizeStyles = {
  large: css({ width: '48px' }),
  medium: css({ width: '40px' }),
  small: css({ width: '32px' }),
} as const;

const solidVariantStyles = {
  primary: css({
    background: color.blue,
    color: color.white,
    '&:not(:disabled):hover': { background: color.blue600 },
    '&:not(:disabled):active': {
      background: color.blue,
      boxShadow: 'inset 0 0 100px 100px rgba(0, 0, 0, 0.2)',
    },
  }),
  secondary: css({
    background: color.blue100,
    color: color.blue,
    '&:not(:disabled):hover': { background: color.blue200 },
    '&:not(:disabled):active': {
      background: color.blue100,
      boxShadow: 'inset 0 0 100px 100px rgba(0, 0, 0, 0.1)',
    },
  }),
  assistive: css({
    background: color.cgrey50,
    color: color.cgrey500,
    '&:not(:disabled):hover': { background: color.cgrey100 },
    '&:not(:disabled):active': {
      background: color.cgrey50,
      boxShadow: 'inset 0 0 100px 100px rgba(0, 0, 0, 0.1)',
    },
  }),
} as const;

const outlinedVariantStyles = {
  primary: css({
    color: color.blue,
    borderColor: color.blue,
    '&:not(:disabled):hover': { background: color.blue50 },
    '&:not(:disabled):active': { background: color.blue100 },
  }),
  secondary: css({
    color: color.cgrey500,
    borderColor: color.cgrey200,
    '&:not(:disabled):hover': { background: color.cgrey50 },
    '&:not(:disabled):active': { background: color.cgrey100 },
  }),
  assistive: css({
    color: color.cgrey500,
    borderColor: color.cgrey200,
    '&:not(:disabled):hover': { background: color.cgrey50 },
    '&:not(:disabled):active': { background: color.cgrey100 },
  }),
} as const;

const textVariantStyles = {
  primary: css({
    color: color.blue,
    '&:not(:disabled):hover': { background: color.blue50 },
    '&:not(:disabled):active': { background: color.blue100 },
  }),
  secondary: css({
    color: color.cgrey500,
    '&:not(:disabled):hover': { background: color.cgrey50 },
    '&:not(:disabled):active': { background: color.cgrey100 },
  }),
  assistive: css({
    color: color.cgrey500,
    '&:not(:disabled):hover': { background: color.cgrey50 },
    '&:not(:disabled):active': { background: color.cgrey100 },
  }),
} as const;

const disabledStyles = {
  solid: css({
    background: color.cgrey100,
    color: color.cgrey300,
  }),
  outlined: css({
    background: 'transparent',
    color: color.cgrey300,
    borderColor: color.cgrey100,
  }),
  text: css({
    color: color.cgrey300,
  }),
} as const;

const variantStyles = {
  solid: solidVariantStyles,
  outlined: outlinedVariantStyles,
  text: textVariantStyles,
} as const;

export type ButtonRecipeOptions = {
  styleType?: keyof typeof styleTypeStyles;
  variant?: keyof typeof solidVariantStyles;
  size?: keyof typeof sizeStyles;
  iconOnly?: boolean;
  disabled?: boolean;
};

export const buttonRecipe = ({
  styleType = 'solid',
  variant = 'primary',
  size = 'medium',
  iconOnly = false,
  disabled = false,
}: ButtonRecipeOptions = {}) => {
  const classes = [
    styleTypeStyles[styleType],
    sizeStyles[size],
    iconOnly ? iconOnlyBase : null,
    iconOnly ? iconOnlySizeStyles[size] : null,
    disabled ? disabledStyles[styleType] : variantStyles[styleType][variant],
  ];

  return cx(...classes);
};

export const iconWrapper = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
