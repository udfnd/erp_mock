import * as React from "react";
import type { SVGProps } from "react";
const SvgRadioCheckedDisabled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <g opacity={0.5}>
      <circle cx={12} cy={12} r={9} fill="#5F83FF" />
      <circle cx={12} cy={12} r={4} fill="#fff" />
    </g>
  </svg>
);
export default SvgRadioCheckedDisabled;
