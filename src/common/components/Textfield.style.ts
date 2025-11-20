import { css, type Interpolation, type Theme } from '@emotion/react';
import { color, radius, spacing, typography } from '@/style';

type IT = Interpolation<Theme>;

export const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

export const labelWrapper = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: '4px',
  gap: spacing.xs,
  width: '100%',
});

export const label = css({
  ...typography.bodySmallM,
  color: color.cgrey700,
});

export const requiredAsterisk = css({
  ...typography.bodySmallM,
  color: color.red,
});

const inputWrapperBase = css({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 10,
  padding: `${spacing.md} ${spacing.base}`,
  marginBottom: '2px',
  width: '100%',
  background: color.white,
  borderRadius: radius.md,
  borderWidth: '1px',
  borderStyle: 'solid',
  transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
});

const inputWrapperStatusStyles = {
  normal: css({
    borderColor: color.cgrey200,
    '&:focus-within': {
      borderColor: color.blue,
      boxShadow: `0 0 0 1px ${color.blue}`,
    },
  }),
  negative: css({
    borderColor: color.red,
    '&:focus-within': {
      borderColor: color.red,
      boxShadow: `0 0 0 1px ${color.red}`,
    },
  }),
} as const;

const inputWrapperDisabledStyles = {
  enabled: css({}),
  disabled: css({
    background: color.cgrey100,
    borderColor: color.cgrey100,
  }),
} as const;

/** ★ singleLine일 때 wrapper를 48px 높이로 만드는 보조 스타일 */
const inputWrapperSingleLineBase = css({
  // 한 줄 필드: 내부 gap 제거, 수직 가운데 정렬, 고정 높이 48px
  gap: 0,
  padding: `0 ${spacing.base}`,
  minHeight: 48,
  height: 48,
  flexDirection: 'row',
  alignItems: 'center',
});

export type InputWrapperRecipeOptions = {
  status?: keyof typeof inputWrapperStatusStyles;
  disabled?: boolean;
  singleLine?: boolean; // ★ 추가
};

export const inputWrapperRecipe = ({
  status = 'normal',
  disabled = false,
  singleLine = false,
}: InputWrapperRecipeOptions = {}): IT[] => {
  return [
    inputWrapperBase,
    inputWrapperStatusStyles[status],
    disabled ? inputWrapperDisabledStyles.disabled : inputWrapperDisabledStyles.enabled,
    singleLine && inputWrapperSingleLineBase,
  ];
};

const textareaBase = css({
  ...typography.bodyR,
  width: '100%',
  border: 'none',
  outline: 'none',
  padding: 0,
  background: 'transparent',
  resize: 'none',
  color: color.black,
  '&::placeholder': { color: color.cgrey300 },
  '&:disabled': { color: color.cgrey400 },
  '&:disabled::placeholder': { color: color.cgrey300 },
});

const textareaResizeStyles = {
  normal: css({ height: 'auto', minHeight: 24 }),
  limit: css({
    height: 134,
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: `${color.cgrey200} ${color.white}`,
    '&::-webkit-scrollbar': { width: 4 },
    '&::-webkit-scrollbar-track': { background: color.white },
    '&::-webkit-scrollbar-thumb': {
      background: color.cgrey200,
      borderRadius: 2,
    },
  }),
} as const;

export type TextareaRecipeOptions = {
  resize?: keyof typeof textareaResizeStyles;
};

export const textareaRecipe = ({ resize = 'normal' }: TextareaRecipeOptions = {}): IT[] => {
  return [textareaBase, textareaResizeStyles[resize]];
};

/** 멀티라인 외에, singleLine용 인풋 기본 스타일 */
export const inputRecipe = css({
  ...typography.bodyR,
  width: '100%',
  border: 'none',
  outline: 'none',
  padding: 0,
  background: 'transparent',
  color: color.black,
  '&::placeholder': { color: color.cgrey300 },
  '&:disabled': { color: color.cgrey400 },
  '&:disabled::placeholder': { color: color.cgrey300 },
});

/** ★ singleLine input의 고정 높이 48px (wrapper와 일치) */
export const inputSingleLine = css([
  inputRecipe,
  css({
    height: 48,
    lineHeight: '48px',
  }),
]);

export const footer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 0,
  gap: spacing.sm,
  width: '100%',
});

export const counter = css({
  ...typography.captionR,
  color: color.cgrey300,
  flexGrow: 1,
});

export const actionButtonStyle = css({
  ...typography.captionB,
  color: color.cgrey300,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '3px 0px',
});

const helperTextBase = css({
  ...typography.captionR,
  alignSelf: 'stretch',
});

const helperTextStatusStyles = {
  normal: css({ color: color.cgrey400 }),
  negative: css({ color: color.red }),
} as const;

export type HelperTextRecipeOptions = {
  status?: keyof typeof helperTextStatusStyles;
};

export const helperTextRecipe = ({ status = 'normal' }: HelperTextRecipeOptions = {}): IT[] => {
  return [helperTextBase, helperTextStatusStyles[status]];
};
