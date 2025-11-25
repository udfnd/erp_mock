import type { Permission } from '@/domain/permission/api';
import {
  MissingGigwanPanel,
  MultiSelectionPanel,
  NoSelectionPanel,
  RightsidePanelsContainer,
  SinglePermissionPanel,
  type SinglePermissionPanelProps,
} from '@/domain/permission/section/ListView/PermissionRightsidePanels/components';

export type PermissionMissingGigwanPanelsProps = Record<string, unknown>;

export const PermissionMissingGigwanPanels = (_: PermissionMissingGigwanPanelsProps) => (
  <RightsidePanelsContainer>
    <MissingGigwanPanel />
  </RightsidePanelsContainer>
);

export type PermissionNoneSelectedPanelsProps = Record<string, unknown>;

export const PermissionNoneSelectedPanels = (_: PermissionNoneSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <NoSelectionPanel />
  </RightsidePanelsContainer>
);

export type PermissionSingleSelectedPanelsProps = SinglePermissionPanelProps;

export const PermissionSingleSelectedPanels = (props: PermissionSingleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <SinglePermissionPanel {...props} />
  </RightsidePanelsContainer>
);

export type PermissionMultipleSelectedPanelsProps = { permissions: Permission[] };

export const PermissionMultipleSelectedPanels = ({
  permissions,
}: PermissionMultipleSelectedPanelsProps) => (
  <RightsidePanelsContainer>
    <MultiSelectionPanel permissions={permissions} />
  </RightsidePanelsContainer>
);
