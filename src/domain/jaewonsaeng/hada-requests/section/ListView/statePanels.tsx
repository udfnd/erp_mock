'use client';

import { Button, Panel, PanelBody, PanelHeader, PanelTitle } from '@/common/components';

import { HadaRequestListSectionProps } from './useHadaRequestsListViewSections';
import { SingleSelectionPanel } from './SingleSelectionPanel';

export type MissingJojikPanelsProps = Record<string, unknown>;

export const MissingJojikPanels = (_: MissingJojikPanelsProps) => (
  <Panel>
    <PanelHeader>
      <PanelTitle>조직이 선택되지 않았어요</PanelTitle>
    </PanelHeader>
    <PanelBody>상단에서 조직을 선택한 뒤 재원 신청을 확인하세요.</PanelBody>
  </Panel>
);

export type CreatingPanelsProps = {
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
};

export const CreatingPanels = ({ onAfterMutation: _onAfterMutation }: CreatingPanelsProps) => (
  <Panel>
    <PanelHeader>
      <PanelTitle>신규 재원 신청 등록</PanelTitle>
    </PanelHeader>
    <PanelBody>신규 재원 신청 등록 화면이 준비 중입니다.</PanelBody>
  </Panel>
);

export type NoneSelectedPanelsProps = { onStartCreate: () => void };

export const NoneSelectedPanels = ({ onStartCreate }: NoneSelectedPanelsProps) => (
  <Panel>
    <PanelHeader>
      <PanelTitle>재원 신청을 선택하세요</PanelTitle>
    </PanelHeader>
    <PanelBody>
      재원 신청을 선택하면 상세 정보를 확인하고 승인/반려할 수 있습니다.
      <br />
      <Button size="sm" onClick={onStartCreate}>
        수동 등록 시작
      </Button>
    </PanelBody>
  </Panel>
);

export type OneSelectedPanelsProps = {
  requestNanoId: string;
  requestName: string;
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export const OneSelectedPanels = (props: OneSelectedPanelsProps) => <SingleSelectionPanel {...props} />;

export type MultipleSelectedPanelsProps = { requests: HadaRequestListSectionProps['data'] };

export const MultipleSelectedPanels = ({ requests }: MultipleSelectedPanelsProps) => (
  <Panel>
    <PanelHeader>
      <PanelTitle>다중 선택</PanelTitle>
    </PanelHeader>
    <PanelBody>{requests.length}개의 재원 신청이 선택되었습니다.</PanelBody>
  </Panel>
);
