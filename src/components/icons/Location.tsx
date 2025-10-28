import * as React from "react";
import type { SVGProps } from "react";
const SvgLocation = (props: SVGProps<SVGSVGElement>) => (
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
        d="M12 2c-4.42 0-8 3.58-8 8 0 8.14 8 12 8 12s8-3.86 8-12c0-4.42-3.58-8-8-8"
      />
      <path
        fill="#000"
        fillOpacity={0.87}
        d="M12 2c-4.42 0-8 3.58-8 8 0 8.14 8 12 8 12s8-3.86 8-12c0-4.42-3.58-8-8-8"
      />
      <path fill="#fff" d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M4 2h16v20H4z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgLocation;
