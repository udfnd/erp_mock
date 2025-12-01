'use client';

import { useId } from 'react';

import { cssObj } from './DatePicker.style';

export type DatePickerProps = {
  label?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
};

export function DatePicker({
  label,
  value,
  placeholder,
  required,
  disabled,
  min,
  max,
  onChange,
}: DatePickerProps) {
  const inputId = useId();

  return (
    <div css={cssObj.container}>
      {label ? (
        <label htmlFor={inputId} css={cssObj.label}>
          {label}
          {required ? <span css={cssObj.required}>*</span> : null}
        </label>
      ) : null}
      <input
        id={inputId}
        type="date"
        css={cssObj.input}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
