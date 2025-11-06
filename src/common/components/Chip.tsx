'use client';

import React, { ReactNode } from 'react';
import { chipBaseStyles, chipIconWrapper, chipRecipe, type ChipRecipeOptions } from './Chip.style';

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
    const recipeStyles = chipRecipe({ variant, size, active, disabled });

    return (
      <button
        ref={ref}
        type="button"
        css={[chipBaseStyles, ...recipeStyles]}
        className={className}
        disabled={disabled}
        {...props}
      >
        {iconLeft && <span css={chipIconWrapper}>{iconLeft}</span>}
        {children}
        {iconRight && <span css={chipIconWrapper}>{iconRight}</span>}
      </button>
    );
  },
);

Chip.displayName = 'Chip';
export default Chip;
