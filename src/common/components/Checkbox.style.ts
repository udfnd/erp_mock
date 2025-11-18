import { css } from '@emotion/react';

import { color, radius } from '@/style';

export const container = css({
  position: 'relative',
  display: 'inline-flex',
  width: '20px',
  height: '20px',
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
  border: 1px solid ${color.cgrey300};
  background-color: ${color.white};
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 12px;
    border: 2px solid ${color.white};
    border-top: none;
    border-left: none;
    transform: rotate(45deg) scale(0.5);
    opacity: 0;
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }

  &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 2px;
    border-radius: 1px;
    background-color: ${color.blue600};
    opacity: 0;
    transform: scaleX(0.4);
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }

  .${inputClassName}:disabled + & {
    cursor: not-allowed;
    background-color: ${color.cgrey50};
    border-color: ${color.cgrey200};
  }

  .${inputClassName}:checked + & {
    background-color: ${color.blue600};
    border-color: ${color.blue600};
  }

  .${inputClassName}:checked + &::after {
    opacity: 1;
    transform: scale(1) rotate(45deg);
  }

  .${inputClassName}:indeterminate + & {
    background-color: ${color.blue100};
    border-color: ${color.blue400};
  }

  .${inputClassName}:indeterminate + &::before {
    opacity: 1;
    transform: scaleX(1);
  }

  .${inputClassName}:focus-visible + & {
    box-shadow: 0 0 0 4px ${color.blue50};
  }
`;
