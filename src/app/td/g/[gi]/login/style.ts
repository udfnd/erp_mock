import { css, keyframes } from '@emotion/react';
import { color, typography } from '@/style';

export const page = css({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: color.cgrey50,
});

export const card = css({
  width: '480px',
  background: color.white,
  borderRadius: '12px',
  border: `1px solid ${color.cgrey50}`,
  padding: '32px 40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const header = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '40px',
});

export const title = css({ ...typography.titleSmallB, color: color.black });
export const subtitle = css({ ...typography.bodyR, color: color.cgrey500 });

export const form = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const inputWrapper = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',

  '> p': {
    ...typography.bodyM,
    color: color.cgrey400,
    width: '56px',
  },
});

export const errorText = css({
  ...typography.bodyM,
  color: color.red,
});

export const buttonWrapper = css({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: '20px',
});

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const spinner = css({
  animation: `${spin} 1s linear infinite`,
  fontSize: 18,
});
