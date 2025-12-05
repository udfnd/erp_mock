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

  listHeader: css`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  `,

  primaryActions: css`
    display: flex;
    gap: 8px;
  `,

  dropdownTrigger: css`
    position: relative;
  `,

  dropdownMenu: css`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: ${color.white};
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 160px;
    padding: 8px 0;
    z-index: 1000;
  `,

  dropdownItem: css`
    padding: 10px 16px;
    cursor: pointer;
    ${typography.bodySmallR};
    color: ${color.cgrey700};
    transition: background-color 0.2s;

    &:hover {
      background-color: ${color.blue10};
    }
  `,

  searchContainer: css`
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
  `,

  searchIcon: css`
    position: absolute;
    left: 8px;
  `,

  searchTextfield: css`
    flex: 1;
    height: 32px;
    padding: 4px 12px 4px 24px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
  `,

  toolbarGroup: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  toolbarSelect: css`
    height: 40px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    color: ${color.cgrey700};
    font-size: 14px;
  `,

  tableContainer: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: ${color.white};
  `,

  tableWrapper: css`
    flex: 1;
    overflow: auto;
  `,

  table: css`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  `,

  tableHeadRow: css`
    background: ${color.blue10};
  `,

  tableHeaderCell: css`
    position: sticky;
    top: 0;
    z-index: 1;
    text-align: left;
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 600;
    color: ${color.cgrey500};
    border-bottom: 1px solid ${color.cgrey100};
  `,

  tableCell: css`
    padding: 14px 16px;
    border-bottom: 1px solid ${color.cgrey100};
    font-size: 14px;
    color: ${color.cgrey700};
    vertical-align: middle;
    background: ${color.white};
  `,

  checkboxCell: css`
    width: 52px;
  `,

  tableRow: css`
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: ${color.blue10};
    }
  `,

  tableRowSelected: css`
    background: ${color.blue50};

    &:hover {
      background: ${color.blue50};
    }
  `,

  emptyState: css`
    padding: 40px 16px;
    text-align: center;
    color: ${color.cgrey400};
    font-size: 14px;
  `,

  loadingState: css`
    padding: 40px 16px;
    text-align: center;
    color: ${color.cgrey400};
    font-size: 14px;
  `,

  tableFooter: css`
    padding: 12px 16px;
    border-top: 1px solid ${color.cgrey100};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  `,

  paginationInfo: css`
    font-size: 13px;
    color: ${color.cgrey500};
  `,

  paginationButtons: css`
    display: flex;
    align-items: center;
    gap: 8px;
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

  panelLabel: css`
    ${typography.bodySmallM};
    color: ${color.cgrey500};
  `,

  panelText: css`
    ${typography.bodySmallR};
    color: ${color.cgrey700};
  `,

  panelFooter: css`
    margin-top: auto;
    display: flex;
  `,

  formField: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  input: css`
    padding: 10px 12px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    font-size: 14px;
    &:focus {
      outline: none;
      border-color: ${color.blue};
    }
  `,

  textarea: css`
    padding: 10px 12px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    font-size: 14px;
    min-height: 120px;
    resize: vertical;
    font-family: inherit;
    &:focus {
      outline: none;
      border-color: ${color.blue};
    }
  `,

  toggleSection: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    background: ${color.cgrey10};
    border-radius: 8px;
  `,

  toggleRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  channelConfig: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-left: 12px;
    border-left: 2px solid ${color.cgrey200};
  `,

  chip: css`
    display: inline-flex;
    padding: 2px 8px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 100px;
    background-color: ${color.cgrey100};
    ${typography.captionR};
    color: ${color.cgrey500};
  `,

  primaryActionButtons: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,

  dropdownContainer: css`
    position: relative;
  `,

  actionButton: (isPrimary: boolean) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    background-color: ${isPrimary ? color.blue : color.cgrey600};
    color: ${color.white};
    ${typography.bodySmallSB};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: ${isPrimary ? color.blue600 : color.cgrey700};
    }

    &:active {
      transform: scale(0.98);
    }
  `,

  actionDropdownMenu: css`
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background: ${color.white};
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 140px;
    padding: 8px 0;
    z-index: 1000;
  `,

  actionDropdownItem: css`
    padding: 10px 16px;
    cursor: pointer;
    ${typography.bodySmallR};
    color: ${color.cgrey700};
    transition: background-color 0.2s;

    &:hover {
      background-color: ${color.blue10};
    }
  `,
};
