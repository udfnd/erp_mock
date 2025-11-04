import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSwitchOn = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <rect width={20} height={14} x={2} y={5} fill="#5F83FF" rx={7} />
    <circle cx={15} cy={12} r={5} fill="#fff" />
  </svg>
);
export default SvgSwitchOn;
