import { css, type Interpolation, type Theme } from '@emotion/react';
import { color } from '@/style';

export const buttonBaseStyles = css({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid transparent',
  padding: 0,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textDecoration: 'none',
  flexShrink: 0,
  color: color.cgrey700,
  '&:disabled': {
    cursor: 'not-allowed',
  },
});

const styleTypeStyles = {
  normal: css({
    background: 'transparent',
  }),
  solid: css({
    borderRadius: '1000px',
    background: color.blue,
    color: color.white,
  }),
  outlined: css({
    borderRadius: '1000px',
    background: color.white,
    borderColor: color.cgrey200,
    color: color.cgrey700,
  }),
  background: css({
    background: color.cgrey50,
    borderRadius: '4px',
  }),
} as const;

export type IconButtonStyleType = keyof typeof styleTypeStyles;
export type IconButtonSize = 'default' | 'medium' | 'small' | 'micro';

type IT = Interpolation<Theme>;

const sizeStylesByType: Record<IconButtonStyleType, Partial<Record<IconButtonSize, IT>>> = {
  normal: {
    default: css({ width: 24, height: 24, color: color.cgrey500 }),
    small: css({ width: 20, height: 20, color: color.cgrey500 }),
  },
  background: {
    default: css({ width: 24, height: 24, color: color.cgrey500 }),
    small: css({ width: 20, height: 20, color: color.cgrey500 }),
  },
  solid: {
    default: css({ width: 40, height: 40, padding: 8 }),
    medium: css({ width: 32, height: 32, padding: 4 }),
    small: css({ width: 24, height: 24, padding: 4 }),
    micro: css({ width: 16, height: 16, padding: 2 }),
  },
  outlined: {
    default: css({ width: 40, height: 40, padding: 8 }),
    medium: css({ width: 32, height: 32, padding: 4 }),
    small: css({ width: 24, height: 24, padding: 4 }),
    micro: css({ width: 16, height: 16, padding: 2 }),
  },
};

const interactiveStyles: Record<IconButtonStyleType, IT> = {
  normal: css({
    '&:not(:disabled):hover': { background: color.cgrey50 },
    '&:not(:disabled):active': { background: color.cgrey100 },
  }),
  background: css({
    '&:not(:disabled):hover': { background: color.cgrey100 },
    '&:not(:disabled):active': { background: color.cgrey200 },
  }),
  solid: css({
    '&:not(:disabled):hover': { background: color.blue600 },
    '&:not(:disabled):active': {
      background: color.blue,
      boxShadow: 'inset 0 0 100px 100px rgba(0, 0, 0, 0.2)',
    },
  }),
  outlined: css({
    '&:not(:disabled):hover': { background: color.cgrey50 },
    '&:not(:disabled):active': { background: color.cgrey100 },
  }),
};

const disabledStyles: Record<IconButtonStyleType, IT> = {
  normal: css({ color: color.cgrey300, background: 'transparent' }),
  background: css({ color: color.cgrey300, background: color.cgrey50 }),
  solid: css({ background: color.cgrey100, color: color.cgrey300 }),
  outlined: css({ background: color.white, color: color.cgrey300, borderColor: color.cgrey100 }),
};

export type IconButtonRecipeOptions = {
  styleType?: IconButtonStyleType;
  size?: IconButtonSize;
  disabled?: boolean;
};

export const iconButtonRecipe = ({
  styleType = 'normal',
  size = 'default',
  disabled = false,
}: IconButtonRecipeOptions = {}): IT[] => {
  return [
    styleTypeStyles[styleType],
    sizeStylesByType[styleType][size],
    disabled ? disabledStyles[styleType] : interactiveStyles[styleType],
  ].filter(Boolean) as IT[];
};
