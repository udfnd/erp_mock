'use client';

import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  triggerButton: css`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    color: ${color.cgrey700};
  `,
  triggerIcon: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: ${color.cgrey500};
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: ${color.cgrey50};
      color: ${color.black};
    }

    &:focus-visible {
      outline: 2px solid ${color.blue};
      outline-offset: 2px;
    }
  `,
  triggerActions: css`
    display: inline-flex;
    align-items: center;
    gap: 12px;
  `,
  clearIcon: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: ${color.cgrey300};
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: ${color.cgrey50};
      color: ${color.black};
    }

    &:focus-visible {
      outline: 2px solid ${color.blue};
      outline-offset: 2px;
    }
  `,
  triggerLabel: css`
    flex: 1;
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
  selectionCount: css`
    ${typography.captionB};
    color: ${color.blue600};
    background: ${color.blue50};
    border-radius: 999px;
    padding: 6px 10px;
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
  selectionAddress: css`
    ${typography.captionR};
    color: ${color.cgrey600};
  `,
  emptyState: css`
    ${typography.captionR};
    color: ${color.cgrey500};
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

  addButton: css`
    align-self: flex-end;
    margin-top: auto;
  `,
};
