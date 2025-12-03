import { Button } from '@/common/components';

import { cssObj } from '../../styles';

type QuickActionsPanelProps = {
  onStartCreate: () => void;
};

export const QuickActionsPanel = ({ onStartCreate }: QuickActionsPanelProps) => (
  <>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>재원 신청 관리</h2>
      <p css={cssObj.panelSubtitle}>신청을 선택하거나 수동으로 등록할 수 있습니다.</p>
    </div>
    <div css={cssObj.panelBody}>
      <p css={cssObj.desc}>
        재원 신청을 선택하면 상세 정보를 확인하고 승인/반려하거나 재원생을 연결할 수 있습니다.
      </p>
      <div css={cssObj.sectionActions}>
        <Button variant="secondary" size="medium" onClick={onStartCreate}>
          신청 수동 등록
        </Button>
      </div>
    </div>
  </>
);
