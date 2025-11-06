import { css, type Interpolation, type Theme } from '@emotion/react';
import { color, spacing, typography } from '@/style';

export const containerBase = css({
  display: 'inline-flex',
  alignItems: 'center',
});

const containerSizeStyles = {
  large: css({ gap: spacing.sm }),
  medium: css({ gap: spacing.sm }),
  small: css({ gap: spacing.xs }),
} as const;

export type ContainerRecipeOptions = {
  size?: keyof typeof containerSizeStyles;
};

type IT = Interpolation<Theme>;

export const containerRecipe = ({ size = 'medium' }: ContainerRecipeOptions = {}): IT[] => {
  return [containerSizeStyles[size]];
};

export const photoWrapperBase = css({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '50%',
  borderWidth: 1,
  borderStyle: 'solid',
  backgroundColor: color.cgrey100,
  flexShrink: 0,
});

const photoWrapperSizeStyles = {
  large: css({ width: 48, height: 48 }),
  medium: css({ width: 32, height: 32 }),
  small: css({ width: 16, height: 16 }),
} as const;

const photoWrapperVariantStyles = {
  default: css({ borderColor: color.cgrey100 }),
  active: css({ borderColor: color.blue }),
} as const;

export type PhotoRecipeOptions = {
  size?: keyof typeof photoWrapperSizeStyles;
  variant?: keyof typeof photoWrapperVariantStyles;
};

export const photoWrapperRecipe = ({
  size = 'medium',
  variant = 'default',
}: PhotoRecipeOptions = {}): IT[] => {
  return [photoWrapperSizeStyles[size], photoWrapperVariantStyles[variant]];
};

export const photoBase = css({
  objectFit: 'cover',
});

export const nameBase = css({
  color: color.cgrey700,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const nameSizeStyles = {
  large: css({ ...typography.bodyB }),
  medium: css({ ...typography.bodyM }),
  small: css({ ...typography.captionR }),
} as const;

export type NameRecipeOptions = {
  size?: keyof typeof nameSizeStyles;
};

export const nameRecipe = ({ size = 'medium' }: NameRecipeOptions = {}): IT[] => {
  return [nameSizeStyles[size]];
};
