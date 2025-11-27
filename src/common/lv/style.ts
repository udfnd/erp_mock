'use client';

import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  container: css`
    padding: 16px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    background: ${color.white};
    border-right: 1px solid ${color.cgrey100};
  `,

  toolbar: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 12px;
    background: ${color.white};
  `,
  toolbarTopRow: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  searchBox: (hasAction: boolean) => css`
    flex: 1 1 auto;
    min-width: 240px;
    display: flex;
    align-items: center;
    position: relative;
    padding-right: ${hasAction ? 38 : 0}px;
    ${typography.bodySmallR};
    border-radius: 10px;

    :focus {
      outline: 1px solid ${color.blue};
    }
  `,
  searchIcon: css`
    position: absolute;
    left: 12px;
    color: ${color.cgrey400};
  `,
  searchClearButton: css`
    position: absolute;
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    color: ${color.cgrey400};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,
  searchInput: (hasLeftIcon: boolean) => css`
    width: 100%;
    height: 32px;
    padding: 0 12px 0 ${hasLeftIcon ? 30 : 12}px;
    border-radius: 10px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    font-size: 14px;
    color: ${color.cgrey700};

    &:focus {
      outline: none;
      border: 2px solid ${color.blue};
    }
  `,
  searchActionButton: (isDisabled: boolean) => css`
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background-color: ${color.white};
    color: ${color.white};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
  `,

  toolbarControls: css`
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  `,

  searchResultSummary: css`
    margin: 4px 0 8px;
    color: ${color.cgrey600};
    ${typography.bodySmallR};
  `,

  selectLabel: css`
    display: inline-flex;
    flex-direction: column;
    color: ${color.cgrey500};
  `,
  select: css`
    height: 32px;
    padding: 0 12px;
    border-radius: 8px;
    border: none;
    background: ${color.cgrey50};
    color: ${color.cgrey500};
    ${typography.captionB};
  `,

  filterDropdown: css`
    position: relative;
  `,

  filterTrigger: (isOpen: boolean, isActive: boolean) => {
    const isHighlighted = isOpen || isActive;

    return css`
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      height: 32px;
      padding: 0 12px;
      border-radius: 8px;
      border: ${isHighlighted ? `1px solid ${color.blue}` : `1px solid ${color.cgrey50}`};
      background: ${isHighlighted ? color.blue50 : color.cgrey50};
      color: ${isHighlighted ? color.blue : color.cgrey500};
      ${typography.captionB};
      cursor: pointer;
    `;
  },

  filterTriggerPlaceholder: css`
    color: ${color.cgrey400};
    border-color: ${color.cgrey100};
    background: ${color.white};
  `,

  filterTriggerCaret: css`
    font-size: 10px;
    line-height: 1;
  `,

  filterMenu: css`
    position: absolute;
    top: 36px;
    left: 0;
    width: 360px;
    max-height: 540px;
    overflow-y: auto;
    padding: 4px 0;
    border-radius: 8px;
    background: ${color.white};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 10;
  `,

  filterGroup: (hasDivider: boolean) => css`
    padding: 8px 0;
    ${hasDivider ? `border-top: 1px solid ${color.cgrey100};` : ''};
  `,

  filterGroupHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px 4px;
    color: ${color.cgrey500};
    ${typography.captionB};
  `,

  filterGroupValue: css`
    color: ${color.cgrey600};
    ${typography.captionB};
  `,

  filterOption: css`
    width: 100%;
    padding: 6px 12px;
    border: none;
    background: transparent;
    text-align: left;
    ${typography.bodySmallR};
    color: ${color.cgrey700};
    cursor: pointer;

    &:hover {
      background: ${color.cgrey50};
    }
  `,

  filterOptionActive: css`
    color: ${color.blue};
  `,

  filterOptionContent: css`
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  viewChangeButton: css`
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    height: 32px;
    padding: 0 12px;
    border-radius: 8px;
    border: 1px solid ${color.cgrey50};
    background: ${color.cgrey50};
    color: ${color.cgrey500};
    ${typography.captionB};
    cursor: pointer;
  `,

  tableContainer: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    max-height: 100%;
    background: ${color.white};
  `,
  tableWrapperContainer: css`
    position: relative;
    flex: 1;
    min-height: 0;
    background: ${color.white};
  `,
  tableWrapper: css`
    height: 100%;
    min-height: 0;
    overflow: auto;
    background: ${color.white};
  `,
  table: css`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: ${color.white};
  `,
  tableDimmer: css`
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.7);
    border: none;
    padding: 0;
    cursor: pointer;
    z-index: 2;
  `,
  tableHeadRow: css`
    background: ${color.white};
  `,
  tableHeaderCell: css`
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 8px;
    text-align: left;
    ${typography.bodySmallSB};
    color: ${color.cgrey500};
    border-bottom: 1px solid ${color.cgrey100};
    background: ${color.white};

    &:first-of-type {
      width: 24px;
      padding-left: 0;
      padding-right: 8px;
    }

    &:nth-of-type(2) {
      padding-left: 0;
    }
  `,
  columnMaxWidth: (maxWidth: number) => css`
    max-width: ${maxWidth}px;
    width: ${maxWidth}px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  selectionCell: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
  `,
  headerActionCell: css`
    display: flex;
    justify-content: flex-end;
  `,
  addElementButton: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 120px;
    height: 24px;
    border: none;
    color: ${color.white};
    border-radius: 6px;
    background-color: ${color.cgrey300};
    ${typography.captionB};
    cursor: pointer;
  `,
  tableCell: css`
    padding: 8px;
    border-bottom: 1px solid ${color.cgrey100};
    ${typography.bodySmallR};
    color: ${color.black};
    background: ${color.white};

    &:first-of-type {
      width: 24px;
      padding-left: 0;
      padding-right: 8px;
    }

    &:nth-of-type(2) {
      padding-left: 0;
    }
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
    padding: 8px;
    text-align: center;
    color: ${color.cgrey400};
    font-size: 14px;
    background: ${color.white};
  `,

  footer: css`
    display: flex;
    align-items: center;
    justify-content: center;
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
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    border-radius: 0;
    border: none;
    background: ${color.white};
    color: ${color.cgrey300};
    cursor: pointer;
    transition: color 0.15s ease;
    ${typography.captionB};

    &:hover {
      color: ${color.cgrey600};
    }
  `,

  paginationPageButtonActive: css`
    background: ${color.cgrey50};
    border-radius: 8px;
    border: none;
    color: ${color.black};
    ${typography.captionB};
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
