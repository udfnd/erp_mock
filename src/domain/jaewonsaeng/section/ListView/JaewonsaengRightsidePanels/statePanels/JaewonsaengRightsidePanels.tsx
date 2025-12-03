import { RightsidePanelsContainer } from '../components/RightsidePanelsContainer';
import { CreateJaewonsaengPanel } from '../components/CreateJaewonsaengPanel';
import { QuickActionsPanel } from '../components/QuickActionsPanel';
import { SingleSelectionPanel } from '../components/SingleSelectionPanel';
import type { SingleSelectionPanelProps } from '../components/SingleSelectionPanel';
import { cssObj } from '@/domain/sayongja/section';

export type MissingJojikPanelsProps = Record<string, unknown>;

export const MissingJojikPanels = (_: MissingJojikPanelsProps) => (
  <RightsidePanelsContainer>
    <div css={{ padding: 16 }}>조직 정보를 확인할 수 없습니다.</div>
  </RightsidePanelsContainer>
);

export type CreatingPanelsProps = {
  jojikNanoId: string;
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

export const CreatingPanels = ({ jojikNanoId, onExit, onAfterMutation }: CreatingPanelsProps) => (
  <RightsidePanelsContainer>
    <CreateJaewonsaengPanel
      jojikNanoId={jojikNanoId}
      onExit={onExit}
      onAfterMutation={onAfterMutation}
    />
  </RightsidePanelsContainer>
);

export type NoneSelectedPanelsProps = { onStartCreate: () => void; jojikNanoId: string };

export const NoneSelectedPanels = ({ onStartCreate, jojikNanoId }: NoneSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <QuickActionsPanel onStartCreate={onStartCreate} jojikNanoId={jojikNanoId} />
  </RightsidePanelsContainer>
);

export type OneSelectedPanelsProps = SingleSelectionPanelProps;

export const OneSelectedPanels = (props: OneSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <SingleSelectionPanel {...props} />
  </RightsidePanelsContainer>
);

export type MultipleSelectedPanelsProps = { jaewonsaengs: { name: string }[] };

export const MultipleSelectedPanels = ({ jaewonsaengs }: MultipleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>
        {jaewonsaengs[0].name} 외 {jaewonsaengs.length - 1}개 설정
      </h2>
    </div>
    <div css={cssObj.panelBody}>
      <div css={cssObj.salesDiv}>
        <span>준비중입니다.</span>
      </div>
    </div>
  </RightsidePanelsContainer>
);
