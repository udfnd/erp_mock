'use client';

import { css } from '@emotion/react';

export const permissionListViewCss = {
  panel: css`
    width: 360px;
    border-left: 1px solid #e5e7eb;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
  `,
  panelHeader: css`
    margin-bottom: 12px;
  `,
  panelTitle: css`
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 4px;
  `,
  panelSubtitle: css`
    margin: 0;
    color: #6b7280;
    font-size: 13px;
  `,
  panelBody: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  panelSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  panelLabel: css`
    font-size: 13px;
    color: #4b5563;
  `,
  helperText: css`
    color: #6b7280;
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
    background: #f3f4f6;
    color: #374151;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
  `,
  listBox: css`
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px;
    max-height: 240px;
    overflow: auto;
  `,
  listRow: css`
    padding: 6px 8px;
    border-radius: 6px;
    &:hover {
      background: #f9fafb;
    }
  `,
  addUserContainer: css`
    position: relative;
  `,
  addUserPopup: css`
    position: absolute;
    right: calc(100% + 12px);
    top: 0;
    width: 320px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 10;
  `,
  popupActions: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
  `,
};
