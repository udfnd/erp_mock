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

  const noneSelectedPanel = (
    <RightsidePanelsContainer>
      {!settingsGigwanNanoId ? <MissingGigwanPanel /> : <NoSelectionPanel />}
    </RightsidePanelsContainer>
  );

  const oneSelectedPanel = (() => {
    if (!settingsGigwanNanoId)
      return (
        <RightsidePanelsContainer>
          <MissingGigwanPanel />
        </RightsidePanelsContainer>
      );

    const [primarySelected] = selectedPermissions;

    return primarySelected ? (
      <RightsidePanelsContainer>
        <SinglePermissionPanel
          nanoId={primarySelected.nanoId}
          gigwanNanoId={settingsGigwanNanoId}
          isAuthenticated={settingsIsAuthenticated}
          onAfterMutation={onAfterMutation}
        />
      </RightsidePanelsContainer>
    ) : (
      noneSelectedPanel
    );
  })();

  const multipleSelectedPanel = (
    <RightsidePanelsContainer>
      {!settingsGigwanNanoId ? <MissingGigwanPanel /> : <MultiSelectionPanel />}
    </RightsidePanelsContainer>
  );

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedPermissions}
      NoneSelectedComponent={noneSelectedPanel}
      OneSelectedComponent={oneSelectedPanel}
      MultipleSelectedComponent={multipleSelectedPanel}
    >
      <PermissionListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
