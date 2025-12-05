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

  salesDiv: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    padding: 8px;
    background-color: ${color.cgrey10};

    > span {
      ${typography.captionB};
      color: ${color.cgrey500};
    }
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

  sectionActions: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  `,

  panelLabelSection: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
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

  helperText: css`
    font-size: 13px;
    color: ${color.cgrey400};
  `,

  jaewonsaengInfoSection: (isHwalseong: boolean) => css`
    display: flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 0 12px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    background: ${isHwalseong ? color.white : color.cgrey100};
  `,

  jaewonsaengName: css`
    ${typography.bodySmallR};
  `,

  jaewonsaengNickname: css`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    ${typography.captionR};
  `,

  hadaInfoSection: css`
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    padding: 12px;
    margin-top: 8px;

    > p {
      ${typography.bodySmallM};
      margin-bottom: 8px;
    }
  `,

  hadaInfoBox: css`
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  hadaProfileWrapper: css`
    display: flex;
    gap: 8px;
  `,

  hadaImage: css`
    border-radius: 4px;
  `,

  hadaNameBox: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    ${typography.bodySmallSB};
  `,

  hadaName: css`
    display: flex;
    align-items: center;
    gap: 4px;
    ${typography.bodySmallSB};
  `,

  hadaSikbyeolja: css`
    ${typography.bodySmallR};
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

  hadaInfo: css`
    display: flex;
    align-items: center;
    gap: 4px;
    ${typography.bodySmallR};
    color: ${color.cgrey600};

    > span {
      ${typography.bodySmallSB};
    }
  `,

  munuiWrapper: css`
    border: 1px solid ${color.cgrey100};
    background: ${color.cgrey10};
    padding: 16px;
    border-radius: 8px;
  `,

  munuiTitle: css`
    ${typography.bodySmallSB};
    margin-bottom: 4px;
  `,

  munuiDate: css`
    display: flex;
    align-items: center;
    gap: 4px;
    ${typography.captionR};
    color: ${color.cgrey400};
    margin-bottom: 8px;

    > span {
      ${typography.captionR};
    }
  `,

  munuiContent: css`
    ${typography.bodySmallR};
    display: flex;
    align-items: stretch;
  `,

  linkedObjectItem: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    padding: 0 12px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
  `,

  linkedObjectName: css`
    display: flex;
    align-items: center;
    gap: 4px;
    ${typography.bodySmallR};
  `,

  dapbyeonHeaderWrapper: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  dapbyeonSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  chwisojaProfileWrapper: css`
    > label {
      ${typography.bodySmallM};
      color: ${color.cgrey500};
      margin-bottom: 4px;
    }
  `,

  noDapbyeonText: css`
    padding: 24px 16px;
    background-color: ${color.cgrey10};
    border-radius: 8px;
    ${typography.bodySmallR};
    color: ${color.cgrey300};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,

  dapbyeonCancelText: css`
    ${typography.bodySmallSB};
    color: ${color.cgrey300};
    margin-bottom: 16px;
  `,

  dapbyeonDateInfo: css`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 4px;
    ${typography.captionB};
    color: ${color.cgrey400};
    > p {
      ${typography.captionR};
    }
  `,

  dapbyeonContent: css`
    padding: 12px;
    border: 1px solid ${color.cgrey100};
    border-radius: 8px;
    background: ${color.cgrey10};
    ${typography.bodySmallM};
    color: ${color.cgrey700};
    white-space: pre-wrap;
    word-break: break-word;

    > p {
      margin-top: 8px;
    }
  `,

  dapbyeonInputArea: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  dapbyeonWritterImage: css`
    border: 1px solid ${color.cgrey100};
    border-radius: 50%;
  `,

  dapbyeonWritterName: css`
    ${typography.bodySmallR};
    flex: 1;
  `,

  dapbyeonBubbleContainer: css`
    position: relative;
    margin-top: 16px;
  `,

  dapbyeonBubble: css`
    position: relative;
    border: 1px solid ${color.blue};
    border-radius: 8px;
    padding: 16px;
    background-color: ${color.cgrey10};

    &::before {
      content: '';
      position: absolute;
      top: -11px;
      left: 20px;
      width: 20px;
      height: 20px;
      background-color: ${color.cgrey10};
      border: 1px solid ${color.blue};
      border-radius: 6px 0 0 0;
      border-right: none;
      border-bottom: none;
      transform: rotate(45deg);
    }
  `,

  dapbyeonTextarea: css`
    background-color: ${color.cgrey10};
    width: 100%;
    min-height: 200px;
    border: none;
    outline: none;
    resize: none;
    font-size: 14px;
    line-height: 1.5;
    font-family: inherit;
    margin-bottom: 12px;
  `,

  dapbyeonFooter: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  `,

  dapbyeonCharCount: css`
    ${typography.captionR};
    color: ${color.cgrey300};
  `,

  dapbyeonActions: css`
    display: flex;
    gap: 8px;
  `,
};
