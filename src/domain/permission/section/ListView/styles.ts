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
    gap: 16px;
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
    border-left: 1px solid ${color.cgrey100};
    box-sizing: border-box;
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
    ${typography.bodySmallSB};
    color: ${color.black};
  `,
  panelBody: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 16px 16px;
  `,
  panelSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  panelLabel: css`
    font-size: 13px;
    color: ${color.cgrey600};
  `,
  helperText: css`
    color: ${color.cgrey500};
    font-size: 12px;
    margin: 0;
  `,
  panelFooter: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
  `,
  tag: css`
    display: inline-flex;
    align-items: center;
    background: ${color.cgrey50};
    color: ${color.cgrey700};
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
  `,
  listBox: css`
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    padding: 8px;
    max-height: 240px;
    overflow: auto;
  `,
  listRow: css`
    padding: 6px 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${color.black};
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background: ${color.blue10};
    }
  `,
  addUserRowSelected: css`
    background: ${color.blue50};
    border: 1px solid ${color.blue300};
  `,
  addUserRowContent: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,
  addUserRowMeta: css`
    ${typography.captionM};
    color: ${color.cgrey500};
  `,
  addUserContainer: css`
    position: relative;
    z-index: 2;
  `,
  addUserPopup: css`
    position: fixed;
    width: 520px;
    background: ${color.white};
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 1200;
  `,
  addUserPopupHeader: css`
    display: flex;
    gap: 8px;
  `,
  addUserPopupToolbar: css`
    display: flex;
    gap: 8px;
    margin-top: 8px;
  `,
  addUserPopupContent: css`
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 12px;
    margin-top: 12px;
  `,
  addUserListSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  addUserSelectedSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  permissionLinkedBadge: css`
    padding: 4px 8px;
    border-radius: 999px;
    background: ${color.cgrey50};
    color: ${color.cgrey600};
    ${typography.captionM};
  `,
  permissionSelectedList: css`
    min-height: 120px;
    border: 1px dashed ${color.cgrey100};
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,
  permissionSelectedItem: css`
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: ${color.blue10};
    color: ${color.blue600};
    ${typography.bodySmallM};
  `,
  popupActions: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
  `,
  linkedNav: css`
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
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
