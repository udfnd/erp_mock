import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCheckboxUncheckedActive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <rect width={16} height={16} x={4} y={4} stroke="currentColor" strokeWidth={2} rx={3} />
    <rect
      width={16}
      height={16}
      x={4}
      y={4}
      stroke="#000"
      strokeOpacity={0.7}
      strokeWidth={2}
      rx={3}
    />
    <rect
      width={16}
      height={16}
      x={4}
      y={4}
      stroke="#fff"
      strokeOpacity={0.82}
      strokeWidth={2}
      rx={3}
    />
  </svg>
);
export default SvgCheckboxUncheckedActive;
