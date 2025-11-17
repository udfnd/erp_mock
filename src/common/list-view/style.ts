'use client';

import { css } from '@emotion/react';

import { color } from '@/style';

export const cssObj = {
  container: css`
    padding: 16px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 0;
    background: ${color.white};
    border-right: 1px solid ${color.cgrey100};
  `,

  toolbar: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${color.cgrey100};
    background: ${color.white};
  `,
  toolbarTopRow: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  searchBox: css`
    flex: 1 1 auto;
    min-width: 240px;
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
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  `,
  filterRow: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
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
    background: ${color.white};
  `,
  tableWrapper: css`
    flex: 1;
    overflow: auto;
    background: ${color.white};
  `,
  table: css`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: ${color.white};
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
    background: ${color.white};
  `,
  selectionCell: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 52px;
  `,
  headerActionCell: css`
    display: flex;
    justify-content: flex-end;
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
      background: ${color.white};
    }
  `,
  tableRowSelected: css`
    background: ${color.white};
    &:hover {
      background: ${color.white};
    }
  `,
  stateCell: css`
    padding: 40px 18px;
    text-align: center;
    color: ${color.cgrey400};
    font-size: 14px;
    background: ${color.white};
  `,

  footer: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-top: 1px solid ${color.cgrey100};
    background: ${color.white};
  `,

  paginationControls: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  paginationPageList: css`
    display: flex;
    align-items: center;
    gap: 4px;
  `,
  paginationPageButton: css`
    min-width: 28px;
    height: 28px;
    padding: 0 6px;
    border-radius: 0;
    border: none;
    background: ${color.white};
    font-size: 12px;
    color: ${color.cgrey600};
    cursor: pointer;
    transition: color 0.15s ease;
    &:hover {
      color: ${color.cgrey600};
    }
  `,
  paginationPageButtonActive: css`
    background: ${color.white};
    border-radius: 0;
    border: none;
    color: ${color.blue600};
    font-weight: 600;
  `,
  paginationMoreButton: css`
    min-width: 28px;
    height: 28px;
    padding: 0 6px;
    border-radius: 0;
    border: none;
    background: ${color.white};
    font-size: 16px;
    line-height: 1;
    color: ${color.cgrey600};
    cursor: pointer;
    transition: color 0.15s ease;
    &:hover {
      color: ${color.cgrey600};
    }
  `,
  paginationArrowButton: css`
    min-width: 28px;
    height: 28px;
    padding: 0 6px;
    border-radius: 0;
    border: none;
    background: ${color.white};
    font-size: 12px;
    color: ${color.cgrey600};
    cursor: pointer;
    transition: color 0.15s ease;
    &:hover:not(:disabled) {
      color: ${color.cgrey600};
    }
    &:disabled {
      cursor: default;
      color: ${color.cgrey200};
      background: ${color.white};
    }
  `,
};
