'use client';

import React, { ReactNode } from 'react';
import {
  buttonBaseStyles,
  buttonRecipe,
  iconWrapper,
  type ButtonRecipeOptions,
} from './Button.style';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonRecipeOptions & {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    children?: ReactNode;
    isFull?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      styleType = 'solid',
      variant = 'primary',
      size = 'medium',
      iconLeft,
      iconRight,
      iconOnly = false,
      disabled = false,
      isFull = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const recipeStyles = buttonRecipe({ styleType, variant, size, iconOnly, disabled, isFull });

    return (
      <button
        ref={ref}
        type="button"
        css={[buttonBaseStyles, ...recipeStyles]}
        className={className}
        disabled={disabled}
        {...props}
      >
        {iconLeft && !iconOnly && <span css={iconWrapper}>{iconLeft}</span>}
        {!iconOnly && children}
        {iconOnly && (children || iconRight || iconLeft)}
        {iconRight && !iconOnly && <span css={iconWrapper}>{iconRight}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
