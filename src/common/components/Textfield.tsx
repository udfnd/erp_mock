'use client';

import { clsx } from 'clsx';
import React, { ReactNode, useId } from 'react';

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
  value: string | null;
  onValueChange?: (value: string) => void;
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
      value,
      onValueChange,
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
    const id = useId();
    const inputWrapperClasses = inputWrapperRecipe({ status, disabled });
    const textareaClasses = textareaRecipe({ resize });
    const helperTextClasses = helperTextRecipe({ status: status as HelperTextStatus });
    const safeValue = value ?? '';

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
            value={safeValue}
            onChange={(e) => onValueChange?.(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            {...props}
          />
          {(maxLength || actionButton) && (
            <div className={footer}>
              <span className={counter}>
                {maxLength ? `${safeValue.length}/${maxLength}` : null}
              </span>
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
export default Textfield;
