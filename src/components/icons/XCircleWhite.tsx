import * as React from "react";
import type { SVGProps } from "react";
const SvgXCircleWhite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <circle cx={12} cy={12} r={8} stroke="currentColor" strokeWidth={2} />
    <circle
      cx={12}
      cy={12}
      r={8}
      stroke="#000"
      strokeOpacity={0.87}
      strokeWidth={2}
    />
    <circle
      cx={12}
      cy={12}
      r={8}
      stroke="#fff"
      strokeOpacity={0.13}
      strokeWidth={2}
    />
    <path
      fill="currentColor"
      d="M14.216 8.306a1.045 1.045 0 0 1 1.478 1.478l-2.217 2.217 2.217 2.217a1.045 1.045 0 1 1-1.478 1.477L12 13.48l-2.217 2.216a1.045 1.045 0 0 1-1.478-1.477L10.521 12 8.305 9.784a1.045 1.045 0 0 1 1.478-1.477l2.216 2.216z"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M14.216 8.306a1.045 1.045 0 0 1 1.478 1.478l-2.217 2.217 2.217 2.217a1.045 1.045 0 1 1-1.478 1.477L12 13.48l-2.217 2.216a1.045 1.045 0 0 1-1.478-1.477L10.521 12 8.305 9.784a1.045 1.045 0 0 1 1.478-1.477l2.216 2.216z"
    />
    <path
      fill="#fff"
      fillOpacity={0.13}
      d="M14.216 8.306a1.045 1.045 0 0 1 1.478 1.478l-2.217 2.217 2.217 2.217a1.045 1.045 0 1 1-1.478 1.477L12 13.48l-2.217 2.216a1.045 1.045 0 0 1-1.478-1.477L10.521 12 8.305 9.784a1.045 1.045 0 0 1 1.478-1.477l2.216 2.216z"
    />
  </svg>
);
export default SvgXCircleWhite;
