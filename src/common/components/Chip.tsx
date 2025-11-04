'use client';

import { clsx } from 'clsx';
import React, { ReactNode } from 'react';

import {
  chipBaseStyles,
  chipIconWrapper,
  chipRecipe,
  type ChipRecipeOptions,
} from './Chip.style.css';

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ChipRecipeOptions & {
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
