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

  dataSubsection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: 8px;
    background: ${color.cgrey10};
    padding: 8px;

    > p {
      ${typography.bodySmallM};
    }
  `,

  gwangyeChip: css`
    width: fit-content;
    display: flex;
    padding: 5px 8px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 100px;
    background: ${color.cgrey100};
    ${typography.captionR};
  `,

  dataItem: css`
    display: flex;
    align-items: center;
    gap: 4px;
    height: 36px;
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
    flex: 1;
    ${typography.bodySmallR};
    color: ${color.cgrey500};
    min-width: 88px;
  `,

  dataValue: css`
    ${typography.captionR};
    color: ${color.cgrey700};
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  permissionActionContainer: css`
    position: relative;
    align-items: center;
    z-index: 2;
  `,

  permissionTooltip: css`
    position: fixed;
    width: 680px;
    background: ${color.white};
    border: 1px solid ${color.cgrey100};
    border-radius: 10px;
    padding: 8px 16px 16px 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    z-index: 100;
  `,

  permissionTooltipHeader: css`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
  `,

  tooltipTitle: css`
    ${typography.bodySB};
  `,

  tooltipCloseButton: css`
    border: none;
    background: none;
    width: 24px;
    height: 24px;
    cursor: pointer;
    color: ${color.cgrey500};

    > svg {
      width: 18px;
      height: 18px;
    }
  `,

  permissionTooltipContent: css`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px;
    align-items: start;
  `,

  permissionTooltipTable: css`
    overflow: hidden;
    background: ${color.white};
  `,

  permissionTooltipSelected: css`
    height: 100%;
    border-left: 1px solid ${color.cgrey100};
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    gap: 8px;
    background: ${color.white};
  `,

  selectedPermissionList: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,

  selectedPermissionItem: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  selectedPermissionLabel: css`
    padding: 4px;
    color: ${color.cgrey700};
    ${typography.captionR};
  `,

  deleteItemButton: css`
    border-radius: 50%;
    width: 24px;
    height: 24px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${color.cgrey100};
    background: ${color.white};

    > svg {
      width: 16px;
      height: 16px;
    }
  `,

  permissionTooltipActions: css`
    display: flex;
    margin-top: auto;
    justify-content: flex-end;
    gap: 8px;
  `,

  jaewonsaengInfoSection: css`
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    padding: 12px;
    margin-top: 8px;

    > p {
      ${typography.bodySmallM};
      margin-bottom: 8px;
    }
  `,

  jaewonsaengInfoBox: css`
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
  `,
};
