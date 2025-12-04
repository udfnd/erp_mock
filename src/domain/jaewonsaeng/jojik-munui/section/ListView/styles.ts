'use client';

import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  listSection: css`
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-right: 1px solid ${color.cgrey100};
    min-width: 0;
    min-height: 0;
    max-width: 100%;
    height: 100%;
    box-sizing: border-box;
  `,

  settingsPanel: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-sizing: border-box;
    width: 400px;
    min-width: 400px;
    min-height: 0;
    max-height: 100%;
    height: 100%;
    padding: 16px;
    background: ${color.white};
    overflow-y: auto;

    @media (min-width: 960px) and (max-width: 1279px) {
      width: 200px;
      min-width: 200px;
      max-width: 200px;

      & * {
        min-width: 0;
      }
    }
  `,

  panel: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,

  panelHeader: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  panelTitle: css`
    font-size: 18px;
    font-weight: 600;
    color: ${color.black};
    ${typography.bodySB};
  `,

  panelSubtitle: css`
    ${typography.bodySmallSB};
    color: ${color.black};
  `,

  panelContent: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  panelActions: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  panelBody: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  salesDiv: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    padding: 8px;
    background-color: ${color.cgrey10};

    > span {
      ${typography.captionB};
      color: ${color.cgrey500};
    }
  `,

  desc: css`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,

  helperText: css`
    font-size: 13px;
    color: ${color.cgrey400};
  `,

  sectionActions: css`
    display: flex;
    gap: 8px;
  `,

  actionButtons: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  infoRow: css`
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 8px;
    ${typography.bodySmallR};
  `,

  relatedList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  relatedItem: css`
    padding: 8px;
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    background: ${color.cgrey5};
  `,

  answerBox: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
};
