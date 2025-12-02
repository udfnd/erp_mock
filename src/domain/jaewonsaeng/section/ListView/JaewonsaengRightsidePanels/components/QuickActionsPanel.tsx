import { Button } from '@/common/components';
import { MagicIcon } from '@/common/icons';

import { cssObj } from '../../styles';
import { JaewonCategorySangtaeSection } from './JaewonCategorySangtaeSection';

type QuickActionsPanelProps = {
  onStartCreate: () => void;
  jojikNanoId: string;
};

export const QuickActionsPanel = ({ onStartCreate, jojikNanoId }: QuickActionsPanelProps) => (
  <>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>재원생들 설정</h2>
    </div>
    <div css={cssObj.panelBody}>
      <span css={cssObj.panelSubtitle}>빠른 액션</span>
      <div>
        <Button variant="secondary" size="medium" iconLeft={<MagicIcon />} onClick={onStartCreate}>
          재원생 생성 마법사
        </Button>
      </div>
    </div>
    <JaewonCategorySangtaeSection jojikNanoId={jojikNanoId} />
  </>
);
