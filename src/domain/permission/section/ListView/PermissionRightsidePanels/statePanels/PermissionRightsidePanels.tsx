import {
  MissingGigwanPanel,
  MultiSelectionPanel,
  NoSelectionPanel,
  RightsidePanelsContainer,
  SinglePermissionPanel,
  type SinglePermissionPanelProps,
} from '../components';

export type PermissionRightsidePanelsProps = {
  gigwanNanoId: string;
  selectedPermissions: { nanoId: string }[];
  isAuthenticated: boolean;
  onAfterMutation: () => Promise<unknown> | void;
};

export type MissingGigwanPanelsProps = Record<string, never>;

export const MissingGigwanPanels = (_: MissingGigwanPanelsProps) => (
  <RightsidePanelsContainer>
    <MissingGigwanPanel />
  </RightsidePanelsContainer>
);

export const NoneSelectedPanels = () => (
  <RightsidePanelsContainer>
    <NoSelectionPanel />
  </RightsidePanelsContainer>
);

export type OneSelectedPanelsProps = Omit<SinglePermissionPanelProps, 'nanoId'> & {
  permissionNanoId: string;
};

export const OneSelectedPanels = ({ permissionNanoId, ...rest }: OneSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <SinglePermissionPanel nanoId={permissionNanoId} {...rest} />
  </RightsidePanelsContainer>
);

export type MultipleSelectedPanelsProps = Record<string, never>;

export const MultipleSelectedPanels = (_: MultipleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <MultiSelectionPanel />
  </RightsidePanelsContainer>
);
