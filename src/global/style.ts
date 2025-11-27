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
    font-family: var(--font-pretendard);
  }

  body,
  textarea {
    line-height: 1.5;
    background-color: #ffffff;
    color: #010821;
  }

  textarea,
  input,
  button,
  select,
  option {
    line-height: inherit;
    font-family: inherit;
    color: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
