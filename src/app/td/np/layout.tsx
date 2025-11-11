'use client';

import type { ReactNode } from 'react';

import { PrimaryNav } from '@/global/navigation';
import { cssObj } from './style';

type Props = {
  children: ReactNode;
};

export default function NpPrimaryNavigation({ children }: Props) {
  return (
    <div css={cssObj.layoutStyles}>
      <PrimaryNav />
      <div css={cssObj.contentStyles}>{children}</div>
    </div>
  );
}
