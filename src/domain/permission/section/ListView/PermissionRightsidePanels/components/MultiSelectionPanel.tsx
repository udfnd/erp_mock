import { cssObj } from '../../styles';
import type { Permission } from '@/domain/permission/api';

type MultiSelectionPanelProps = {
  permissions: Permission[];
};

export function MultiSelectionPanel({ permissions }: MultiSelectionPanelProps) {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>
          {permissions[0].name}외 {permissions.length}개 설정
        </h2>
      </div>
      <div css={cssObj.panelBody}>
        <p css={cssObj.helperText}>현재는 단일 선택에서만 편집 및 연결 관리가 가능합니다.</p>
      </div>
    </>
  );
}
