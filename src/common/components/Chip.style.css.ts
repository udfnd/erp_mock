import { css, cx } from '@emotion/css';

import { color, typography } from '@/style';

export const chipBaseStyles = css({
  boxSizing: 'border-box',
  display: 'inline-flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px',
  isolation: 'isolate',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  border: '1px solid transparent',
  '&:disabled': {
    cursor: 'not-allowed',
  },
});

const solidGradient =
  'linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), linear-gradient(0deg, rgba(0, 0, 0, 0.53), rgba(0, 0, 0, 0.53)), #0A3FFF';

const sizeStyles = {
  lg: css({
    ...typography.bodyB,
    height: '36px',
    padding: '6px 12px',
    borderRadius: '10px',
  }),
  md: css({
    ...typography.bodySmallSB,
    height: '32px',
    padding: '6px 10px 5px',
    borderRadius: '8px',
  }),
  sm: css({
    ...typography.captionB,
    height: '24px',
    padding: '3px 8px',
    borderRadius: '6px',
  }),
} as const;

const variantStyles = {
  solid: css({}),
  outlined: css({
    background: 'transparent',
  }),
} as const;

const solidStateStyles = {
  inactive: css({
    background: solidGradient,
    color: color.white,
    '&:not(:disabled):hover': { background: color.blue600 },
    '&:not(:disabled):active': { background: color.blue600 },
  }),
  active: css({
    background: color.black,
    color: color.white,
    '&:not(:disabled):hover': { background: color.black },
    '&:not(:disabled):active': { background: color.black },
  }),
} as const;

const outlinedStateStyles = {
  inactive: css({
    background: 'transparent',
    color: color.cgrey500,
    borderColor: color.cgrey200,
    '&:not(:disabled):hover': { background: color.cgrey50 },
    '&:not(:disabled):active': { background: color.cgrey100 },
  }),
  active: css({
    background: 'transparent',
    color: color.blue,
    borderColor: color.blue,
    '&:not(:disabled):hover': { background: 'transparent' },
    '&:not(:disabled):active': { background: 'transparent' },
  }),
} as const;

const disabledStyles = {
  solid: css({
    background: color.cgrey100,
    color: color.cgrey300,
    borderColor: 'transparent',
  }),
  outlined: css({
    background: 'transparent',
    color: color.cgrey300,
    borderColor: color.cgrey100,
  }),
} as const;

export type ChipRecipeOptions = {
  size?: keyof typeof sizeStyles;
  variant?: keyof typeof variantStyles;
  active?: boolean;
  disabled?: boolean;
};

export const chipRecipe = ({
  size = 'md',
  variant = 'solid',
  active = false,
  disabled = false,
}: ChipRecipeOptions = {}) => {
  const stateKey = active ? 'active' : 'inactive';
  const stateStyles =
    variant === 'solid' ? solidStateStyles[stateKey] : outlinedStateStyles[stateKey];

  const classes = [
    sizeStyles[size],
    variantStyles[variant],
    disabled ? disabledStyles[variant] : stateStyles,
  ];

  return cx(...classes);
};

export const chipIconWrapper = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
