import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSwitchOff = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <rect width={20} height={14} x={2} y={5} fill="currentColor" rx={7} />
    <rect width={20} height={14} x={2} y={5} fill="#000" fillOpacity={0.7} rx={7} />
    <rect width={20} height={14} x={2} y={5} fill="#fff" fillOpacity={0.82} rx={7} />
    <circle cx={9} cy={12} r={5} fill="#fff" />
  </svg>
);
export default SvgSwitchOff;
