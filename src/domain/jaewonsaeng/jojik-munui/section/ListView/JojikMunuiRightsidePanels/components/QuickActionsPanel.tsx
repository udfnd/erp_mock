import { cssObj } from '../../styles';

export const QuickActionsPanel = () => (
  <>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>조직 문의 관리</h2>
    </div>
    <div css={cssObj.panelBody}>
      <p>문의 상세를 선택해서 확인하거나 답변을 남겨주세요.</p>
    </div>
  </>
);
