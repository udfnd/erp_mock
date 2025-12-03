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
    gap: 8px;
    flex-wrap: wrap;
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

  dataList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  dataItem: css`
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 12px;
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    background: ${color.white};
  `,

  dataIcon: css`
    display: flex;
    align-items: center;
    color: ${color.cgrey500};
  `,

  dataLabel: css`
    ${typography.bodySmallM};
    color: ${color.cgrey500};
    min-width: 88px;
  `,

  dataValue: css`
    ${typography.bodyM};
    color: ${color.cgrey700};
    flex: 1;
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  tooltipTrigger: css`
    position: relative;
    align-self: flex-start;
    z-index: 2;
  `,

  tooltip: css`
    position: fixed;
    width: 680px;
    background: ${color.white};
    border: 1px solid ${color.cgrey100};
    border-radius: 10px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 100;
  `,

  tooltipHeader: css`
    border-bottom: 1px solid ${color.cgrey50};
    padding-bottom: 8px;
  `,

  tooltipContent: css`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px;
    align-items: start;
  `,

  tooltipListSection: css`
    overflow: hidden;
    background: ${color.white};
  `,

  tooltipList: css`
    max-height: 240px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,

  tooltipListItem: css`
    display: flex;
    align-items: center;
    gap: 8px;
    ${typography.bodySmallM};
    color: ${color.cgrey700};
  `,

  tooltipSelectedSection: css`
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: ${color.white};
  `,

  selectedItemLabel: css`
    ${typography.bodySmallSB};
    color: ${color.black};
  `,

  selectedItemBox: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  selectedItemName: css`
    ${typography.bodyM};
    color: ${color.cgrey700};
  `,

  selectedItemMeta: css`
    ${typography.bodySmallM};
    color: ${color.cgrey500};
  `,

  tooltipActions: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  `,
};
