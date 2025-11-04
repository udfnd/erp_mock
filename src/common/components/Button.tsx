'use client';

import { clsx } from 'clsx';
import React, { ReactNode } from 'react';

import {
  buttonBaseStyles,
  buttonRecipe,
  iconWrapper,
  type ButtonRecipeOptions,
} from './Button.style.css';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonRecipeOptions & {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    children?: ReactNode;
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
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const recipeClasses = buttonRecipe({
      styleType,
      variant,
      size,
      iconOnly,
      disabled,
    });

    const finalClassName = clsx(buttonBaseStyles, recipeClasses, className);

    return (
      <button ref={ref} type="button" className={finalClassName} disabled={disabled} {...props}>
        {iconLeft && !iconOnly && <span className={iconWrapper}>{iconLeft}</span>}
        {!iconOnly && children}
        {iconOnly && (children || iconRight || iconLeft)}
        {iconRight && !iconOnly && <span className={iconWrapper}>{iconRight}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
