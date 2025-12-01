import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  container: css`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  `,

  label: css`
    ${typography.bodySmallM};
    color: ${color.cgrey500};
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `,

  required: css`
    color: ${color.red};
  `,

  trigger: (disabled?: boolean) => css`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    background: ${color.white};
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: ${disabled ? 'not-allowed' : 'default'};

    &:focus-within {
      outline: none;
      border-color: ${color.blue600};
      box-shadow: 0 0 0 2px ${color.blue100};
    }

    &:has(button:disabled),
    &:has(input:disabled) {
      background: ${color.cgrey100};
      color: ${color.cgrey400};
      border-color: ${color.cgrey200};
    }
  `,

  iconButton: (disabled?: boolean) => css`
    width: 32px;
    height: 32px;
    min-width: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${color.cgrey100};
    border-radius: 50%;
    background: ${color.white};
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    color: ${disabled ? color.cgrey300 : color.black};

    &:hover {
      background: ${disabled ? color.white : color.blue50};
    }

    svg {
      width: 20px;
      height: 20px;
    }
  `,

  triggerInput: css`
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    ${typography.bodyR};
    color: ${color.black};
    outline: none;

    &::placeholder {
      color: ${color.cgrey300};
    }

    &:disabled {
      background: transparent;
      color: ${color.cgrey400};
      cursor: not-allowed;
    }
  `,

  placeholder: css`
    color: ${color.cgrey300};
  `,

  pickerPanel: css`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 300px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    border-radius: 12px;
    z-index: 10;
    box-sizing: border-box;
    box-shadow: 0 0 15px 0 rgba(1, 8, 33, 0.1);
  `,

  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 20px 20px 12px 20px;
  `,

  headerLabel: css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    ${typography.bodyB};
    color: ${color.black};
    text-align: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;

    > span {
      display: flex;
      align-items: center;
    }

    &:hover {
      background: ${color.blue50};
    }
  `,

  moveButtonContainer: css`
    display: flex;
    align-items: center;
    gap: 16px;
  `,

  navButton: (disabled?: boolean) => css`
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 8px;
    background: ${color.white};
    cursor: ${disabled ? 'not-allowed' : 'pointer'};

    &:hover {
      background: ${color.blue50};
    }

    &:disabled {
      background: ${color.cgrey100};
      color: ${color.cgrey300};
    }

    svg {
      width: 24px;
      height: 24px;
      color: ${color.black};
    }
  `,

  dayLabels: css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    ${typography.captionB};
    color: ${color.cgrey400};
    text-align: center;
    padding: 0 12px;
    margin-bottom: 8px;
  `,

  dayLabel: css`
    padding: 4px 0;
  `,

  calendarGrid: css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    padding: 0 12px 12px 12px;
  `,

  dayCell: ({
              selected,
              inCurrentMonth,
              disabled,
            }: {
    selected: boolean;
    inCurrentMonth: boolean;
    disabled: boolean;
  }) => css`
    height: 36px;
    border: none;
    border-radius: 8px;
    background: ${selected ? color.blue : color.white};
    color: ${selected ? color.white : inCurrentMonth ? color.black : color.cgrey200};
    ${typography.bodySmallSB};
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    transition: background 0.2s ease;

    ${disabled
      ? css`
        color: ${color.cgrey200};
      `
      : ''};

    &:hover {
      background: ${selected ? color.blue600 : color.blue50};
    }
  `,

  yearGrid: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    padding: 0 12px 12px 12px;
  `,

  yearCell: (selected: boolean, disabled?: boolean) => css`
    height: 36px;
    border-radius: 8px;
    border: none;
    background: ${selected ? color.blue : color.white};
    color: ${selected ? color.white : disabled ? color.cgrey200 : color.black};
    ${typography.bodySmallSB};
    cursor: ${disabled ? 'not-allowed' : 'pointer'};

    &:hover {
      background: ${selected ? color.blue600 : color.blue50};
    }
  `,

  footer: css`
    display: flex;
    gap: 8px;
    border-top: 1px solid ${color.cgrey100};
    align-items: center;
    justify-content: flex-end;
    padding: 12px 20px;
  `,
};
