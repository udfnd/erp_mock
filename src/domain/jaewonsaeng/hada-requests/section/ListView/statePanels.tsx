'use client';

import { Button } from '@/common/components';

import { HadaRequestListSectionProps } from './useHadaRequestsListViewSections';
import { SingleSelectionPanel } from './SingleSelectionPanel';
import { cssObj } from './styles';

export type MissingJojikPanelsProps = Record<string, unknown>;

export const MissingJojikPanels = (_: MissingJojikPanelsProps) => (
  <section css={cssObj.panel}>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>조직이 선택되지 않았어요</h2>
    </div>
    <div css={cssObj.panelBody}>상단에서 조직을 선택한 뒤 재원 신청을 확인하세요.</div>
  </section>
);

export type CreatingPanelsProps = {
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
};

export const CreatingPanels = ({ onAfterMutation: _onAfterMutation }: CreatingPanelsProps) => (
  <section css={cssObj.panel}>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>신규 재원 신청 등록</h2>
    </div>
    <div css={cssObj.panelBody}>신규 재원 신청 등록 화면이 준비 중입니다.</div>
  </section>
);

export type NoneSelectedPanelsProps = { onStartCreate: () => void };

export const NoneSelectedPanels = ({ onStartCreate }: NoneSelectedPanelsProps) => (
  <section css={cssObj.panel}>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>재원 신청을 선택하세요</h2>
    </div>
    <div css={cssObj.panelBody}>
      재원 신청을 선택하면 상세 정보를 확인하고 승인/반려할 수 있습니다.
      <br />
      <Button size="sm" onClick={onStartCreate}>
        수동 등록 시작
      </Button>
    </div>
  </section>
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
  <section css={cssObj.panel}>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>다중 선택</h2>
    </div>
    <div css={cssObj.panelBody}>{requests.length}개의 재원 신청이 선택되었습니다.</div>
  </section>
);
