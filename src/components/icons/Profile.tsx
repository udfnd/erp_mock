import * as React from 'react';
import type { SVGProps } from 'react';
const SvgProfile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <path fill="currentColor" d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
    <path fill="#000" fillOpacity={0.87} d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
    <path
      fill="currentColor"
      d="M21 18.33c0 2.94-4.03 2.66-9 2.66s-9 .28-9-2.66S7.03 13 12 13s9 2.39 9 5.33"
    />
    <path
      fill="#000"
      fillOpacity={0.87}
      d="M21 18.33c0 2.94-4.03 2.66-9 2.66s-9 .28-9-2.66S7.03 13 12 13s9 2.39 9 5.33"
    />
  </svg>
);
export default SvgProfile;
