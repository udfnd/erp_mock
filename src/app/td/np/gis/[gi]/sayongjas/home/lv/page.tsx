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

  const noneSelectedPanel =
    !settingsGigwanNanoId ? (
      <MissingGigwanPanels />
    ) : isCreating ? (
      <CreatingPanels
        gigwanNanoId={settingsGigwanNanoId}
        employmentCategoryOptions={employmentCategoryOptions}
        workTypeOptions={workTypeOptions}
        onExit={onExitCreate}
        onAfterMutation={onAfterMutation}
      />
    ) : (
      <NoneSelectedPanels onStartCreate={onStartCreate} />
    );

  const oneSelectedPanel = (() => {
    if (!settingsGigwanNanoId) return <MissingGigwanPanels />;
    if (isCreating)
      return (
        <CreatingPanels
          gigwanNanoId={settingsGigwanNanoId}
          employmentCategoryOptions={employmentCategoryOptions}
          workTypeOptions={workTypeOptions}
          onExit={onExitCreate}
          onAfterMutation={onAfterMutation}
        />
      );

    const [primarySelected] = selectedSayongjas;

    return primarySelected ? (
      <OneSelectedPanels
        sayongjaNanoId={primarySelected.nanoId}
        sayongjaName={primarySelected.name}
        gigwanNanoId={settingsGigwanNanoId}
        onAfterMutation={onAfterMutation}
        isAuthenticated={settingsIsAuthenticated}
        employmentCategoryOptions={employmentCategoryOptions}
        workTypeOptions={workTypeOptions}
      />
    ) : (
      noneSelectedPanel
    );
  })();

  const multipleSelectedPanel = !settingsGigwanNanoId ? (
    <MissingGigwanPanels />
  ) : isCreating ? (
    <CreatingPanels
      gigwanNanoId={settingsGigwanNanoId}
      employmentCategoryOptions={employmentCategoryOptions}
      workTypeOptions={workTypeOptions}
      onExit={onExitCreate}
      onAfterMutation={onAfterMutation}
    />
  ) : (
    <MultipleSelectedPanels sayongjas={selectedSayongjas} />
  );

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedSayongjas}
      NoneSelectedComponent={noneSelectedPanel}
      OneSelectedComponent={oneSelectedPanel}
      MultipleSelectedComponent={multipleSelectedPanel}
    >
      <SayongjaListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
