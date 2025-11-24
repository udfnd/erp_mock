'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { extractGigwanNanoId } from '@/common/utils';
import {
  JojiksListSection,
  createJojikSettingsPanels,
  useJojikListViewSections,
} from '@/domain/jojik/section/ListView';
import { useAuth } from '@/global/auth';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanJojikListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = extractGigwanNanoId(params?.gi);
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions } = useJojikListViewSections({
    gigwanNanoId,
    isAuthenticated,
  });

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
    }),
    [listSectionProps, sortOptions],
  );

  const pageKey = gigwanNanoId || 'no-gi';
  const settingsPanels = useMemo(
    () => createJojikSettingsPanels(settingsSectionProps),
    [settingsSectionProps],
  );

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedJojiks}
      NoneSelectedComponent={settingsPanels.noneSelected}
      OneSelectedComponent={settingsPanels.oneSelected}
      MultipleSelectedComponent={settingsPanels.multipleSelected}
    >
      <JojiksListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
