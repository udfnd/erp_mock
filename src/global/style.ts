import { css } from '@emotion/react';

export const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
    -webkit-font-smoothing: antialiased;
  }

  body {
    line-height: 1.5;
    font-family: var(--font-pretendard);
    background-color: #ffffff;
    color: #010821;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
