import { cssObj } from '../../styles';

export function MultiSelectionPanel() {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>기능 준비중</h2>
        <p css={cssObj.panelSubtitle}>
          하나의 권한을 선택하면 상세 정보와 연결된 객체를 확인할 수 있습니다.
        </p>
      </div>
      <div css={cssObj.panelBody}>
        <p css={cssObj.helperText}>현재는 단일 선택에서만 편집 및 연결 관리가 가능합니다.</p>
      </div>
    </>
  );
}
