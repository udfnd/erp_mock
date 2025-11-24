import { Button } from '@/common/components';

import { cssObj } from '../../styles';

type QuickActionsPanelProps = {
  onStartCreate: () => void;
};

export const QuickActionsPanel = ({ onStartCreate }: QuickActionsPanelProps) => (
  <div>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>주소를 선택해 주세요</h2>
      <p css={cssObj.panelSubtitle}>
        왼쪽 목록에서 주소를 선택하거나 상단의 추가 버튼을 눌러 새 주소를 만드세요.
      </p>
    </div>
    <div css={cssObj.panelBody}>
      <p css={cssObj.helperText}>선택된 항목이 없으면 상세 정보를 표시할 수 없습니다.</p>
    </div>
    <div css={cssObj.panelFooter}>
      <Button onClick={onStartCreate}>새 주소 추가</Button>
    </div>
  </div>
);
