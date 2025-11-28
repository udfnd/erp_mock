'use client';

import { clsx } from 'clsx';
import React, { forwardRef, useId } from 'react';

import { cssObj, helperTextRecipe, inputWrapperRecipe } from './Textfield.style';

type InputWrapperOptions = Exclude<Parameters<typeof inputWrapperRecipe>[0], undefined>;
type HelperTextOptions = Exclude<Parameters<typeof helperTextRecipe>[0], undefined>;

type InputWrapperStatus = NonNullable<InputWrapperOptions['status']>;
type HelperTextStatus = NonNullable<HelperTextOptions['status']>;

type BaseInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'onChange' | 'defaultValue' | 'value'
>;

export type LabeledInputProps = BaseInputProps & {
  label?: string;
  required?: boolean;
  value: string;
  onValueChange?: (value: string) => void;
  helperText?: string;
  status?: InputWrapperStatus;
  containerClassName?: string;
};

export const LabeledInput = forwardRef<HTMLInputElement, LabeledInputProps>(
  (
    {
      label,
      required = false,
      value,
      onValueChange,
      helperText,
      status = 'normal',
      disabled = false,
      className,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const inputWrapperClasses = inputWrapperRecipe({ status, disabled });
    const helperTextClasses = helperTextRecipe({ status: status as HelperTextStatus });

    return (
      <div css={clsx(cssObj.container, containerClassName)}>
        {label ? (
          <label htmlFor={id} css={cssObj.labelWrapper}>
            <span css={cssObj.label}>{label}</span>
            {required ? <span css={cssObj.requiredAsterisk}>*</span> : null}
          </label>
        ) : null}
        <div css={clsx(inputWrapperClasses, className)}>
          <input
            id={id}
            ref={ref}
            css={cssObj.inputSingleLine}
            value={value ?? ''}
            onChange={(e) => onValueChange?.(e.target.value)}
            disabled={disabled}
            {...props}
          />
        </div>
        {helperText ? <span css={helperTextClasses}>{helperText}</span> : null}
      </div>
    );
  },
);

LabeledInput.displayName = 'LabeledInput';
