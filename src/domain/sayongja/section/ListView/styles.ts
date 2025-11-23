'use client';

import { css } from '@emotion/react';

export const sayongjaListViewCss = {
  panel: css`
    width: 360px;
    flex: 0 0 360px;
    border-left: 1px solid #e5e7eb;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
    min-height: 100%;
    max-height: 100%;
    overflow: auto;
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
  detailList: css`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  detailRow: css`
    display: flex;
    justify-content: space-between;
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  `,
  detailLabel: css`
    color: #4b5563;
    font-size: 13px;
  `,
  detailValue: css`
    color: #111827;
    font-size: 13px;
    font-weight: 600;
  `,
};
