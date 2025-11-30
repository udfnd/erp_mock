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

  panelHeader: css``,

  panelTitle: css`
    font-size: 18px;
    font-weight: 600;
    color: ${color.black};
    ${typography.bodySB};
  `,

  quickActionText: css`
    ${typography.bodySmallM};
    color: ${color.cgrey600};
  `,

  panelSubtitle: css`
    ${typography.bodySB};
  `,

  panelBody: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  panelSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  iconSelectGrid: css`
    display: flex;
    gap: 8px;
  `,

  iconSelectButton: css`
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    background: ${color.white};
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  `,

  iconSelectButtonSelected: css`
    border-color: ${color.blue};
  `,

  iconSelectIcon: css`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${color.cgrey500};
    flex-shrink: 0;
  `,

  iconSelectLabel: css`
    ${typography.bodyR};
    color: ${color.cgrey700};
  `,

  iconPlaceholder: css`
    color: ${color.cgrey400};
    font-size: 13px;
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

  saveButtonContainer: css`
    margin-left: auto;
  `,

  buttonRow: css`
    margin-top: auto;
    display: flex;
    gap: 8px;
  `,

  panelList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 16px;
    list-style: disc;
  `,

  metaSection: css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 12px;
    padding: 12px 0;
  `,

  metaRow: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  metaLabel: css`
    color: ${color.cgrey500};
    ${typography.captionB};
  `,

  metaValue: css`
    color: ${color.black};
    ${typography.bodySmallR};
  `,
};
