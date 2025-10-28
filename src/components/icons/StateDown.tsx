import * as React from 'react';

import type { SVGProps } from 'react';

const SvgStateDown = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.695 14.411c.79.882 1.184 1.323 1.66 1.483.416.14.874.14 1.29 0 .476-.16.87-.6 1.66-1.483l1.804-2.015c1.258-1.406 1.887-2.108 1.891-2.7.004-.516-.252-1.004-.695-1.326C16.796 8 15.8 8 13.804 8h-3.608c-1.995 0-2.992 0-3.501.37-.443.322-.699.81-.695 1.325.004.593.633 1.295 1.891 2.7z"
    />
  </svg>
);
export default SvgStateDown;
