import { css, type Interpolation, type Theme } from '@emotion/react';
import { color, radius, spacing, typography } from '@/style';

type IT = Interpolation<Theme>;

export const cssObj = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `,

  labelWrapper: css`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 4px;
    gap: ${spacing.xs};
    width: 100%;
  `,

  label: css`
    ${typography.bodySmallM};
    color: ${color.cgrey600};
  `,

  requiredAsterisk: css`
    ${typography.bodySmallM};
    color: ${color.red};
  `,

  inputWrapperBase: css`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: ${spacing.md} ${spacing.base};
    margin-bottom: 2px;
    width: 100%;
    background: ${color.white};
    border-radius: ${radius.md};
    border-width: 1px;
    border-style: solid;
    transition:
      border-color 0.2s,
      box-shadow 0.2s,
      background-color 0.2s;
  `,

  inputWrapperStatusStyles: {
    normal: css`
      border-color: ${color.cgrey200};

      &:focus-within {
        border-color: ${color.blue};
        box-shadow: 0 0 0 1px ${color.blue};
      }
    `,
    negative: css`
      border-color: ${color.red};

      &:focus-within {
        border-color: ${color.red};
        box-shadow: 0 0 0 1px ${color.red};
      }
    `,
  },

  inputWrapperDisabledStyles: {
    enabled: css``,
    disabled: css`
      background: ${color.cgrey100};
      border-color: ${color.cgrey100};
    `,
  },

  inputWrapperSingleLineBase: css`
    gap: 0;
    padding: 0 ${spacing.base};
    min-height: 44px;
    height: 44px;
    flex-direction: row;
    align-items: center;
  `,

  textareaBase: css`
    ${typography.bodyR};
    width: 100%;
    border: none;
    outline: none;
    padding: 0;
    background: transparent;
    resize: none;
    color: ${color.black};

    &::placeholder {
      color: ${color.cgrey300};
    }

    &:disabled {
      color: ${color.cgrey400};
    }

    &:disabled::placeholder {
      color: ${color.cgrey300};
    }
  `,

  textareaResizeStyles: {
    normal: css`
      height: auto;
      min-height: 24px;
    `,
    limit: css`
      height: 134px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: ${color.cgrey200} ${color.white};

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: ${color.white};
      }

      &::-webkit-scrollbar-thumb {
        background: ${color.cgrey200};
        border-radius: 2px;
      }
    `,
  },

  input: css`
    ${typography.bodyR};
    width: 100%;
    border: none;
    outline: none;
    padding: 0;
    background: transparent;
    color: ${color.black};

    &::placeholder {
      color: ${color.cgrey300};
    }

    &:disabled {
      color: ${color.cgrey400};
    }

    &:disabled::placeholder {
      color: ${color.cgrey300};
    }
  `,

  inputSingleLine: css`
    ${typography.bodyR};
    width: 100%;
    border: none;
    outline: none;
    padding: 0;
    background: transparent;
    color: ${color.black};

    &::placeholder {
      color: ${color.cgrey300};
    }

    &:disabled {
      color: ${color.cgrey400};
    }

    &:disabled::placeholder {
      color: ${color.cgrey300};
    }
  `,

  footer: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    gap: ${spacing.sm};
    width: 100%;
  `,

  counter: css`
    ${typography.captionR};
    color: ${color.cgrey300};
    flex-grow: 1;
  `,

  actionButtonStyle: css`
    ${typography.captionB};
    color: ${color.cgrey300};
    background: none;
    border: none;
    cursor: pointer;
    padding: 3px 0;
  `,

  helperTextBase: css`
    ${typography.captionR};
    align-self: stretch;
  `,

  helperTextStatusStyles: {
    normal: css`
      color: ${color.cgrey400};
    `,
    negative: css`
      color: ${color.red};
    `,
  },
} as const;

export type InputWrapperRecipeOptions = {
  status?: keyof typeof cssObj.inputWrapperStatusStyles;
  disabled?: boolean;
  singleLine?: boolean;
};

export const inputWrapperRecipe = ({
  status = 'normal',
  disabled = false,
  singleLine = false,
}: InputWrapperRecipeOptions = {}): IT[] => [
  cssObj.inputWrapperBase,
  cssObj.inputWrapperStatusStyles[status],
  disabled ? cssObj.inputWrapperDisabledStyles.disabled : cssObj.inputWrapperDisabledStyles.enabled,
  singleLine && cssObj.inputWrapperSingleLineBase,
];

export type TextareaRecipeOptions = {
  resize?: keyof typeof cssObj.textareaResizeStyles;
};

export const textareaRecipe = ({ resize = 'normal' }: TextareaRecipeOptions = {}): IT[] => [
  cssObj.textareaBase,
  cssObj.textareaResizeStyles[resize],
];

export type HelperTextRecipeOptions = {
  status?: keyof typeof cssObj.helperTextStatusStyles;
};

export const helperTextRecipe = ({ status = 'normal' }: HelperTextRecipeOptions = {}): IT[] => [
  cssObj.helperTextBase,
  cssObj.helperTextStatusStyles[status],
];
