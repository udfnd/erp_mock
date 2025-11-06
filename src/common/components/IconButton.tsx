'use client';

import React from 'react';
import {
  buttonBaseStyles,
  iconButtonRecipe,
  type IconButtonRecipeOptions,
} from './IconButton.style';

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  IconButtonRecipeOptions & {
    children: React.ReactNode;
  };

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { styleType = 'normal', size = 'default', disabled = false, children, className, ...props },
    ref,
  ) => {
    const recipeStyles = iconButtonRecipe({ styleType, size, disabled });

    return (
      <button
        ref={ref}
        type="button"
        css={[buttonBaseStyles, ...recipeStyles]}
        className={className}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
