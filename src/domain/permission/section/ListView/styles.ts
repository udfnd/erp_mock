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

  panelBody: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
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

  addUserContainer: css`
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
  `,

  addUserPopup: css`
    position: fixed;
    width: 680px;
    background: ${color.white};
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 1200;
  `,

  addUserPopupContent: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  popupGrid: css`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px;
  `,

  popupTableWrapper: css`
    overflow: hidden;
    background: ${color.white};
  `,

  selectedUserPanel: css`
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: ${color.white};
  `,

  selectedUserLabel: css`
    ${typography.bodySmallSB};
    color: ${color.black};
  `,

  selectedUserList: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,

  selectedUserItem: css`
    padding: 8px 10px;
    border-radius: 8px;
    background: ${color.blue10};
    color: ${color.cgrey700};
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
