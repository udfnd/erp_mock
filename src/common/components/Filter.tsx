'use client';

import React, { ReactNode } from 'react';
import { StateDownIcon, StateUpIcon } from '@/common/icons';
import {
  filterBaseStyles,
  filterRecipe,
  iconWrapper,
  type FilterRecipeOptions,
} from './Filter.style';

export type FilterProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  FilterRecipeOptions & {
    iconLeft?: ReactNode;
    children?: ReactNode;
  };

export const Filter = React.forwardRef<HTMLButtonElement, FilterProps>(
  (
    {
      styleType = 'solid',
      size = 'medium',
      active = false,
      disabled = false,
      iconLeft,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const recipeStyles = filterRecipe({ styleType, size, active, disabled });

    return (
      <button
        ref={ref}
        type="button"
        css={[filterBaseStyles, ...recipeStyles]}
        className={className}
        disabled={disabled}
        {...props}
      >
        {iconLeft && <span css={iconWrapper}>{iconLeft}</span>}
        {children}
        <span css={iconWrapper}>{active ? <StateUpIcon /> : <StateDownIcon />}</span>
      </button>
    );
  },
);

Filter.displayName = 'Filter';
