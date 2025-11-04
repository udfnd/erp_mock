import * as React from 'react';
import type { SVGProps } from 'react';
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
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
      d="M18.28 4.294a1.008 1.008 0 0 1 1.425 1.425L13.424 12l6.28 6.28a1.007 1.007 0 1 1-1.424 1.425L12 13.424l-6.28 6.28a1.008 1.008 0 0 1-1.425-1.424l6.28-6.282-6.28-6.279a1.008 1.008 0 0 1 1.424-1.425l6.28 6.28z"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M18.28 4.294a1.008 1.008 0 0 1 1.425 1.425L13.424 12l6.28 6.28a1.007 1.007 0 1 1-1.424 1.425L12 13.424l-6.28 6.28a1.008 1.008 0 0 1-1.425-1.424l6.28-6.282-6.28-6.279a1.008 1.008 0 0 1 1.424-1.425l6.28 6.28z"
    />
  </svg>
);
export default SvgClose;
