'use client';

import type { ReactNode } from 'react';

import { cssObj } from '../../styles';

export type RightsidePanelsContainerProps = {
  children: ReactNode;
};

export function RightsidePanelsContainer({ children }: RightsidePanelsContainerProps) {
  return <div css={cssObj.settingsPanel}>{children}</div>;
}
