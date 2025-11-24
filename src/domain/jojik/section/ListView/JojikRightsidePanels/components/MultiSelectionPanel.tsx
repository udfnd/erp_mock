import type { JojikListItem } from '@/domain/jojik/api';

import { cssObj } from '../../styles';

type MultiSelectionPanelProps = {
  jojiks: JojikListItem[];
};

export function MultiSelectionPanel({ jojiks }: MultiSelectionPanelProps) {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>
          {jojiks[0].name} 외 {jojiks.length}개 설정
        </h2>
      </div>
      <div css={cssObj.panelBody}>
        <div css={cssObj.salesDiv}>
          <span>준비중입니다.</span>
        </div>
      </div>
    </>
  );
}
