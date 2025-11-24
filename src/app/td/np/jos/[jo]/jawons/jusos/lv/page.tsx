'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { useAuth } from '@/global/auth';
import {
  CreatingPanels,
  JusoListSection,
  MissingJojikPanels,
  MultipleSelectedPanels,
  NoneSelectedPanels,
  OneSelectedPanels,
  useJusoListViewSections,
} from '@/domain/juso/section';

type PageParams = {
  jo?: string | string[];
};

const extractJojikNanoId = (value: PageParams['jo']): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};

export default function NpJojikJawonJusoListViewPage() {
  const params = useParams<PageParams>();
  const jojikNanoId = extractJojikNanoId(params?.jo);
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions, pageSizeOptions } = useJusoListViewSections({
    jojikNanoId,
    isAuthenticated,
  });

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
      pageSizeOptions,
    }),
    [listSectionProps, pageSizeOptions, sortOptions],
  );

  const pageKey = jojikNanoId || 'no-jo';

  const {
    jojikNanoId: settingsJojikNanoId,
    selectedJusos,
    isCreating,
    onStartCreate,
    onExitCreate,
    onAfterMutation,
    isAuthenticated: settingsIsAuthenticated,
  } = settingsSectionProps;

  const noneSelectedPanel = !settingsJojikNanoId ? (
    <MissingJojikPanels />
  ) : isCreating ? (
    <CreatingPanels jojikNanoId={settingsJojikNanoId} onExit={onExitCreate} onAfterMutation={onAfterMutation} />
  ) : (
    <NoneSelectedPanels onStartCreate={onStartCreate} />
  );

  const oneSelectedPanel = (() => {
    if (!settingsJojikNanoId) return <MissingJojikPanels />;
    if (isCreating)
      return (
        <CreatingPanels jojikNanoId={settingsJojikNanoId} onExit={onExitCreate} onAfterMutation={onAfterMutation} />
      );

    const [primarySelected] = selectedJusos;

    return primarySelected ? (
      <OneSelectedPanels
        jusoNanoId={primarySelected.nanoId}
        jusoName={primarySelected.jusoName}
        onAfterMutation={onAfterMutation}
        isAuthenticated={settingsIsAuthenticated}
      />
    ) : (
      noneSelectedPanel
    );
  })();

  const multipleSelectedPanel = !settingsJojikNanoId ? (
    <MissingJojikPanels />
  ) : isCreating ? (
    <CreatingPanels jojikNanoId={settingsJojikNanoId} onExit={onExitCreate} onAfterMutation={onAfterMutation} />
  ) : (
    <MultipleSelectedPanels jusos={selectedJusos} />
  );

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedJusos}
      NoneSelectedComponent={noneSelectedPanel}
      OneSelectedComponent={oneSelectedPanel}
      MultipleSelectedComponent={multipleSelectedPanel}
    >
      <JusoListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
