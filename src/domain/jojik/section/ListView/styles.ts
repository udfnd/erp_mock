'use client';

import { css } from '@emotion/react';

import { color } from '@/style';

export const jojikListViewCss = {
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
    width: 340px;
    background: ${color.white};
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
    display: flex;
    flex-direction: column;
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
    margin-top: 4px;
    font-size: 13px;
    color: ${color.cgrey500};
  `,

  panelBody: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
  `,

  panelSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  panelLabel: css`
    font-size: 13px;
    font-weight: 600;
    color: ${color.cgrey500};
  `,

  panelText: css`
    font-size: 14px;
    color: ${color.cgrey700};
  `,

  panelFooter: css`
    padding: 16px 24px;
    border-top: 1px solid ${color.cgrey100};
    display: flex;
    gap: 12px;
    justify-content: flex-end;
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
    color: ${color.blue500};
    font-size: 13px;
  `,
};
