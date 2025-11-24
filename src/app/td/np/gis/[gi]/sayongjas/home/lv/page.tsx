'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { useAuth } from '@/global/auth';
import {
  SayongjaListSection,
  SayongjaSettingsSection,
  useSayongjaListViewSections,
} from '@/domain/sayongja/section/ListView';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanSayongjaListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');
  const { isAuthenticated } = useAuth();

  const {
    listSectionProps,
    settingsSectionProps,
    sortOptions,
    isHwalseongFilterOptions,
    jojikFilterOptions,
    employmentCategoryOptions,
    workTypeOptions,
  } = useSayongjaListViewSections({ gigwanNanoId, isAuthenticated });

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
      jojikFilterOptions,
      employmentCategoryOptions,
      workTypeOptions,
      isHwalseongFilterOptions,
    }),
    [
      employmentCategoryOptions,
      isHwalseongFilterOptions,
      jojikFilterOptions,
      listSectionProps,
      sortOptions,
      workTypeOptions,
    ],
  );

  const baseSettingsProps = useMemo(
    () => ({
      ...settingsSectionProps,
      employmentCategoryOptions,
      workTypeOptions,
    }),
    [employmentCategoryOptions, settingsSectionProps, workTypeOptions],
  );

  const pageKey = gigwanNanoId || 'no-gi';

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedSayongjas}
      NoneSelectedComponent={<SayongjaSettingsSection {...baseSettingsProps} selectedSayongjas={[]} />}
      OneSelectedComponent={
        <SayongjaSettingsSection
          {...baseSettingsProps}
          selectedSayongjas={settingsSectionProps.selectedSayongjas.slice(0, 1)}
        />
      }
      MultipleSelectedComponent={<SayongjaSettingsSection {...baseSettingsProps} />}
    >
      <SayongjaListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
