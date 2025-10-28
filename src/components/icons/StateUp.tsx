import * as React from 'react';

import type { SVGProps } from 'react';

const SvgStateUp = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14.305 9.588c-.79-.882-1.184-1.323-1.66-1.483a2.03 2.03 0 0 0-1.29 0c-.476.16-.87.601-1.66 1.483l-1.804 2.016c-1.258 1.405-1.887 2.108-1.891 2.7-.004.515.252 1.003.695 1.326.509.37 1.506.37 3.501.37h3.608c1.995 0 2.992 0 3.501-.37.443-.323.699-.81.695-1.326-.004-.592-.633-1.295-1.891-2.7z"
    />
  </svg>
);
export default SvgStateUp;
