import type { ReactNode } from 'react';

import { CreateOebuLinkPanel } from '../components/CreateOebuLinkPanel';
import { MissingJojikPanel } from '../components/MissingJojikPanel';
import { AuthenticationRequiredPanel } from '../components/AuthenticationRequiredPanel';
import { MultiSelectionPanel, type MultiSelectionPanelProps } from '../components/SingleSelectionPanel';
import { QuickActionsPanel } from '../components/QuickActionsPanel';
import { RightsidePanelsContainer } from '../components/RightsidePanelsContainer';
import { SingleSelectionPanel, type SingleSelectionPanelProps } from '../components/SingleSelectionPanel';
import type { LinkIconOption } from '../../linkIconOptions';

export type OebuLinkRightsidePanelState = {
  noneSelected: ReactNode;
  oneSelected: ReactNode;
  multipleSelected: ReactNode;
};

export type MissingJojikPanelsProps = Record<string, never>;

export const MissingJojikPanels = () => (
  <RightsidePanelsContainer>
    <MissingJojikPanel />
  </RightsidePanelsContainer>
);

export type AuthenticationRequiredPanelsProps = Record<string, never>;

export const AuthenticationRequiredPanels = () => (
  <RightsidePanelsContainer>
    <AuthenticationRequiredPanel />
  </RightsidePanelsContainer>
);

export type CreatingPanelsProps = {
  jojikNanoId: string;
  iconOptions: LinkIconOption[];
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

export const CreatingPanels = ({ jojikNanoId, iconOptions, onExit, onAfterMutation }: CreatingPanelsProps) => (
  <RightsidePanelsContainer>
    <CreateOebuLinkPanel
      jojikNanoId={jojikNanoId}
      onExit={onExit}
      onAfterMutation={onAfterMutation}
      iconOptions={iconOptions}
    />
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

export const MultipleSelectedPanels = ({ oebuLinks }: MultipleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <MultiSelectionPanel oebuLinks={oebuLinks} />
  </RightsidePanelsContainer>
);
