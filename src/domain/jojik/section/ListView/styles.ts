'use client';

import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  page: css`
    display: flex;
    box-sizing: border-box;
    flex: 1 1 0;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 0;
    max-height: 100%;
    align-items: stretch;
    overflow: hidden;
  `,

  leftPane: css`
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
  `,

  rightPane: css`
    width: 400px;
    min-width: 400px;
    max-width: 400px;
    min-height: 0;
    max-height: 100%;
    display: flex;
  `,

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

  listHeader: css`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
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

  sortButton: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 600;
    color: ${color.cgrey500};
    cursor: pointer;
  `,

  sortIcon: css`
    font-size: 12px;
  `,

  settingsPanel: css`
    width: 400px;
    min-width: 400px;
    flex: 0 0 340px;
    background: ${color.white};
    display: flex;
    flex-direction: column;
    min-height: 0;
    max-height: calc(100vh - 32px);
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
    font-size: 14px;
    color: ${color.cgrey500};
  `,

  panelBody: css`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-top: 1px solid ${color.cgrey50};
    border-bottom: 1px solid ${color.cgrey50};
  `,

  helperText: css`
    font-size: 12px;
    color: ${color.cgrey500};
  `,

  panelSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  panelFooter: css`
    padding: 16px;
    border-top: 1px solid ${color.cgrey50};
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  linkTag: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    border-radius: 10px;
    background: ${color.cgrey50};
    font-size: 13px;
    color: ${color.cgrey700};
    text-decoration: none;
    &:hover {
      background: ${color.cgrey100};
    }
  `,

  badge: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 8px;
    background: ${color.blue50};
    color: ${color.blue700};
    font-size: 13px;
    font-weight: 600;
  `,
};
