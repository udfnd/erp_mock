'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { JojikListSection, JojikSettingsSection, useJojikListViewSections } from '@/domain/jojik/section/ListView';
import { useAuth } from '@/global/auth';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanJojikListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions, createdAtFilterOptions } =
    useJojikListViewSections({ gigwanNanoId, isAuthenticated });

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
      createdAtFilterOptions,
    }),
    [createdAtFilterOptions, listSectionProps, sortOptions],
  );

  const pageKey = gigwanNanoId || 'no-gi';

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedJojiks}
      NoneSelectedComponent={<JojikSettingsSection {...settingsSectionProps} selectedJojiks={[]} />}
      OneSelectedComponent={
        <JojikSettingsSection
          {...settingsSectionProps}
          selectedJojiks={settingsSectionProps.selectedJojiks.slice(0, 1)}
        />
      }
      MultipleSelectedComponent={<JojikSettingsSection {...settingsSectionProps} />}
    >
      <JojikListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
