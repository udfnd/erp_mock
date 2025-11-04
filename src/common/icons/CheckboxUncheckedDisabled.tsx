import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCheckboxUncheckedDisabled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <g strokeWidth={2} opacity={0.5}>
      <rect width={16} height={16} x={4} y={4} stroke="currentColor" rx={3} />
      <rect width={16} height={16} x={4} y={4} stroke="#000" strokeOpacity={0.7} rx={3} />
      <rect width={16} height={16} x={4} y={4} stroke="#fff" strokeOpacity={0.82} rx={3} />
    </g>
  </svg>
);
export default SvgCheckboxUncheckedDisabled;
