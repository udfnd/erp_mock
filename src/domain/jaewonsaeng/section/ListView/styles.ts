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
    ${typography.bodySmallSB};
    color: ${color.black};
  `,

  desc: css`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,

  divider: css`
    border-bottom: 1px solid ${color.cgrey100};
    margin: 16px 0;
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
    border-bottom: 1px solid ${color.cgrey50};
    gap: 8px;
    padding-bottom: 16px;
    margin-bottom: 8px;

    :last-of-type {
      border-bottom: none;
    }
  `,

  panelLabelSection: css`
    background-color: ${color.cgrey10};
    padding: 8px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  panelLabel: css`
    ${typography.bodySmallM};
    color: ${color.cgrey500};
  `,

  parentTitle: css`
    display: flex;
    align-items: center;
  `,

  parentDeleteButtonWrapper: css`
    display: flex;
    justify-content: flex-end;
  `,

  sectionActions: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  `,

  panelFooter: css`
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  helperText: css`
    font-size: 13px;
    color: ${color.cgrey400};
  `,

  panelText: css`
    font-size: 14px;
    color: ${color.cgrey700};
  `,

  permissionList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  permissionItem: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    background: ${color.blue10};
  `,

  permissionName: css`
    font-size: 14px;
    color: ${color.cgrey700};
  `,

  sectionFooter: css`
    display: flex;
    justify-content: flex-end;
  `,

  hadaLinkSection: css`
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    padding: 12px;
  `,

  hadaLinkText: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    > p {
      ${typography.bodySmallM};
      color: ${color.black};
    }
    > span {
      ${typography.bodyM};
      color: ${color.black};
    }
  `,

  permissionActionContainer: css`
    position: relative;
    align-items: center;
    z-index: 2;
  `,

  permissionTooltip: css`
    position: fixed;
    width: 420px;
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

  permissionTooltipHeader: css`
    border-bottom: 1px solid ${color.cgrey50};
    padding-bottom: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  linkedNav: css`
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
  `,
  linkedNavButton: css`
    padding: 6px 4px;
    border: none;
    background: none;
    color: ${color.cgrey600};
    cursor: pointer;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    ${typography.bodySmallM};

    &:hover {
      color: ${color.cgrey700};
    }
  `,
  linkedNavButtonActive: css`
    color: ${color.black};
    font-weight: 700;
    border-bottom-color: ${color.black};
  `,
  linkedContent: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
};
