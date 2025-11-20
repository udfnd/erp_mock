'use client';

import { css } from '@emotion/react';
import { color } from '@/style';

export const cssObj = {
  layoutStyles: css`
    display: flex;
    min-height: 100vh;
    width: 100%;
    color: ${color.black};
    background-color: ${color.white};
  `,

  contentStyles: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-height: 0;
    background-color: ${color.white};
  `,

  secondaryNavStyle: css`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  `,

  tertiaryNavStyle: css`
    display: flex;
    flex-direction: column;
    flex: 1;
  `,
};
