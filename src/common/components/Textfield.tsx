'use client';

import React, { ReactNode, useId } from 'react';

import {
  actionButtonStyle,
  container,
  counter,
  footer,
  helperTextRecipe,
  inputWrapperRecipe,
  label as labelStyle,
  labelWrapper,
  requiredAsterisk,
  textareaRecipe,
  type InputWrapperRecipeOptions,
  type TextareaRecipeOptions,
} from './Textfield.style';

type InputWrapperStatus = NonNullable<InputWrapperRecipeOptions['status']>;
type TextareaResize = NonNullable<TextareaRecipeOptions['resize']>;

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
    const inputWrapperStyles = inputWrapperRecipe({ status, disabled });
    const textareaStyles = textareaRecipe({ resize });
    const helperTextStyles = helperText ? helperTextRecipe({ status }) : undefined;
    const safeValue = value ?? '';

    return (
      <div css={[container]} className={className}>
        {label && (
          <label htmlFor={id} css={labelWrapper}>
            <span css={labelStyle}>{label}</span>
            {required && <span css={requiredAsterisk}>*</span>}
          </label>
        )}
        <div css={inputWrapperStyles}>
          <textarea
            ref={ref}
            id={id}
            css={textareaStyles}
            value={safeValue}
            onChange={(e) => onValueChange?.(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            {...props}
          />
          {(maxLength || actionButton) && (
            <div css={footer}>
              <span css={counter}>{maxLength ? `${safeValue.length}/${maxLength}` : null}</span>
              {actionButton && (
                <button
                  type="button"
                  css={actionButtonStyle}
                  onClick={onActionButtonClick}
                  disabled={disabled}
                >
                  {actionButton}
                </button>
              )}
            </div>
          )}
        </div>
        {helperText && helperTextStyles && <span css={helperTextStyles}>{helperText}</span>}
      </div>
    );
  },
);

Textfield.displayName = 'Textfield';
export default Textfield;
