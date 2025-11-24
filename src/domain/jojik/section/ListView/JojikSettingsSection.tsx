import type { JojikListItem } from '@/domain/jojik/api';

import {
  CreateJojikPanel,
  MissingGigwanPanel,
  MultiSelectionPanel,
  QuickActionsPanel,
  SettingsPanelContainer,
  SingleSelectionPanel,
} from './JojikSettings/components';
import type { JojikSettingsPanels, JojikSettingsSectionProps } from './useJojikListViewSections';

export function createJojikSettingsPanels({
  gigwanNanoId,
  selectedJojiks,
  isCreating,
  onStartCreate,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
}: JojikSettingsSectionProps): JojikSettingsPanels {
  if (!gigwanNanoId) {
    const panel = (
      <SettingsPanelContainer>
        <MissingGigwanPanel />
      </SettingsPanelContainer>
    );

    return { noneSelected: panel, oneSelected: panel, multipleSelected: panel };
  }

  if (isCreating) {
    const creatingPanel = (
      <SettingsPanelContainer>
        <CreateJojikPanel
          gigwanNanoId={gigwanNanoId}
          onExit={onExitCreate}
          onAfterMutation={onAfterMutation}
        />
      </SettingsPanelContainer>
    );

    return {
      noneSelected: creatingPanel,
      oneSelected: creatingPanel,
      multipleSelected: creatingPanel,
    };
  }

  const noneSelectedPanel = (
    <SettingsPanelContainer>
      <QuickActionsPanel onStartCreate={onStartCreate} />
    </SettingsPanelContainer>
  );

  const [primarySelectedJojik] = selectedJojiks;

  const singleSelectedPanel = primarySelectedJojik ? (
    <SettingsPanelContainer>
      <SingleSelectionPanel
        jojikNanoId={primarySelectedJojik.nanoId}
        jojikName={primarySelectedJojik.name}
        onAfterMutation={onAfterMutation}
        isAuthenticated={isAuthenticated}
      />
    </SettingsPanelContainer>
  ) : (
    noneSelectedPanel
  );

  const multipleSelectedPanel = (
    <SettingsPanelContainer>
      <MultiSelectionPanel jojiks={selectedJojiks as JojikListItem[]} />
    </SettingsPanelContainer>
  );

  return {
    noneSelected: noneSelectedPanel,
    oneSelected: singleSelectedPanel,
    multipleSelected: multipleSelectedPanel,
  };
}

export type { JojikSettingsSectionProps, JojikSettingsPanels };
