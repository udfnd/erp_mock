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

export const photoBase = css({
  display: 'block',
  borderRadius: '50%',
  borderWidth: '1px',
  borderStyle: 'solid',
  backgroundColor: color.cgrey100,
  flexShrink: 0,
  objectFit: 'cover',
});

const photoSizeStyles = {
  large: css({ width: 48, height: 48 }),
  medium: css({ width: 32, height: 32 }),
  small: css({ width: 16, height: 16 }),
} as const;

const photoVariantStyles = {
  default: css({ borderColor: color.cgrey100 }),
  active: css({ borderColor: color.blue }),
} as const;

export type PhotoRecipeOptions = {
  size?: keyof typeof photoSizeStyles;
  variant?: keyof typeof photoVariantStyles;
};

export const photoRecipe = ({
  size = 'medium',
  variant = 'default',
}: PhotoRecipeOptions = {}): IT[] => {
  return [photoSizeStyles[size], photoVariantStyles[variant]];
};

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
