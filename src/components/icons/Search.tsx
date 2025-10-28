import * as React from "react";
import type { SVGProps } from "react";
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16.153 16.125 20 20m-1.778-8.889a7.111 7.111 0 1 1-14.222 0 7.111 7.111 0 0 1 14.222 0"
    />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.87}
      strokeWidth={2}
      d="M16.153 16.125 20 20m-1.778-8.889a7.111 7.111 0 1 1-14.222 0 7.111 7.111 0 0 1 14.222 0"
    />
  </svg>
);
export default SvgSearch;
