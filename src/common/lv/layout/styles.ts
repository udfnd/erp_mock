'use client';

import { css } from '@emotion/react';

export const cssObj = {
  page: css`
    display: flex;
    box-sizing: border-box;
    flex: 1 1 0;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 0;
    max-height: 100%;
    align-items: stretch;
    overflow: hidden;
  `,

  leftPane: css`
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
  `,

  rightPane: css`
    width: 400px;
    min-width: 400px;
    max-width: 400px;
    min-height: 0;
    max-height: 100%;
    display: flex;
    position: relative;
    z-index: 2000;
    overflow: visible;
  `,
};
