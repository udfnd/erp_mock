'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { extractGigwanNanoId } from '@/common/utils';
import { useAuth } from '@/global/auth';
import {
  RightsidePanelsContainer,
  MissingGigwanPanel,
  NoSelectionPanel,
  MultiSelectionPanel,
  SinglePermissionPanel,
} from '@/domain/permission/section/ListView/PermissionRightsidePanels/components';
import { PermissionListSection, usePermissionListViewSections } from '@/domain/permission/section';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanPermissionListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = extractGigwanNanoId(params?.gi);
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions, permissionTypeOptions } =
    usePermissionListViewSections({ gigwanNanoId, isAuthenticated });

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
      permissionTypeOptions,
    }),
    [listSectionProps, permissionTypeOptions, sortOptions],
  );

  const pageKey = gigwanNanoId || 'no-gi';

  const {
    gigwanNanoId: settingsGigwanNanoId,
    selectedPermissions,
    isAuthenticated: settingsIsAuthenticated,
    onAfterMutation,
  } = settingsSectionProps;

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedPermissions}
      isParentMissing={!settingsGigwanNanoId}
      RightPanelWrapperComponent={RightsidePanelsContainer}
      rightPanelProps={{
        gigwanNanoId: settingsGigwanNanoId,
        isAuthenticated: settingsIsAuthenticated,
        onAfterMutation,
      }}
      NoneSelectedComponent={NoSelectionPanel}
      SingleSelectedComponent={SinglePermissionPanel}
      MultipleSelectedComponent={MultiSelectionPanel}
      MissingParentComponent={MissingGigwanPanel}
      getSingleSelectedProps={(selectedItem) => ({
        nanoId: selectedItem.nanoId,
        gigwanNanoId: settingsGigwanNanoId,
        isAuthenticated: settingsIsAuthenticated,
        onAfterMutation,
      })}
    >
      <PermissionListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
