'use client';

import { cssObj } from '../../styles';

export function MissingJojikPanel() {
  return (
    <div css={cssObj.settingsPanel}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>조직 정보 없음</h2>
      </div>
      <div css={cssObj.panelBody}>
        <p css={cssObj.panelText}>조직 정보를 확인할 수 없습니다.</p>
      </div>
    </div>
  );
}
