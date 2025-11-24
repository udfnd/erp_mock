import type { ReactNode } from 'react';

import { RightsidePanelsContainer } from '../components/RightsidePanelsContainer';
import { CreateJusoPanel } from '../components/CreateJusoPanel';
import { MissingJojikPanel } from '../components/MissingJojikPanel';
import { MultiSelectionPanel, type MultiSelectionPanelProps } from '../components/MultiSelectionPanel';
import { QuickActionsPanel } from '../components/QuickActionsPanel';
import { SingleSelectionPanel, type SingleSelectionPanelProps } from '../components/SingleSelectionPanel';

export type JusoRightsidePanelState = {
  noneSelected: ReactNode;
  oneSelected: ReactNode;
  multipleSelected: ReactNode;
};

export type MissingJojikPanelsProps = Record<string, never>;

export const MissingJojikPanels = (_: MissingJojikPanelsProps) => (
  <RightsidePanelsContainer>
    <MissingJojikPanel />
  </RightsidePanelsContainer>
);

export type CreatingPanelsProps = {
  jojikNanoId: string;
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

export const CreatingPanels = ({ jojikNanoId, onExit, onAfterMutation }: CreatingPanelsProps) => (
  <RightsidePanelsContainer>
    <CreateJusoPanel jojikNanoId={jojikNanoId} onExit={onExit} onAfterMutation={onAfterMutation} />
  </RightsidePanelsContainer>
);

export type NoneSelectedPanelsProps = {
  onStartCreate: () => void;
};

export const NoneSelectedPanels = ({ onStartCreate }: NoneSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <QuickActionsPanel onStartCreate={onStartCreate} />
  </RightsidePanelsContainer>
);

export type OneSelectedPanelsProps = SingleSelectionPanelProps;

export const OneSelectedPanels = (props: OneSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <SingleSelectionPanel {...props} />
  </RightsidePanelsContainer>
);

export type MultipleSelectedPanelsProps = MultiSelectionPanelProps;

export const MultipleSelectedPanels = ({ jusos }: MultipleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <MultiSelectionPanel jusos={jusos} />
  </RightsidePanelsContainer>
);
