'use client';

import { clsx } from 'clsx';
import React, { ReactNode } from 'react';

import { StateDown, StateUp } from '@/components/icons';

import {
  filterBaseStyles,
  filterRecipe,
  iconWrapper,
  type FilterRecipeOptions,
} from './Filter.style.css';

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
    const recipeClasses = filterRecipe({
      styleType,
      size,
      active,
      disabled,
    });

    const finalClassName = clsx(filterBaseStyles, recipeClasses, className);

    return (
      <button ref={ref} type="button" className={finalClassName} disabled={disabled} {...props}>
        {iconLeft && <span className={iconWrapper}>{iconLeft}</span>}
        {children}
        <span className={iconWrapper}>{active ? <StateUp /> : <StateDown />}</span>
      </button>
    );
  },
);

Filter.displayName = 'Filter';
