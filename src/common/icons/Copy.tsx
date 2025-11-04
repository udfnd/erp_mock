import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCopy = (props: SVGProps<SVGSVGElement>) => (
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
      d="M21.375 22.5h-15a1.125 1.125 0 0 1-1.125-1.125V6A.75.75 0 0 1 6 5.25h15.375A1.125 1.125 0 0 1 22.5 6.375v15a1.125 1.125 0 0 1-1.125 1.125"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M21.375 22.5h-15a1.125 1.125 0 0 1-1.125-1.125V6A.75.75 0 0 1 6 5.25h15.375A1.125 1.125 0 0 1 22.5 6.375v15a1.125 1.125 0 0 1-1.125 1.125"
    />
    <path
      fill="#010821"
      fillOpacity={0.5}
      d="M5.25 3.75h13.5V2.625A1.125 1.125 0 0 0 17.625 1.5H2.813A1.313 1.313 0 0 0 1.5 2.813v14.812a1.125 1.125 0 0 0 1.125 1.125H3.75V5.25a1.5 1.5 0 0 1 1.5-1.5"
    />
  </svg>
);
export default SvgCopy;
