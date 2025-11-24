import type { JojikListItem } from '@/domain/jojik/api';

import {
  CreateJojikPanel,
  MissingGigwanPanel,
  MultiSelectionPanel,
  QuickActionsPanel,
  RightsidePanelsContainer,
  SingleSelectionPanel,
} from '@/domain/jojik/section/ListView/JojikRightsidePanels/components';
import type {
  JojikRightsidePanels,
  JojikRightsidePanelsSectionProps,
} from './useJojikListViewSections';

export function createJojiksRightsidePanels({
  gigwanNanoId,
  selectedJojiks,
  isCreating,
  onStartCreate,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
}: JojikRightsidePanelsSectionProps): JojikRightsidePanels {
  if (!gigwanNanoId) {
    const panel = (
      <RightsidePanelsContainer>
        <MissingGigwanPanel />
      </RightsidePanelsContainer>
    );

    return { noneSelected: panel, oneSelected: panel, multipleSelected: panel };
  }

  if (isCreating) {
    const creatingPanel = (
      <RightsidePanelsContainer>
        <CreateJojikPanel
          gigwanNanoId={gigwanNanoId}
          onExit={onExitCreate}
          onAfterMutation={onAfterMutation}
        />
      </RightsidePanelsContainer>
    );

    return {
      noneSelected: creatingPanel,
      oneSelected: creatingPanel,
      multipleSelected: creatingPanel,
    };
  }

  const noneSelectedPanel = (
    <RightsidePanelsContainer>
      <QuickActionsPanel onStartCreate={onStartCreate} />
    </RightsidePanelsContainer>
  );

  const [primarySelectedJojik] = selectedJojiks;

  const singleSelectedPanel = primarySelectedJojik ? (
    <RightsidePanelsContainer>
      <SingleSelectionPanel
        jojikNanoId={primarySelectedJojik.nanoId}
        jojikName={primarySelectedJojik.name}
        onAfterMutation={onAfterMutation}
        isAuthenticated={isAuthenticated}
      />
    </RightsidePanelsContainer>
  ) : (
    noneSelectedPanel
  );

  const multipleSelectedPanel = (
    <RightsidePanelsContainer>
      <MultiSelectionPanel jojiks={selectedJojiks as JojikListItem[]} />
    </RightsidePanelsContainer>
  );

  return {
    noneSelected: noneSelectedPanel,
    oneSelected: singleSelectedPanel,
    multipleSelected: multipleSelectedPanel,
  };
}

export type { JojikRightsidePanelsSectionProps, JojikRightsidePanels };
