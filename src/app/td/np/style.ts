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
    min-height: 100vh;
    background-color: ${color.white};
  `,

  secondaryNavStyle: css`
    display: flex;
    flex-direction: column;
    flex: 1;
  `,

  tertiaryNavStyle: css`
    display: flex;
    flex-direction: column;
    flex: 1;
  `,
};
