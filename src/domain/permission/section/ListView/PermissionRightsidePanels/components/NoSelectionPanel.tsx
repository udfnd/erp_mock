import { cssObj } from '../../styles';

export function NoSelectionPanel() {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>권한을 선택해 주세요</h2>
        <p css={cssObj.panelSubtitle}>
          왼쪽 목록에서 권한을 선택하면 상세 정보와 연결된 사용자를 확인할 수 있습니다.
        </p>
      </div>
      <div css={cssObj.panelBody}>
        <p css={cssObj.helperText}>선택된 권한이 없어서 정보를 표시할 수 없습니다.</p>
      </div>
    </>
  );
}
