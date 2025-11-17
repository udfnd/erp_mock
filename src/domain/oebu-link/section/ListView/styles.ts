'use client';

import { css } from '@emotion/react';

import { color } from '@/style';

export const oebuLinkListViewCss = {
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
    gap: 16px;
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
    color: ${color.cgrey600};
  `,
  toolbarSelect: css`
    width: 100%;
    height: 40px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    color: ${color.cgrey700};
    font-size: 14px;
  `,
  helperText: css`
    font-size: 14px;
    color: ${color.cgrey500};
  `,
  buttonRow: css`
    display: flex;
    gap: 8px;
  `,
  destructiveButton: css`
    background: ${color.red500};
    color: ${color.white};
  `,
  iconFilterRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  `,
  chip: css`
    padding: 6px 10px;
    border-radius: 16px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
    cursor: pointer;
    font-size: 13px;
    color: ${color.cgrey700};
    &.active {
      background: ${color.blue50};
      border-color: ${color.blue100};
    }
  `,
};
