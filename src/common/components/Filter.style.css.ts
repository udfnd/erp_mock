import { css, cx } from '@emotion/css';

import { color, typography } from '@/style';

export const filterBaseStyles = css({
  ...typography.bodyM,
  boxSizing: 'border-box',
  display: 'inline-flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  isolation: 'isolate',
  flexGrow: 0,
  flexShrink: 0,
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  '&:disabled': {
    cursor: 'not-allowed',
  },
});

const styleTypeStyles = {
  solid: css({}),
  outlined: css({}),
} as const;

const sizeStyles = {
  large: css({
    height: '36px',
    padding: '6px 12px',
    gap: '4px',
    borderRadius: '10px',
  }),
  medium: css({
    height: '35px',
    padding: '6px 10px',
    gap: '4px',
    borderRadius: '8px',
  }),
  small: css({
    height: '30px',
    padding: '3px 8px',
    gap: '4px',
    borderRadius: '6px',
  }),
} as const;

const solidStateStyles = {
  inactive: css({
    background: color.cgrey100,
    color: color.cgrey700,
    '&:not(:disabled):hover': {
      background: color.cgrey200,
    },
    '&:not(:disabled):active': {
      background: color.cgrey300,
    },
  }),
  active: css({
    background: color.cgrey700,
    color: color.white,
    '&:not(:disabled):hover': {
      background: color.cgrey600,
    },
    '&:not(:disabled):active': {
      background: color.black,
    },
  }),
} as const;

const outlinedStateStyles = {
  inactive: css({
    background: color.white,
    color: color.cgrey700,
    borderColor: color.cgrey200,
    '&:not(:disabled):hover': {
      background: color.cgrey50,
    },
    '&:not(:disabled):active': {
      background: color.cgrey100,
    },
  }),
  active: css({
    background: color.blue50,
    color: color.blue,
    borderColor: color.blue,
    '&:not(:disabled):hover': {
      background: color.blue100,
    },
    '&:not(:disabled):active': {
      background: color.blue200,
    },
  }),
} as const;

const disabledStyles = {
  solid: css({
    background: color.cgrey100,
    color: color.cgrey300,
  }),
  outlined: css({
    background: color.white,
    color: color.cgrey300,
    borderColor: color.cgrey100,
  }),
} as const;

export type FilterRecipeOptions = {
  styleType?: keyof typeof styleTypeStyles;
  size?: keyof typeof sizeStyles;
  active?: boolean;
  disabled?: boolean;
};

export const filterRecipe = ({
  styleType = 'solid',
  size = 'medium',
  active = false,
  disabled = false,
}: FilterRecipeOptions = {}) => {
  const stateKey = active ? 'active' : 'inactive';
  const stateStyles =
    styleType === 'solid' ? solidStateStyles[stateKey] : outlinedStateStyles[stateKey];

  const classes = [
    styleTypeStyles[styleType],
    sizeStyles[size],
    disabled ? disabledStyles[styleType] : stateStyles,
  ];

  return cx(...classes);
};

export const iconWrapper = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
