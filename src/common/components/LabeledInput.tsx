'use client';

import { clsx } from 'clsx';
import React, { forwardRef, useId } from 'react';

import {
  container,
  helperTextRecipe,
  inputRecipe,
  inputWrapperRecipe,
  label as labelStyle,
  labelWrapper,
  requiredAsterisk,
} from './Textfield.style';

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
      <div css={clsx(container, containerClassName)}>
        {label ? (
          <label htmlFor={id} css={labelWrapper}>
            <span css={labelStyle}>{label}</span>
            {required ? <span css={requiredAsterisk}>*</span> : null}
          </label>
        ) : null}
        <div css={clsx(inputWrapperClasses, className)}>
          <input
            id={id}
            ref={ref}
            css={inputRecipe}
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
