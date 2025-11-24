import { cssObj } from '../../styles';

export const MissingJojikPanel = () => (
  <>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>조직이 선택되지 않았습니다</h2>
      <p css={cssObj.panelSubtitle}>URL의 조직 식별자를 확인해 주세요.</p>
    </div>
    <div css={cssObj.panelBody}>
      <p css={cssObj.helperText}>조직 ID가 없으면 외부 링크 데이터를 불러올 수 없습니다.</p>
    </div>
  </>
);
