import { css } from '@emotion/react';

import { color, radius } from '@/style';

export const container = css({
  position: 'relative',
  display: 'inline-flex',
  width: 20,
  height: 20,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

export const input = css({
  position: 'absolute',
  inset: 0,
  margin: 0,
  opacity: 0,
  cursor: 'pointer',
  '&:disabled': {
    cursor: 'not-allowed',
  },
});

const inputClassName = `css-${input.name}`;

export const box = css`
  width: 100%;
  height: 100%;
  border-radius: ${radius.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.15s ease;

  .${inputClassName}:disabled + & {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .${inputClassName}:focus-visible + & {
    box-shadow: 0 0 0 4px ${color.blue50};
  }
`;
