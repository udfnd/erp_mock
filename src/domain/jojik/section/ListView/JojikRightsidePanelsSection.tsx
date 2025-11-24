import type { JojikListItem } from '@/domain/jojik/api';

import {
  JojikCreatingPanels,
  JojikMissingGigwanPanels,
  JojikMultipleSelectedPanels,
  JojikNoneSelectedPanels,
  JojikSingleSelectedPanels,
} from '@/domain/jojik/section/ListView/JojikRightsidePanels/statePanels';
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
    const panel = <JojikMissingGigwanPanels />;

    return {
      noneSelected: panel,
      oneSelected: panel,
      multipleSelected: panel,
    };
  }

  if (isCreating) {
    const creatingPanel = (
      <JojikCreatingPanels
        gigwanNanoId={gigwanNanoId}
        onExitCreate={onExitCreate}
        onAfterMutation={onAfterMutation}
      />
    );

    return {
      noneSelected: creatingPanel,
      oneSelected: creatingPanel,
      multipleSelected: creatingPanel,
    };
  }

  const noneSelectedPanel = <JojikNoneSelectedPanels onStartCreate={onStartCreate} />;

  const [primarySelectedJojik] = selectedJojiks;

  const singleSelectedPanel = primarySelectedJojik ? (
    <JojikSingleSelectedPanels
      jojikNanoId={primarySelectedJojik.nanoId}
      jojikName={primarySelectedJojik.name}
      onAfterMutation={onAfterMutation}
      isAuthenticated={isAuthenticated}
    />
  ) : (
    noneSelectedPanel
  );

  const multipleSelectedPanel = (
    <JojikMultipleSelectedPanels jojiks={selectedJojiks as JojikListItem[]} />
  );

  return {
    noneSelected: noneSelectedPanel,
    oneSelected: singleSelectedPanel,
    multipleSelected: multipleSelectedPanel,
  };
}

export type { JojikRightsidePanelsSectionProps, JojikRightsidePanels };
