'use client';

import { css } from '@emotion/react';

import { color } from '@/style';

export const cssObj = {
  page: css`
    display: flex;
    gap: 24px;
    padding: 24px;
    background-color: ${color.cgrey50};
    min-height: 100vh;
    box-sizing: border-box;
  `,
  listSection: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  `,
  listHeader: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  `,
  listHeaderText: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  listTitle: css`
    font-size: 24px;
    font-weight: 600;
    color: ${color.black};
  `,
  listSubtitle: css`
    font-size: 14px;
    color: ${color.cgrey500};
  `,
  toolbar: css`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
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
  toolbarTextfield: css`
    flex: 1;
    min-width: 220px;
  `,
  tableContainer: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: ${color.white};
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
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
  sortButton: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
  `,
  sortIcon: css`
    font-size: 11px;
    color: ${color.cgrey400};
  `,
  settingsPanel: css`
    width: 400px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: ${color.white};
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
    overflow: hidden;
  `,
  panelHeader: css`
    padding: 24px;
    border-bottom: 1px solid ${color.cgrey100};
  `,
  panelTitle: css`
    font-size: 18px;
    font-weight: 600;
    color: ${color.black};
  `,
  panelSubtitle: css`
    margin-top: 6px;
    font-size: 14px;
    color: ${color.cgrey500};
  `,
  panelBody: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    overflow: auto;
  `,
  panelFooter: css`
    padding: 16px 24px;
    border-top: 1px solid ${color.cgrey100};
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  `,
  panelSection: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,
  panelLabel: css`
    font-size: 12px;
    font-weight: 600;
    color: ${color.cgrey400};
    letter-spacing: 0.04em;
    text-transform: uppercase;
  `,
  panelText: css`
    font-size: 14px;
    color: ${color.cgrey600};
  `,
  chipList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  chip: css`
    padding: 12px;
    border-radius: 12px;
    background: ${color.blue10};
    color: ${color.blue600};
    font-size: 14px;
    font-weight: 500;
  `,
  helperText: css`
    font-size: 13px;
    color: ${color.cgrey400};
  `,
  divider: css`
    width: 100%;
    height: 1px;
    background: ${color.cgrey100};
    margin: 8px 0;
  `,
  inlineButtonGroup: css`
    display: flex;
    gap: 8px;
  `,
  fullWidth: css`
    width: 100%;
  `,
  loadingState: css`
    padding: 24px;
    text-align: center;
    color: ${color.cgrey400};
    font-size: 13px;
  `,
};
