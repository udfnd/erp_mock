import { RightsidePanelsContainer } from '@/domain/sayongja/section/ListView/SayongjaRightsidePanels/components/RightsidePanelsContainer';
import { CreateSayongjaPanel } from '@/domain/sayongja/section/ListView/SayongjaRightsidePanels/components/CreateSayongjaPanel';
import { MissingGigwanPanel } from '@/domain/sayongja/section/ListView/SayongjaRightsidePanels/components/MissingGigwanPanel';
import { MultiSelectionPanel } from '@/domain/sayongja/section/ListView/SayongjaRightsidePanels/components/SingleSelectionPanel';
import type { MultiSelectionPanelProps } from '@/domain/sayongja/section/ListView/SayongjaRightsidePanels/components/SingleSelectionPanel';
import { QuickActionsPanel } from '@/domain/sayongja/section/ListView/SayongjaRightsidePanels/components/QuickActionsPanel';
import { SingleSelectionPanel } from '@/domain/sayongja/section/ListView/SayongjaRightsidePanels/components/SingleSelectionPanel';
import type { SingleSelectionPanelProps } from '@/domain/sayongja/section/ListView/SayongjaRightsidePanels/components/SingleSelectionPanel';

export type MissingGigwanPanelsProps = Record<string, unknown>;

export const MissingGigwanPanels = (_: MissingGigwanPanelsProps) => (
  <RightsidePanelsContainer>
    <MissingGigwanPanel />
  </RightsidePanelsContainer>
);

export type CreatingPanelsProps = {
  gigwanNanoId: string;
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

export const CreatingPanels = ({
  gigwanNanoId,
  employmentCategoryOptions,
  workTypeOptions,
  onExit,
  onAfterMutation,
}: CreatingPanelsProps) => (
  <RightsidePanelsContainer>
    <CreateSayongjaPanel
      gigwanNanoId={gigwanNanoId}
      onExit={onExit}
      onAfterMutation={onAfterMutation}
      employmentCategoryOptions={employmentCategoryOptions}
      workTypeOptions={workTypeOptions}
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

export const MultipleSelectedPanels = ({ sayongjas }: MultipleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <MultiSelectionPanel sayongjas={sayongjas} />
  </RightsidePanelsContainer>
);
