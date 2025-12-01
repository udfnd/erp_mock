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
  trigger: (disabled?: boolean) =>
    css`
      width: 100%;
      padding: 10px 12px;
      border: 1px solid ${color.cgrey200};
      border-radius: 8px;
      background: ${color.white};
      ${typography.bodyR};
      color: ${color.black};
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};

      &:focus {
        outline: none;
        border-color: ${color.blue600};
        box-shadow: 0 0 0 2px ${color.blue100};
      }

      &:disabled {
        background: ${color.cgrey100};
        color: ${color.cgrey400};
        border-color: ${color.cgrey200};
      }
    `,
  triggerLabel: css`
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  placeholder: css`
    color: ${color.cgrey300};
  `,
  pickerPanel: css`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 320px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(16, 24, 40, 0.1);
    z-index: 10;
    padding: 16px;
    box-sizing: border-box;
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
  `,
  headerLabel: css`
    flex: 1;
    ${typography.bodyM};
    color: ${color.black};
    text-align: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;

    &:hover {
      background: ${color.blue50};
    }
  `,
  navButton: (disabled?: boolean) =>
    css`
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${color.cgrey200};
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
        color: ${color.blue600};
      }
    `,
  dayLabels: css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    ${typography.bodySmallM};
    color: ${color.cgrey500};
    text-align: center;
    margin-bottom: 8px;
  `,
  dayLabel: css`
    padding: 4px 0;
  `,
  calendarGrid: css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 12px;
  `,
  dayCell: ({
    selected,
    inCurrentMonth,
    disabled,
  }: {
    selected: boolean;
    inCurrentMonth: boolean;
    disabled: boolean;
  }) =>
    css`
      height: 40px;
      border: none;
      border-radius: 8px;
      background: ${selected ? color.blue600 : color.white};
      color: ${selected ? color.white : inCurrentMonth ? color.black : color.cgrey200};
      ${typography.bodyR};
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
    gap: 8px;
    margin: 8px 0 12px;
  `,
  yearCell: (selected: boolean, disabled?: boolean) =>
    css`
      height: 44px;
      border-radius: 10px;
      border: 1px solid ${selected ? color.blue600 : color.cgrey200};
      background: ${selected ? color.blue600 : color.white};
      color: ${selected ? color.white : disabled ? color.cgrey200 : color.black};
      ${typography.bodyM};
      cursor: ${disabled ? 'not-allowed' : 'pointer'};

      &:hover {
        background: ${selected ? color.blue600 : color.blue50};
      }
    `,
  footer: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  `,
  cancelButton: css`
    min-width: 72px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    color: ${color.cgrey600};
    ${typography.bodyR};
    cursor: pointer;

    &:hover {
      background: ${color.blue50};
    }
  `,
  applyButton: css`
    min-width: 72px;
    padding: 10px 12px;
    border-radius: 10px;
    border: none;
    background: ${color.blue600};
    color: ${color.white};
    ${typography.bodyR};
    cursor: pointer;

    &:hover {
      background: ${color.blue700};
    }
  `,
};
