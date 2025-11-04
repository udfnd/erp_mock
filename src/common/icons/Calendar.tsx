import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19 11H5c-.55 0-1 .45-1 1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7c0-.55-.45-1-1-1m-1 7c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h2c.55 0 1 .45 1 1z"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M19 11H5c-.55 0-1 .45-1 1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7c0-.55-.45-1-1-1m-1 7c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h2c.55 0 1 .45 1 1z"
    />
    <path
      fill="currentColor"
      d="M18 5h-1V4c0-.55-.45-1-1-1s-1 .45-1 1v1H9V4c0-.55-.45-1-1-1s-1 .45-1 1v1H6c-1.1 0-2 .9-2 2v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V7c0-1.1-.9-2-2-2"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M18 5h-1V4c0-.55-.45-1-1-1s-1 .45-1 1v1H9V4c0-.55-.45-1-1-1s-1 .45-1 1v1H6c-1.1 0-2 .9-2 2v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V7c0-1.1-.9-2-2-2"
    />
  </svg>
);
export default SvgCalendar;
