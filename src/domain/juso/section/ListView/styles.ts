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

  panelSubtitle: css`
    ${typography.bodySB};
    color: ${color.black};
  `,

  panelBody: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  quickActionText: css`
    ${typography.bodySmallM};
    color: ${color.cgrey600};
  `,

  panelSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  panelJusoInputSection: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  saveButtonContainer: css`
    margin-left: auto;
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

  chipList: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `,

  chip: css`
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: ${color.blue10};
    color: ${color.blue600};
    font-size: 13px;
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
