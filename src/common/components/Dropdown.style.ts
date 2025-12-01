import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  container: css`
    position: relative;
  `,
  button: (isOpen: boolean, disabled?: boolean) => css`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${isOpen ? color.blue600 : color.cgrey200};
    border-radius: 8px;
    background: ${disabled ? color.cgrey100 : color.white};
    ${typography.bodyR};
    color: ${disabled ? color.cgrey400 : color.black};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};

    &:focus-visible {
      outline: 2px solid ${color.blue100};
      border-color: ${color.blue600};
    }
  `,
  label: css`
    flex: 1;
    text-align: left;
  `,
  placeholder: css`
    color: ${color.cgrey400};
  `,
  caret: css`
    transition: transform 0.2s ease;
  `,
  menu: css`
    position: absolute;
    z-index: 10;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: ${color.white};
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    max-height: 240px;
    overflow-y: auto;
  `,
  option: css`
    width: 100%;
    padding: 10px 12px;
    background: ${color.white};
    border: none;
    text-align: left;
    ${typography.bodyR};
    color: ${color.black};
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    &:hover {
      background: ${color.cgrey50};
    }

    &:disabled {
      color: ${color.cgrey300};
      cursor: not-allowed;
    }
  `,
  optionSelected: css`
    background: ${color.blue50};
    color: ${color.blue600};
  `,
};
