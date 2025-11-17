'use client';

import { css } from '@emotion/react';

import { color } from '@/style';

export const jusoListViewCss = {
  page: css`
    display: flex;
    box-sizing: border-box;
  `,
  listSection: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-right: 1px solid ${color.cgrey100};
    gap: 16px;
    min-width: 0;
  `,
  settingsPanel: css`
    width: 360px;
    background: ${color.white};
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
    color: ${color.blue600};
    font-size: 13px;
  `,
};
