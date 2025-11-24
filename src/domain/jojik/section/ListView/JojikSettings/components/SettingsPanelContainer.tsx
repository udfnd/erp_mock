import type { ReactNode } from 'react';

import { cssObj } from '../../styles';

export function SettingsPanelContainer({ children }: { children: ReactNode }) {
  return <aside css={cssObj.settingsPanel}>{children}</aside>;
}
