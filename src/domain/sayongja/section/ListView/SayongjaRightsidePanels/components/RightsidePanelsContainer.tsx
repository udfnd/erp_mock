import type { ReactNode } from 'react';

import { cssObj } from '../../styles';

export const RightsidePanelsContainer = ({ children }: { children: ReactNode }) => (
  <aside css={cssObj.settingsPanel}>{children}</aside>
);
