'use client';

import { clsx } from 'clsx';
import React, { ReactNode } from 'react';

import { chipBaseStyles, chipRecipe, chipIconWrapper } from './Chip.style.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';

type ChipVariants = RecipeVariants<typeof chipRecipe>;

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ChipVariants & {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    children?: ReactNode;
  };

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      active = false,
      disabled = false,
      iconLeft,
      iconRight,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const recipeClasses = chipRecipe({ variant, size, active, disabled });
    const finalClassName = clsx(chipBaseStyles, recipeClasses, className);

    return (
      <button ref={ref} type="button" className={finalClassName} disabled={disabled} {...props}>
        {iconLeft && <span className={chipIconWrapper}>{iconLeft}</span>}
        {children}
        {iconRight && <span className={chipIconWrapper}>{iconRight}</span>}
      </button>
    );
  },
);

Chip.displayName = 'Chip';
export default Chip;
