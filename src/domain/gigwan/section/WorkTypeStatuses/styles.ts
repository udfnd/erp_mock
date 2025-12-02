import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  card: css`
    background: ${color.cgrey10};
    padding: 16px;
    min-width: 410px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    border-radius: 8px;
  `,

  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
  `,

  cardTitleGroup: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  cardTitle: css`
    ${typography.bodySB};
    color: ${color.black};
  `,

  cardSubtitle: css`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,

  cardBody: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  cardFooter: css`
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
  `,

  errorText: css`
    ${typography.bodySmallR};
    color: ${color.red};
  `,

  categorySection: css`
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    background: ${color.cgrey50};
  `,

  categoryLabel: css`
    ${typography.bodySmallM};
    color: ${color.black};
  `,

  statusList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  statusItem: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,

  statusValue: css`
    ${typography.bodyR};
    color: ${color.black};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,

  statusField: css`
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 12px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    background: ${color.white};
    transition: border-color 120ms ease;

    &:hover {
      border-color: ${color.cgrey300};
    }

    &:focus-within {
      border-color: ${color.blue600};
    }
  `,

  statusInputField: css`
    ${typography.bodyR};
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: ${color.black};
    min-width: 0;

    &::placeholder {
      color: ${color.cgrey400};
    }
  `,

  statusActions: css`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
  `,
} as const;
