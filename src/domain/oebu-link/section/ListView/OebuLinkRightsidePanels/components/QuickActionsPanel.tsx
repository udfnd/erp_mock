import { Button } from '@/common/components';
import { MagicIcon } from '@/common/icons';

import { cssObj } from '../../styles';

type QuickActionsPanelProps = {
  onStartCreate: () => void;
};

export const QuickActionsPanel = ({ onStartCreate }: QuickActionsPanelProps) => (
  <>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>외부 링크 설정</h2>
    </div>
    <div css={cssObj.panelBody}>
      <span css={cssObj.panelSubtitle}>빠른 액션</span>
      <div>
        <Button variant="secondary" size="medium" iconLeft={<MagicIcon />} onClick={onStartCreate}>
          외부 링크 생성
        </Button>
      </div>
    </div>
  </>
);
