import { recipe } from '@vanilla-extract/recipes';

import { themeVars } from '@/design/theme.css';
import { typography } from '@/design/typo.css';

export const containerRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  variants: {
    size: {
      large: {
        gap: themeVars.spacing.sm,
      },
      medium: {
        gap: themeVars.spacing.sm,
      },
      small: {
        gap: themeVars.spacing.xs,
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export const photoRecipe = recipe({
  base: {
    display: 'block',
    borderRadius: '50%',
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: themeVars.palette.cgrey100,
    flexShrink: 0,
    objectFit: 'cover',
  },
  variants: {
    size: {
      large: {
        width: 48,
        height: 48,
      },
      medium: {
        width: 32,
        height: 32,
      },
      small: {
        width: 16,
        height: 16,
      },
    },
    variant: {
      default: {
        borderColor: themeVars.palette.cgrey100,
      },
      active: {
        borderColor: themeVars.palette.blue,
      },
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'default',
  },
});

export const nameRecipe = recipe({
  base: {
    color: themeVars.palette.cgrey700,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  variants: {
    size: {
      large: [typography.bodyB],
      medium: [typography.bodyM],
      small: [typography.captionR],
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});
