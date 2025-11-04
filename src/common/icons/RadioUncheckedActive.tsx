import * as React from 'react';
import type { SVGProps } from 'react';
const SvgRadioUncheckedActive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <circle cx={12} cy={12} r={8} stroke="currentColor" strokeWidth={2} />
    <circle cx={12} cy={12} r={8} stroke="#000" strokeOpacity={0.7} strokeWidth={2} />
    <circle cx={12} cy={12} r={8} stroke="#fff" strokeOpacity={0.82} strokeWidth={2} />
  </svg>
);
export default SvgRadioUncheckedActive;
