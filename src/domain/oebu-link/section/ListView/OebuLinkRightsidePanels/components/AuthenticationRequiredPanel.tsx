import { cssObj } from '../../styles';

export const AuthenticationRequiredPanel = () => (
  <>
    <div css={cssObj.panelHeader}>
      <h2 css={cssObj.panelTitle}>로그인이 필요합니다</h2>
      <p css={cssObj.panelSubtitle}>외부 링크를 보거나 수정하려면 인증이 필요합니다.</p>
    </div>
    <div css={cssObj.panelBody}>
      <p css={cssObj.helperText}>로그인 후 다시 시도해 주세요.</p>
    </div>
  </>
);
