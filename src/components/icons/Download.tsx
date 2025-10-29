import * as React from 'react';
import type { SVGProps } from 'react';
const SvgDownload = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        d="M20 21H4c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v3h14v-3c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1"
      />
      <path
        fill="#000"
        fillOpacity={0.87}
        d="M20 21H4c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v3h14v-3c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1"
      />
      <path
        fill="currentColor"
        d="M16.71 11.29a.996.996 0 0 0-1.41 0l-2.29 2.29V4c0-.55-.45-1-1-1s-1 .45-1 1v9.59L8.72 11.3a.996.996 0 1 0-1.41 1.41l4 4c.09.09.2.17.33.22.12.05.25.08.38.08s.26-.03.38-.08.23-.12.33-.22l4-4a.996.996 0 0 0 0-1.41z"
      />
      <path
        fill="#000"
        fillOpacity={0.87}
        d="M16.71 11.29a.996.996 0 0 0-1.41 0l-2.29 2.29V4c0-.55-.45-1-1-1s-1 .45-1 1v9.59L8.72 11.3a.996.996 0 1 0-1.41 1.41l4 4c.09.09.2.17.33.22.12.05.25.08.38.08s.26-.03.38-.08.23-.12.33-.22l4-4a.996.996 0 0 0 0-1.41z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M3 3h18v18H3z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgDownload;
