import type { PropsWithChildren } from 'react';

import { cssObj } from '../../styles';

export const RightsidePanelsContainer = ({ children }: PropsWithChildren) => (
  <aside css={cssObj.settingsPanel}>{children}</aside>
);
