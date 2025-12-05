import { cssObj } from '../../styles';

export function NoneSelectedPanel() {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>학원 / 강사 문의들 관리</h2>
      </div>
      <div css={cssObj.panelBody}>
        <p css={cssObj.panelSubtitle}>빠른 액션</p>
      </div>
    </>
  );
}
