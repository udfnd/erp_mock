import * as React from "react";
import type { SVGProps } from "react";
const SvgPicture = (props: SVGProps<SVGSVGElement>) => (
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
      d="M17 3H7C4.79 3 3 4.79 3 7v10c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4M7 5h10c1.1 0 2 .9 2 2v4.97L16 9l-4.5 5-3-2.03-3.48 2.93V7c0-1.1.9-2 2-2z"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M17 3H7C4.79 3 3 4.79 3 7v10c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4M7 5h10c1.1 0 2 .9 2 2v4.97L16 9l-4.5 5-3-2.03-3.48 2.93V7c0-1.1.9-2 2-2z"
    />
    <path fill="currentColor" d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
    />
  </svg>
);
export default SvgPicture;
