import { css as emotionCss } from '@emotion/react';

import { color, typography } from '@/style';

export const css = {
  card: emotionCss`
    background: ${color.cgrey10};
    padding: 16px;
    min-width: 410px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,
  cardHeader: emotionCss`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
  `,
  cardTitleGroup: emotionCss`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  cardTitle: emotionCss`
    ${typography.bodySB};
    color: ${color.black};
  `,
  cardSubtitle: emotionCss`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,
  cardBody: emotionCss`
    display: flex;
    flex-direction: column;
    gap: 20px;
  `,
  loadedInfo: emotionCss`
    display: flex;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background: ${color.white};
    border: 1px solid ${color.cgrey200};
  `,
  loadedInfoItem: emotionCss`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  `,
  loadedInfoLabel: emotionCss`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,
  loadedInfoValue: emotionCss`
    ${typography.bodyR};
    color: ${color.black};
    word-break: break-word;
    white-space: pre-wrap;
    margin: 0;
  `,
  cardFooter: emotionCss`
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  `,
  feedback: {
    success: emotionCss`
      ${typography.captionB};
      color: ${color.blue600};
    `,
    error: emotionCss`
      ${typography.captionB};
      color: ${color.red};
    `,
  } as const,
  errorText: emotionCss`
    ${typography.bodySmallR};
    color: ${color.red};
  `,
  categorySection: emotionCss`
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    background: ${color.cgrey50};
  `,
  categoryLabel: emotionCss`
    ${typography.bodySmallM};
    color: ${color.black};
  `,
  statusList: emotionCss`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  statusItem: emotionCss`
    display: flex;
    gap: 8px;
    align-items: center;
  `,
  statusValue: emotionCss`
    ${typography.bodyR};
    color: ${color.black};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
  statusField: emotionCss`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
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
  statusInputField: emotionCss`
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
  statusActions: emotionCss`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
  `,
} as const;
