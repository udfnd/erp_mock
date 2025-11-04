'use client';

import { clsx } from 'clsx';
import React from 'react';

import {
  buttonBaseStyles,
  iconButtonRecipe,
  type IconButtonRecipeOptions,
} from './IconButton.style.css';

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  IconButtonRecipeOptions & {
    children: React.ReactNode;
  };

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { styleType = 'normal', size = 'default', disabled = false, children, className, ...props },
    ref,
  ) => {
    const recipeClasses = iconButtonRecipe({
      styleType,
      size,
      disabled,
    });

    const finalClassName = clsx(buttonBaseStyles, recipeClasses, className);

    return (
      <button ref={ref} type="button" className={finalClassName} disabled={disabled} {...props}>
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
