'use client';

import type { JojikAllimRightsidePanelsSectionProps } from '../../useJojikAllimListViewSections';
import {
  NoneSelectedPanel,
  MissingJojikPanel,
  CreateAllimPanel,
  SingleSelectionPanel,
  RightsidePanelsContainer,
} from '../components';

export function NoneSelectedPanels() {
  return (
    <RightsidePanelsContainer>
      <NoneSelectedPanel />
    </RightsidePanelsContainer>
  );
}

export function MissingJojikPanels() {
  return (
    <RightsidePanelsContainer>
      <MissingJojikPanel />
    </RightsidePanelsContainer>
  );
}

export type CreatingPanelsProps = JojikAllimRightsidePanelsSectionProps;

export function CreatingPanels({
  jojikNanoId,
  createBranch,
  createType,
  onAfterMutation,
  onExitCreate,
}: CreatingPanelsProps) {
  if (!createBranch || !createType) {
    return <NoneSelectedPanels />;
  }

  return (
    <RightsidePanelsContainer>
      <CreateAllimPanel
        jojikNanoId={jojikNanoId}
        branch={createBranch}
        type={createType}
        onAfterMutation={onAfterMutation}
        onExit={onExitCreate}
      />
    </RightsidePanelsContainer>
  );
}

export type OneSelectedPanelsProps = {
  allimNanoId: string;
  allimTitle: string;
  jojikNanoId: string;
  onAfterMutation: () => void;
  isAuthenticated: boolean;
};

export function OneSelectedPanels(props: OneSelectedPanelsProps) {
  return (
    <RightsidePanelsContainer>
      <SingleSelectionPanel {...props} />
    </RightsidePanelsContainer>
  );
}

export type MultipleSelectedPanelsProps = {
  allims: Array<{ nanoId: string; title: string }>;
};

export function MultipleSelectedPanels({ allims }: MultipleSelectedPanelsProps) {
  return (
    <RightsidePanelsContainer>
      <div>
        <h2>다중 선택됨</h2>
        <p>{allims.length}개의 알림이 선택되었습니다.</p>
      </div>
    </RightsidePanelsContainer>
  );
}
