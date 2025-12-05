'use client';

import { cssObj } from '../../styles';

export function NoneSelectedPanel() {
  return (
    <div css={cssObj.settingsPanel}>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>알림을 선택해주세요</h2>
      </div>
      <div css={cssObj.panelBody}>
        <p css={cssObj.panelText}>
          좌측 목록에서 알림을 선택하면 상세 정보를 확인하고 수정할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
