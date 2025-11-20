'use client';

import { css, keyframes } from '@emotion/react';
import { color, typography } from '@/style';

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const cssObj = {
  page: css`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${color.cgrey50};
  `,

  card: css`
    width: 480px;
    background: ${color.white};
    border-radius: 12px;
    border: 1px solid ${color.cgrey50};
    padding: 32px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  header: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
  `,

  title: css`
    ${typography.titleSmallB};
    color: ${color.black};
    padding-bottom: 4px;
  `,

  description: css`
    ${typography.bodyM};
    color: ${color.cgrey500};
  `,

  form: css`
    display: flex;
    width: 400px;
    flex-direction: column;
    gap: 20px;
  `,

  buttonWrapper: css`
    display: flex;
    justify-content: flex-end;
  `,

  spinner: css`
    animation: ${spin} 1s linear infinite;
    font-size: 18px;
  `,
};
