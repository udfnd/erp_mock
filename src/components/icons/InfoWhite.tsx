import * as React from "react";
import type { SVGProps } from "react";
const SvgInfoWhite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2} />
    <circle
      cx={12}
      cy={12}
      r={9}
      stroke="#000"
      strokeOpacity={0.87}
      strokeWidth={2}
    />
    <path fill="currentColor" d="M13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
    />
    <rect width={2} height={7} x={11} y={10} fill="currentColor" rx={1} />
    <rect
      width={2}
      height={7}
      x={11}
      y={10}
      fill="#000"
      fillOpacity={0.87}
      rx={1}
    />
  </svg>
);
export default SvgInfoWhite;
