import * as React from "react";
import type { SVGProps } from "react";
const SvgXCircleBlack = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <circle cx={12} cy={12} r={9} fill="currentColor" />
    <circle cx={12} cy={12} r={9} fill="#000" fillOpacity={0.87} />
    <path
      fill="#fff"
      d="M14.216 8.306a1.045 1.045 0 0 1 1.478 1.478l-2.217 2.217 2.217 2.217a1.045 1.045 0 1 1-1.478 1.477L12 13.48l-2.217 2.216a1.045 1.045 0 0 1-1.478-1.477L10.521 12 8.305 9.784a1.045 1.045 0 0 1 1.478-1.477l2.216 2.216z"
    />
  </svg>
);
export default SvgXCircleBlack;
