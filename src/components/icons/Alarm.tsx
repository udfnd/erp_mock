import * as React from 'react';
import type { SVGProps } from 'react';
const SvgAlarm = (props: SVGProps<SVGSVGElement>) => (
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
      d="m20.69 15.24-2.4-2.37V8.19C18.29 4.77 15.47 2 12 2S5.71 4.77 5.71 8.19v4.68l-2.4 2.37c-.66.65-.19 1.76.74 1.76h15.9c.93 0 1.4-1.11.74-1.76"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="m20.69 15.24-2.4-2.37V8.19C18.29 4.77 15.47 2 12 2S5.71 4.77 5.71 8.19v4.68l-2.4 2.37c-.66.65-.19 1.76.74 1.76h15.9c.93 0 1.4-1.11.74-1.76"
    />
    <path fill="currentColor" d="M15 19c0 1.66-1.34 3-3 3s-3-1.34-3-3z" />
    <path fill="#000" fillOpacity={0.87} d="M15 19c0 1.66-1.34 3-3 3s-3-1.34-3-3z" />
  </svg>
);
export default SvgAlarm;
