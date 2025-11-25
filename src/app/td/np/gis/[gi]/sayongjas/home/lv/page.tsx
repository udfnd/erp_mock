'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { extractGigwanNanoId } from '@/common/utils';
import { useAuth } from '@/global/auth';
import {
  SayongjaListSection,
  CreatingPanels,
  MissingGigwanPanels,
  MultipleSelectedPanels,
  NoneSelectedPanels,
  OneSelectedPanels,
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

  const pageKey = gigwanNanoId || 'no-gi';

  const {
    gigwanNanoId: settingsGigwanNanoId,
    selectedSayongjas,
    isCreating,
    onStartCreate,
    onExitCreate,
    onAfterMutation,
    isAuthenticated: settingsIsAuthenticated,
  } = settingsSectionProps;

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedSayongjas}
      isCreating={isCreating}
      isParentMissing={!settingsGigwanNanoId}
      rightPanelProps={{
        gigwanNanoId: settingsGigwanNanoId,
        onStartCreate,
        onExitCreate,
        onAfterMutation,
        isAuthenticated: settingsIsAuthenticated,
        employmentCategoryOptions,
        workTypeOptions,
      }}
      CreatingComponent={CreatingPanels}
      NoneSelectedComponent={NoneSelectedPanels}
      SingleSelectedComponent={OneSelectedPanels}
      MultipleSelectedComponent={MultipleSelectedPanels}
      MissingParentComponent={MissingGigwanPanels}
      getSingleSelectedProps={(selectedItem) => ({
        sayongjaNanoId: selectedItem.nanoId,
        sayongjaName: selectedItem.name,
        gigwanNanoId: settingsGigwanNanoId,
        onAfterMutation,
        isAuthenticated: settingsIsAuthenticated,
        employmentCategoryOptions,
        workTypeOptions,
      })}
      getMultipleSelectedProps={(sayongjas) => ({ sayongjas })}
    >
      <SayongjaListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
