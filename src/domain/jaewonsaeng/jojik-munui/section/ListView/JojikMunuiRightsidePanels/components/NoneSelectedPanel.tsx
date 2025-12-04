import { cssObj } from '../../styles';

export function NoneSelectedPanel() {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>문의 선택</h2>
      </div>
      <div css={cssObj.panelBody}>
        <p css={cssObj.helperText}>문의를 선택해 주세요.</p>
      </div>
    </>
  );
}
