import { cssObj } from '../../styles';

export function MissingJojikPanel() {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>조직 정보 없음</h2>
      </div>
      <div css={cssObj.panelBody}>
        <p css={cssObj.helperText}>조직을 선택해 주세요.</p>
      </div>
    </>
  );
}
