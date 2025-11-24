import { cssObj } from '../../styles';

export function MissingGigwanPanel() {
  return (
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>기관이 선택되지 않았습니다</h2>
      <p css={cssObj.panelSubtitle}>URL의 기관 식별자를 확인해 주세요.</p>
      <p css={cssObj.helperText}>기관 ID가 없으면 권한 데이터를 불러올 수 없습니다.</p>
    </div>
  );
}
