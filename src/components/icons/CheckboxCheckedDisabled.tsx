import * as React from "react";
import type { SVGProps } from "react";
const SvgCheckboxCheckedDisabled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <rect width={18} height={18} x={3} y={3} fill="#ADBFFF" rx={4} />
    <path
      fill="#fff"
      d="M16.764 8.263a.97.97 0 0 1 0 1.268l-5.59 6.206a.752.752 0 0 1-1.142 0l-2.795-3.103a.97.97 0 0 1 0-1.268.752.752 0 0 1 1.141 0l2.224 2.47 5.02-5.573a.752.752 0 0 1 1.142 0"
    />
  </svg>
);
export default SvgCheckboxCheckedDisabled;
