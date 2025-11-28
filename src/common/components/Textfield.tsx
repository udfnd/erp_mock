'use client';

import React, { ReactNode } from 'react';
import {
  cssObj,
  helperTextRecipe,
  inputWrapperRecipe,
  textareaRecipe,
  type InputWrapperRecipeOptions,
  type TextareaRecipeOptions,
} from './Textfield.style';

type InputWrapperStatus = NonNullable<InputWrapperRecipeOptions['status']>;
type TextareaResize = NonNullable<TextareaRecipeOptions['resize']>;

type BaseProps = {
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
  singleLine?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  id?: string;
  width?: React.CSSProperties['width'];
};

type InputRest = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size'
>;

type TextareaRest = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'onChange' | 'size'
>;

type SingleLineProps = BaseProps & {
  singleLine: true;
} & InputRest;

type MultiLineProps = BaseProps & {
  singleLine?: false;
} & TextareaRest;

export type TextfieldProps = SingleLineProps | MultiLineProps;

export const Textfield = React.forwardRef<HTMLTextAreaElement | HTMLInputElement, TextfieldProps>(
  (props, ref) => {
    if (props.singleLine) {
      const {
        label,
        required = false,
        value,
        onValueChange,
        maxLength,
        actionButton,
        onActionButtonClick,
        helperText,
        status = 'normal',
        disabled = false,
        className,
        placeholder,
        id,
        width,
        singleLine,
        ...inputDomProps
      } = props as SingleLineProps;

      const safeValue = (value ?? '') as string;
      const inputWrapperStyles = inputWrapperRecipe({ status, disabled, singleLine: true });
      const helperTextStyles = helperText ? helperTextRecipe({ status }) : undefined;

      return (
        <div css={[cssObj.container]} className={className} style={width ? { width } : undefined}>
          {label &&
            (id ? (
              <label htmlFor={id} css={cssObj.labelWrapper}>
                <span css={cssObj.label}>{label}</span>
                {required && <span css={cssObj.requiredAsterisk}>*</span>}
              </label>
            ) : (
              <div css={cssObj.labelWrapper}>
                <span css={cssObj.label}>{label}</span>
                {required && <span css={cssObj.requiredAsterisk}>*</span>}
              </div>
            ))}

          <div css={inputWrapperStyles}>
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              id={id}
              css={cssObj.inputSingleLine}
              value={safeValue}
              onChange={(e) => onValueChange?.(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              disabled={disabled}
              {...inputDomProps}
            />
          </div>
          {helperText && helperTextStyles && <span css={helperTextStyles}>{helperText}</span>}
        </div>
      );
    }

    const {
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
      id,
      width,
      singleLine,
      ...textareaDomProps
    } = props as MultiLineProps;

    const safeValue = (value ?? '') as string;
    const inputWrapperStyles = inputWrapperRecipe({ status, disabled, singleLine: false });
    const helperTextStyles = helperText ? helperTextRecipe({ status }) : undefined;

    return (
      <div css={[cssObj.container]} className={className} style={width ? { width } : undefined}>
        {label &&
          (id ? (
            <label htmlFor={id} css={cssObj.labelWrapper}>
              <span css={cssObj.label}>{label}</span>
              {required && <span css={cssObj.requiredAsterisk}>*</span>}
            </label>
          ) : (
            <div css={cssObj.labelWrapper}>
              <span css={cssObj.label}>{label}</span>
              {required && <span css={cssObj.requiredAsterisk}>*</span>}
            </div>
          ))}

        <div css={inputWrapperStyles}>
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            id={id}
            css={textareaRecipe({ resize })}
            value={safeValue}
            onChange={(e) => onValueChange?.(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            {...textareaDomProps}
          />

          {(maxLength || actionButton) && (
            <div css={cssObj.footer}>
              <span css={cssObj.counter}>
                {maxLength ? `${safeValue.length}/${maxLength}` : null}
              </span>
              {actionButton && (
                <button
                  type="button"
                  css={cssObj.actionButtonStyle}
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
