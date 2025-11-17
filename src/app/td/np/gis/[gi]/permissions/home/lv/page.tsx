'use client';

import { useParams } from 'next/navigation';

import { useAuth } from '@/global/auth';
import {
  PermissionListSection,
  PermissionSettingsSection,
  usePermissionListViewSections,
} from '@/domain/permission/section';
import { cssObj } from './style';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanPermissionListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions, pageSizeOptions, permissionTypeOptions } =
    usePermissionListViewSections({ gigwanNanoId, isAuthenticated });

  const listSectionAllProps = {
    ...listSectionProps,
    sortOptions,
    pageSizeOptions,
    permissionTypeOptions,
  };

  const pageKey = gigwanNanoId || 'no-gi';

  return (
    <div css={cssObj.page} key={pageKey}>
      <PermissionListSection {...listSectionAllProps} />
      <PermissionSettingsSection {...settingsSectionProps} />
    </div>
  );
}
