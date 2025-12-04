'use client';

import { RightsidePanelsContainer, QuickActionsPanel, SingleSelectionPanel } from '../components';
import type { HadaRequestListSectionProps } from '../../useHadaRequestsListViewSections';
import { cssObj } from '../../styles';

export type MissingJojikPanelsProps = Record<string, unknown>;

export const MissingJojikPanels = (_: MissingJojikPanelsProps) => (
  <RightsidePanelsContainer>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>조직이 선택되지 않았어요</h2>
    </div>
    <div css={cssObj.panelBody}>상단에서 조직을 선택한 뒤 재원 신청을 확인하세요.</div>
  </RightsidePanelsContainer>
);

export type CreatingPanelsProps = {
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
};

export const CreatingPanels = ({ onAfterMutation: _onAfterMutation }: CreatingPanelsProps) => (
  <RightsidePanelsContainer>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>신규 재원 신청 등록</h2>
    </div>
    <div css={cssObj.panelBody}>신규 재원 신청 등록 화면이 준비 중입니다.</div>
  </RightsidePanelsContainer>
);

export const NoneSelectedPanels = () => (
  <RightsidePanelsContainer>
    <QuickActionsPanel />
  </RightsidePanelsContainer>
);

export type OneSelectedPanelsProps = {
  requestNanoId: string;
  requestName: string;
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export const OneSelectedPanels = (props: OneSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <SingleSelectionPanel {...props} />
  </RightsidePanelsContainer>
);

export type MultipleSelectedPanelsProps = { requests: HadaRequestListSectionProps['data'] };

export const MultipleSelectedPanels = ({ requests }: MultipleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>하다 신청 {requests.length}개 설정</h2>
    </div>
    <div css={cssObj.panelBody}>
      <div css={cssObj.salesDiv}>
        <span>준비중입니다.</span>
      </div>
    </div>
  </RightsidePanelsContainer>
);
