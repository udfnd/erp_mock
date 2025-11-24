import type { JusoListItem } from '@/domain/juso/api';

import { cssObj } from '../../styles';

export type MultiSelectionPanelProps = {
  jusos: JusoListItem[];
};

export const MultiSelectionPanel = ({ jusos }: MultiSelectionPanelProps) => (
  <div>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>여러 주소가 선택되었습니다</h2>
      <p css={cssObj.panelSubtitle}>한 번에 하나의 주소만 수정하거나 삭제할 수 있습니다.</p>
    </div>
    <div css={cssObj.panelBody}>
      <p css={cssObj.helperText}>하나의 주소만 선택하거나 새 주소를 추가해 보세요.</p>
      {jusos.length > 0 ? (
        <div css={cssObj.chipList}>
          {jusos.map((juso) => (
            <span key={juso.nanoId} css={cssObj.chip}>
              {juso.jusoName}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  </div>
);
