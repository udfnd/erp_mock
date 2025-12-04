import { cssObj } from '../../styles';

type Props = {
  children: React.ReactNode;
};

export function RightsidePanelsContainer({ children }: Props) {
  return <div css={cssObj.settingsPanel}>{children}</div>;
}
