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
} from '@/design/components/Textfield.style.css';

type InputWrapperOptions = Exclude<Parameters<typeof inputWrapperRecipe>[0], undefined>;
type HelperTextOptions = Exclude<Parameters<typeof helperTextRecipe>[0], undefined>;

type InputWrapperStatus = NonNullable<InputWrapperOptions['status']>;
type HelperTextStatus = NonNullable<HelperTextOptions['status']>;

type BaseInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'onChange' | 'defaultValue'
>;

export type LabeledInputProps = BaseInputProps & {
  label?: string;
  required?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  helperText?: string;
  status?: InputWrapperStatus;
  containerClassName?: string;
};

const LabeledInput = forwardRef<HTMLInputElement, LabeledInputProps>(
  (
    {
      label,
      required = false,
      value,
      onValueChange,
      defaultValue,
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
      <div className={clsx(container, containerClassName)}>
        {label ? (
          <label htmlFor={id} className={labelWrapper}>
            <span className={labelStyle}>{label}</span>
            {required ? <span className={requiredAsterisk}>*</span> : null}
          </label>
        ) : null}
        <div className={clsx(inputWrapperClasses, className)}>
          <input
            id={id}
            ref={ref}
            className={inputRecipe()}
            value={value ?? ''}
            defaultValue={defaultValue}
            onChange={(event) => onValueChange?.(event.target.value)}
            disabled={disabled}
            {...props}
          />
        </div>
        {helperText ? <span className={helperTextClasses}>{helperText}</span> : null}
      </div>
    );
  },
);

LabeledInput.displayName = 'LabeledInput';

export default LabeledInput;
