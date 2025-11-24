import type { JojikListItem } from '@/domain/jojik/api';
import {
  CreateJojikPanel,
  MissingGigwanPanel,
  MultiSelectionPanel,
  QuickActionsPanel,
  RightsidePanelsContainer,
  SingleSelectionPanel,
} from '@/domain/jojik/section/ListView/JojikRightsidePanels/components';

export type JojikMissingGigwanPanelsProps = Record<string, never>;

export const JojikMissingGigwanPanels = (_: JojikMissingGigwanPanelsProps) => (
  <RightsidePanelsContainer>
    <MissingGigwanPanel />
  </RightsidePanelsContainer>
);

export type JojikCreatingPanelsProps = {
  gigwanNanoId: string;
  onExitCreate: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

export const JojikCreatingPanels = ({
  gigwanNanoId,
  onExitCreate,
  onAfterMutation,
}: JojikCreatingPanelsProps) => (
  <RightsidePanelsContainer>
    <CreateJojikPanel
      gigwanNanoId={gigwanNanoId}
      onExit={onExitCreate}
      onAfterMutation={onAfterMutation}
    />
  </RightsidePanelsContainer>
);

export type JojikNoneSelectedPanelsProps = {
  onStartCreate: () => void;
};

export const JojikNoneSelectedPanels = ({ onStartCreate }: JojikNoneSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <QuickActionsPanel onStartCreate={onStartCreate} />
  </RightsidePanelsContainer>
);

export type JojikSingleSelectedPanelsProps = {
  jojikNanoId: string;
  jojikName: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export const JojikSingleSelectedPanels = ({
  jojikNanoId,
  jojikName,
  onAfterMutation,
  isAuthenticated,
}: JojikSingleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <SingleSelectionPanel
      jojikNanoId={jojikNanoId}
      jojikName={jojikName}
      onAfterMutation={onAfterMutation}
      isAuthenticated={isAuthenticated}
    />
  </RightsidePanelsContainer>
);

export type JojikMultipleSelectedPanelsProps = {
  jojiks: JojikListItem[];
};

export const JojikMultipleSelectedPanels = ({ jojiks }: JojikMultipleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <MultiSelectionPanel jojiks={jojiks} />
  </RightsidePanelsContainer>
);
