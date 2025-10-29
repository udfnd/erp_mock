import * as React from 'react';
import type { SVGProps } from 'react';
const SvgFile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12 3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1h-6a1 1 0 0 1-1-1z"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M12 3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1h-6a1 1 0 0 1-1-1z"
    />
    <path
      fill="currentColor"
      d="M14 7V2.604a.25.25 0 0 1 .427-.177l5.146 5.146a.25.25 0 0 1-.177.427H15a1 1 0 0 1-1-1"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M14 7V2.604a.25.25 0 0 1 .427-.177l5.146 5.146a.25.25 0 0 1-.177.427H15a1 1 0 0 1-1-1"
    />
  </svg>
);
export default SvgFile;
