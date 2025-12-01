import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  container: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  label: css`
    ${typography.bodySmallM};
    color: ${color.cgrey500};
  `,
  required: css`
    color: ${color.red};
    margin-left: 4px;
  `,
  input: css`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    background: ${color.white};
    ${typography.bodyR};
    color: ${color.black};
    box-sizing: border-box;

    &:focus {
      border-color: ${color.blue600};
      outline: 2px solid ${color.blue100};
      outline-offset: 0;
    }

    &:disabled {
      background: ${color.cgrey100};
      color: ${color.cgrey400};
      cursor: not-allowed;
    }

    &::placeholder {
      color: ${color.cgrey300};
    }
  `,
};
