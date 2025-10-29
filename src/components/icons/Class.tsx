import * as React from 'react';
import type { SVGProps } from 'react';
const SvgClass = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="currentColor"
      d="M18 2c1 0 2 1 2 2v17c0 .55-.45 1-1 1H8c-2.21 0-4-1.79-4-4V4c0-1 1-2 2-2zM8 16c-1.1 0-2 .9-2 2s.9 2 2 2h10v-4zm0-8c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1z"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M18 2c1 0 2 1 2 2v17c0 .55-.45 1-1 1H8c-2.21 0-4-1.79-4-4V4c0-1 1-2 2-2zM8 16c-1.1 0-2 .9-2 2s.9 2 2 2h10v-4zm0-8c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1z"
    />
  </svg>
);
export default SvgClass;
