import { cssObj } from '../../styles';

type QuickActionsPanelProps = {
  onStartCreate: () => void;
};

export const QuickActionsPanel = ({ onStartCreate }: QuickActionsPanelProps) => (
  <>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>주소들 설정</h2>
    </div>
    <div css={cssObj.panelBody}>
      <span css={cssObj.quickActionText}>빠른 액션</span>
      <div>
        {/*<Button variant="secondary" size="medium" iconLeft={<MagicIcon />} onClick={onStartCreate}>*/}
        {/*  주소 생성 마법사*/}
        {/*</Button>*/}
      </div>
    </div>
  </>
);
