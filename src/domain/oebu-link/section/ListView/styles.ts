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
    width: 400px;
    min-width: 400px;
    background: ${color.white};
    min-height: 0;
    max-height: 100%;
    height: 100%;
    overflow-y: auto;
  `,

  panelHeader: css`
    padding: 16px;
  `,

  panelTitle: css`
    font-size: 18px;
    font-weight: 600;
    color: ${color.black};
    ${typography.bodySB};
  `,

  panelSubtitle: css`
    margin-top: 4px;
    ${typography.bodySmallSB};
    color: ${color.cgrey500};
  `,

  panelBody: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  `,

  panelSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  panelLabel: css`
    font-size: 13px;
    font-weight: 600;
    color: ${color.cgrey600};
  `,

  toolbarSelect: css`
    width: 100%;
    height: 40px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    color: ${color.cgrey700};
    font-size: 14px;
  `,

  helperText: css`
    font-size: 14px;
    color: ${color.cgrey500};
  `,

  buttonRow: css`
    display: flex;
    gap: 8px;
  `,

  destructiveButton: css`
    background: ${color.red10};
    color: ${color.white};
  `,

  panelList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 16px;
    list-style: disc;
  `,
};
