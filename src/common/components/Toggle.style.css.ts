import { css, cx } from '@emotion/css';

import { color, shadow } from '@/style';

export const toggleContainer = css({
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: '9999px',
  position: 'relative',
  transition: 'background-color 0.2s ease, opacity 0.2s ease',
  boxSizing: 'border-box',
  padding: '2px',
  border: 'none',
});

export const toggleHandle = css({
  display: 'block',
  backgroundColor: color.white,
  borderRadius: '50%',
  position: 'absolute',
  top: '2px',
  left: '2px',
  transition: 'transform 0.2s ease',
  boxShadow: shadow.sm,
});

const toggleSizeStyles = {
  sm: css({ width: 40, height: 24 }),
  md: css({ width: 52, height: 32 }),
} as const;

const toggleActiveStyles = {
  active: css({ backgroundColor: color.blue }),
  inactive: css({ backgroundColor: color.cgrey200 }),
} as const;

const toggleDisabledStyles = {
  disabled: css({ opacity: 0.5, cursor: 'not-allowed' }),
  enabled: css({}),
} as const;

export type ToggleRecipeOptions = {
  size?: keyof typeof toggleSizeStyles;
  active?: boolean;
  disabled?: boolean;
};

export const toggleRecipe = ({
  size = 'md',
  active = false,
  disabled = false,
}: ToggleRecipeOptions = {}) =>
  cx(
    toggleContainer,
    toggleSizeStyles[size],
    toggleActiveStyles[active ? 'active' : 'inactive'],
    toggleDisabledStyles[disabled ? 'disabled' : 'enabled'],
  );

const handleSizeStyles = {
  sm: css({ width: 20, height: 20 }),
  md: css({ width: 28, height: 28 }),
} as const;

const handleInactiveStyle = css({ transform: 'translateX(0)' });

const handleActiveTranslations = {
  sm: css({ transform: `translateX(${40 - 20 - 4}px)` }),
  md: css({ transform: `translateX(${52 - 28 - 4}px)` }),
} as const;

export type HandleRecipeOptions = {
  size?: keyof typeof handleSizeStyles;
  active?: boolean;
};

export const handleRecipe = ({
  size = 'md',
  active = false,
}: HandleRecipeOptions = {}) =>
  cx(toggleHandle, handleSizeStyles[size], active ? handleActiveTranslations[size] : handleInactiveStyle);
