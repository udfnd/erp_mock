'use client';

import { clsx } from 'clsx';
import React from 'react';

import { buttonBaseStyles, iconButtonRecipe } from './IconButton.style.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';


type IconButtonRecipeVariants = RecipeVariants<typeof iconButtonRecipe>;

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  IconButtonRecipeVariants & {
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
