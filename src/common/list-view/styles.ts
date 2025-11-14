'use client';

import { css } from '@emotion/react';

import { color } from '@/style';

export const listViewTemplateCss = {
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 0;
    background: ${color.white};
    border-radius: 12px;
    border: 1px solid ${color.cgrey100};
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px 16px;
    border-bottom: 1px solid ${color.cgrey100};
  `,
  headerContent: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  `,
  title: css`
    font-size: 20px;
    font-weight: 600;
    color: ${color.black};
  `,
  description: css`
    font-size: 13px;
    color: ${color.cgrey500};
  `,
  toolbar: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    border-bottom: 1px solid ${color.cgrey100};
    background: ${color.blue10};
  `,
  searchBox: css`
    flex: 1 1 240px;
    display: flex;
    align-items: center;
    position: relative;
  `,
  searchIcon: css`
    position: absolute;
    left: 12px;
    color: ${color.cgrey400};
  `,
  searchInput: css`
    width: 100%;
    height: 36px;
    padding: 0 12px 0 36px;
    border-radius: 10px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    font-size: 14px;
    color: ${color.cgrey700};
    &:focus {
      outline: 2px solid ${color.blue100};
      border-color: transparent;
    }
  `,
  toolbarControls: css`
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  `,
  selectLabel: css`
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: ${color.cgrey500};
  `,
  select: css`
    height: 36px;
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
    min-height: 0;
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
    background: ${color.white};
  `,
  tableHeaderCell: css`
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 12px 18px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: ${color.cgrey500};
    border-bottom: 1px solid ${color.cgrey100};
    background: ${color.blue10};
  `,
  tableCell: css`
    padding: 16px 18px;
    border-bottom: 1px solid ${color.cgrey100};
    font-size: 14px;
    color: ${color.cgrey700};
    background: ${color.white};
  `,
  tableRow: css`
    transition: background 0.2s ease;
    cursor: pointer;
    &:hover {
      background: ${color.blue100};
    }
  `,
  tableRowSelected: css`
    background: ${color.blue50};
    &:hover {
      background: ${color.blue100};
    }
  `,
  stateCell: css`
    padding: 40px 18px;
    text-align: center;
    color: ${color.cgrey400};
    font-size: 14px;
  `,
  footer: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 24px;
    border-top: 1px solid ${color.cgrey100};
    background: ${color.white};
  `,
  paginationInfo: css`
    font-size: 13px;
    color: ${color.cgrey500};
  `,
  paginationControls: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  footerControls: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  pageSizeSelect: css`
    height: 32px;
    padding: 0 10px;
    border-radius: 8px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    color: ${color.cgrey700};
    font-size: 13px;
  `,
};
