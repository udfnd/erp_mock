'use client';

import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  triggerButton: css`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    color: ${color.cgrey700};
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      border-color: ${color.blue200};
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
      background: ${color.blue10};
    }

    &:focus-visible {
      outline: 2px solid ${color.blue};
      outline-offset: 3px;
    }
  `,
  triggerIcon: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${color.black};

    > svg {
      width: 16px;
      height: 16px;
    }
  `,
  triggerLabel: css`
    ${typography.bodySmallR};
    color: inherit;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  `,
  selectionSummary: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  selectionHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  `,
  selectionTitle: css`
    ${typography.bodyB};
    color: ${color.black};
  `,
  selectionList: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  selectionItem: css`
    padding: 12px;
    border-radius: 10px;
    background: ${color.cgrey50};
    border: 1px solid ${color.cgrey100};
    display: grid;
    gap: 6px;
  `,
  selectionName: css`
    ${typography.bodyB};
    color: ${color.black};
  `,
  selectionDetail: css`
    ${typography.captionR};
    color: ${color.cgrey600};
  `,
  listViewContainer: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,

  formContainer: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 12px;
  `,

  textfieldContainer: css`
    background: ${color.cgrey10};
    padding: 16px;
    border: 1px solid ${color.blue100};
    border-radius: 8px;
    flex: 1;
    width: 415px;
    max-height: 480px;
    overflow: auto;
  `,

  formTitle: css`
    ${typography.bodySB};
    margin-bottom: 16px;
  `,

  formRow: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  addButton: css`
    align-self: flex-end;
    margin-top: auto;
  `,

  iconSelectLabel: css`
    ${typography.captionB};
    color: ${color.cgrey700};
  `,
  iconSelect: css`
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    color: ${color.cgrey700};
    ${typography.bodyR};

    &:focus {
      outline: 2px solid ${color.blue200};
      border-color: ${color.blue200};
    }
  `,
};
