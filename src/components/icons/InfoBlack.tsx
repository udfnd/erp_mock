import * as React from "react";
import type { SVGProps } from "react";
const SvgInfoBlack = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <circle cx={12} cy={12} r={10} fill="currentColor" />
    <circle cx={12} cy={12} r={10} fill="#000" fillOpacity={0.87} />
    <path fill="#fff" d="M13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
    <rect width={2} height={7} x={11} y={10} fill="#fff" rx={1} />
  </svg>
);
export default SvgInfoBlack;
