'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { extractGigwanNanoId } from '@/common/utils';
import { useAuth } from '@/global/auth';
import {
  SayongjaListSection,
  createSayongjaRightsidePanels,
  useSayongjaListViewSections,
} from '@/domain/sayongja/section/ListView';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanSayongjaListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = extractGigwanNanoId(params?.gi);
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

  const rightsidePanels = useMemo(
    () =>
      createSayongjaRightsidePanels({
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
      NoneSelectedComponent={rightsidePanels.noneSelected}
      OneSelectedComponent={rightsidePanels.oneSelected}
      MultipleSelectedComponent={rightsidePanels.multipleSelected}
    >
      <SayongjaListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
