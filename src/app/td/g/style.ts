// app/td/g/enter-code/style.ts
import { css, keyframes } from '@emotion/css';
import { color, typography } from '@/style';

export const page = css({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: color.cgrey10,
  padding: '32px',
});

export const card = css({
  width: '100%',
  maxWidth: 400,
  background: color.white,
  borderRadius: '16px',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  gap: '32px',
});

export const header = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const title = css({ ...typography.titleSmallB, color: color.black });
export const description = css({ ...typography.bodyR, color: color.cgrey500 });

export const form = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const buttonWrapper = css({ display: 'flex', justifyContent: 'flex-end' });

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const spinner = css({
  animation: `${spin} 1s linear infinite`,
  fontSize: 18,
});
