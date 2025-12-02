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

  panelHeader: css``,

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
    gap: 8px;
    padding: 16px;
  `,

  panelSection: css`
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${color.cgrey50};
    gap: 8px;
    padding-bottom: 16px;
    margin-bottom: 8px;

    :last-of-type {
      border-bottom: none;
    }
  `,

  panelLabelSection: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  panelLabel: css`
    ${typography.bodySmallM};
    color: ${color.cgrey500};
  `,

  sectionActions: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  `,

  panelFooter: css`
    margin-top: auto;
    display: flex;
    gap: 8px;
  `,

  helperText: css`
    font-size: 13px;
    color: ${color.cgrey400};
  `,

  rightPanel: css`
    width: 420px;
    max-width: 100%;
    height: 100%;
    overflow: auto;
    background: ${color.white};
  `,
};
