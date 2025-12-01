'use client';

import { css } from '@emotion/react';

import { color } from '@/style/color';
import { spacing } from '@/style/primitive';
import { typography } from '@/style';

export const cssObj = {
  navContainer: css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-top: 4px;
    padding-left: 8px;
    background: ${color.cgrey10};
    box-sizing: border-box;
  `,

  navList: css`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: ${spacing.sm};
    align-items: center;
    overflow-x: auto;
    width: 100%;
  `,

  navListItem: css`
    flex-shrink: 0;
  `,

  secondaryNavButton: (isActive: boolean) => css`
    display: flex;
    padding: 2px 6px 3px 6px;
    justify-content: center;
    align-items: center;
    color: ${isActive ? color.black : color.cgrey300};
    ${typography.bodySmallSB};
    background-color: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:not(:disabled):hover {
      background-color: ${color.cgrey500}0D;
    }

    &:not(:disabled):active {
      background-color: ${color.cgrey500}1A;
    }
  `,
};
