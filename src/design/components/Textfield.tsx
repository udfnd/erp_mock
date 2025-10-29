'use client';

import { clsx } from 'clsx';
import React, { ReactNode, useState, useId } from 'react';

import {
  container,
  labelWrapper,
  label as labelStyle,
  requiredAsterisk,
  inputWrapperRecipe,
  textareaRecipe,
  footer,
  counter,
  actionButtonStyle,
  helperTextRecipe,
} from './Textfield.style.css';

type InputWrapperOptions = Exclude<Parameters<typeof inputWrapperRecipe>[0], undefined>;
type TextareaOptions = Exclude<Parameters<typeof textareaRecipe>[0], undefined>;
type HelperTextOptions = Exclude<Parameters<typeof helperTextRecipe>[0], undefined>;

type InputWrapperStatus = NonNullable<InputWrapperOptions['status']>;
type TextareaResize = NonNullable<TextareaOptions['resize']>;
type HelperTextStatus = NonNullable<HelperTextOptions['status']>;

export type TextfieldProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'onChange' | 'size'
> & {
  label?: string;
  required?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  maxLength?: number;
  actionButton?: ReactNode;
  onActionButtonClick?: () => void;
  helperText?: string;
  status?: InputWrapperStatus;
  resize?: TextareaResize;
  disabled?: boolean;
  className?: string;
};

export const Textfield = React.forwardRef<HTMLTextAreaElement, TextfieldProps>(
  (
    {
      label,
      required = false,
      value: controlledValue,
      onValueChange,
      defaultValue = '',
      maxLength,
      actionButton,
      onActionButtonClick,
      helperText,
      status = 'normal',
      resize = 'normal',
      disabled = false,
      className,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const id = useId();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (!isControlled) setUncontrolledValue(newValue);
      onValueChange?.(newValue);
    };

    const inputWrapperClasses = inputWrapperRecipe({ status, disabled });
    const textareaClasses = textareaRecipe({ resize });
    const helperTextClasses = helperTextRecipe({ status: status as HelperTextStatus });

    return (
      <div className={clsx(container, className)}>
        {label && (
          <label htmlFor={id} className={labelWrapper}>
            <span className={labelStyle}>{label}</span>
            {required && <span className={requiredAsterisk}>*</span>}
          </label>
        )}
        <div className={inputWrapperClasses}>
          <textarea
            ref={ref}
            id={id}
            className={textareaClasses}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            {...props}
          />
          {(maxLength || actionButton) && (
            <div className={footer}>
              <span className={counter}>{maxLength ? `${value.length}/${maxLength}` : null}</span>
              {actionButton && (
                <button
                  type="button"
                  className={actionButtonStyle}
                  onClick={onActionButtonClick}
                  disabled={disabled}
                >
                  {actionButton}
                </button>
              )}
            </div>
          )}
        </div>
        {helperText && <span className={helperTextClasses}>{helperText}</span>}
      </div>
    );
  },
);

Textfield.displayName = 'Textfield';
