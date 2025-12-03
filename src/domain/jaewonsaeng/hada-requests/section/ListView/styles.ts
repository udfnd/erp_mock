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

  panelBody: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
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

  detailList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  detailItem: css`
    display: flex;
    gap: 8px;
  `,

  detailLabel: css`
    ${typography.bodySmallM};
    color: ${color.cgrey500};
    min-width: 96px;
  `,

  detailValue: css`
    ${typography.bodyM};
    color: ${color.cgrey700};
  `,
};
