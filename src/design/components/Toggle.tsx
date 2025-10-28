// src/design/components/Toggle.tsx
'use client';

import { clsx } from 'clsx';
import React, { useState } from 'react';

import { handleRecipe, toggleRecipe } from './Toggle.style.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';

type ToggleRecipeVariants = RecipeVariants<typeof toggleRecipe>;
type HandleRecipeVariants = RecipeVariants<typeof handleRecipe>;

export type ToggleProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> &
  ToggleRecipeVariants & {
    onChange?: (isActive: boolean) => void;
    initialActive?: boolean; // For uncontrolled state
  };

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      size = 'md',
      active: controlledActive, // Rename prop for clarity
      disabled = false,
      className,
      onChange,
      initialActive = false, // Default initial state for uncontrolled
      ...props
    },
    ref,
  ) => {
    const [uncontrolledActive, setUncontrolledActive] = useState(initialActive);
    const isControlled = controlledActive !== undefined;
    const active = isControlled ? controlledActive : uncontrolledActive;

    const handleToggle = () => {
      if (disabled) return;
      const newState = !active;
      if (!isControlled) {
        setUncontrolledActive(newState);
      }
      onChange?.(newState);
    };

    const toggleClasses = toggleRecipe({
      size,
      active,
      disabled,
    });
    const handleClasses = handleRecipe({
      size,
      active,
    });

    const finalClassName = clsx(toggleClasses, className);

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={active}
        className={finalClassName}
        onClick={handleToggle}
        disabled={disabled}
        {...props}
      >
        <span className={handleClasses} />
      </button>
    );
  },
);

Toggle.displayName = 'Toggle';
