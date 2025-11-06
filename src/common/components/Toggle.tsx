'use client';

import React, { useState } from 'react';
import { handleRecipe, toggleRecipe, type ToggleRecipeOptions } from './Toggle.style';

export type ToggleProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> &
  ToggleRecipeOptions & {
    onChange?: (isActive: boolean) => void;
    initialActive?: boolean;
  };

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      size = 'md',
      active: controlledActive,
      disabled = false,
      className,
      onChange,
      initialActive = false,
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

    const toggleStyles = toggleRecipe({ size, active, disabled });
    const handleStyles = handleRecipe({ size, active });

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={active}
        css={toggleStyles}
        className={className}
        onClick={handleToggle}
        disabled={disabled}
        {...props}
      >
        <span css={handleStyles} />
      </button>
    );
  },
);

Toggle.displayName = 'Toggle';
