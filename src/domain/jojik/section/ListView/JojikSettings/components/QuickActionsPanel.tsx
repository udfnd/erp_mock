import { Button } from '@/common/components';
import { Magic } from '@/common/icons';

import { cssObj } from '../../styles';

type QuickActionsPanelProps = {
  onStartCreate: () => void;
};

export function QuickActionsPanel({ onStartCreate }: QuickActionsPanelProps) {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>조직들 설정</h2>
      </div>
      <div css={cssObj.panelBody}>
        <span css={cssObj.panelSubtitle}>빠른 액션</span>
        <div>
          <Button variant="secondary" size="medium" iconLeft={<Magic />} onClick={onStartCreate}>
            조직 생성 마법사
          </Button>
        </div>
      </div>
    </>
  );
}
