'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { extractGigwanNanoId } from '@/common/utils';
import { useAuth } from '@/global/auth';
import {
  PermissionListSection,
  PermissionMissingGigwanPanels,
  PermissionMultipleSelectedPanels,
  PermissionNoneSelectedPanels,
  PermissionSingleSelectedPanels,
  usePermissionListViewSections,
} from '@/domain/permission/section';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanPermissionListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = extractGigwanNanoId(params?.gi);
  const { isAuthenticated } = useAuth();

  const {
    listSectionProps,
    settingsSectionProps,
    sortOptions,
    permissionTypeOptions,
  } = usePermissionListViewSections({ gigwanNanoId, isAuthenticated });

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
      selectedItems={selectedPermissions}
      isParentMissing={!settingsGigwanNanoId}
      rightPanelProps={{
        gigwanNanoId: settingsGigwanNanoId,
        isAuthenticated: settingsIsAuthenticated,
        onAfterMutation,
      }}
      NoneSelectedComponent={PermissionNoneSelectedPanels}
      SingleSelectedComponent={PermissionSingleSelectedPanels}
      MultipleSelectedComponent={PermissionMultipleSelectedPanels}
      MissingParentComponent={PermissionMissingGigwanPanels}
      getMultipleSelectedProps={(permissions) => ({ permissions })}
      getSingleSelectedProps={(selectedItem, props) => ({
        nanoId: selectedItem.nanoId,
        gigwanNanoId: props.gigwanNanoId,
        isAuthenticated: props.isAuthenticated,
        onAfterMutation: props.onAfterMutation,
      })}
    >
      <PermissionListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
