import * as React from 'react';
import type { SVGProps } from 'react';
const SvgRadioUncheckedDisabled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <g strokeWidth={2} opacity={0.5}>
      <circle cx={12} cy={12} r={8} stroke="currentColor" />
      <circle cx={12} cy={12} r={8} stroke="#000" strokeOpacity={0.7} />
      <circle cx={12} cy={12} r={8} stroke="#fff" strokeOpacity={0.82} />
    </g>
  </svg>
);
export default SvgRadioUncheckedDisabled;
