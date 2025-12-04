
import type { JojikMunuiListItem } from '@/domain/jaewonsaeng/jojik-munui/api';

import {
  MissingJojikPanel,
  NoneSelectedPanel,
  RightsidePanelsContainer,
  SingleSelectionPanel,
  MultiSelectionPanel,
} from '../components';

export type JojikMunuiRightsidePanelsProps = {
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export function MissingJojikPanels() {
  return (
    <RightsidePanelsContainer>
      <MissingJojikPanel />
    </RightsidePanelsContainer>
  );
}

export function NoneSelectedPanels(_: JojikMunuiRightsidePanelsProps) {
  return (
    <RightsidePanelsContainer>
      <NoneSelectedPanel />
    </RightsidePanelsContainer>
  );
}

export type OneSelectedPanelsProps = JojikMunuiRightsidePanelsProps & {
  jojikMunuiNanoId: string;
  jojikMunuiTitle: string;
};

export function OneSelectedPanels({
  jojikMunuiNanoId,
  jojikMunuiTitle,
  jojikNanoId,
  onAfterMutation,
  isAuthenticated,
}: OneSelectedPanelsProps) {
  return (
    <RightsidePanelsContainer>
      <SingleSelectionPanel
        jojikMunuiNanoId={jojikMunuiNanoId}
        jojikMunuiTitle={jojikMunuiTitle}
        jojikNanoId={jojikNanoId}
        onAfterMutation={onAfterMutation}
        isAuthenticated={isAuthenticated}
      />
    </RightsidePanelsContainer>
  );
}

export type MultipleSelectedPanelsProps = {
  jojikMunuis: JojikMunuiListItem[];
};

export function MultipleSelectedPanels({ jojikMunuis }: MultipleSelectedPanelsProps) {
  return (
    <RightsidePanelsContainer>
      <MultiSelectionPanel jojikMunuis={jojikMunuis} />
    </RightsidePanelsContainer>
  );
}
