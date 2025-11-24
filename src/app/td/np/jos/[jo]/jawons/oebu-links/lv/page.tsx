'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { useAuth } from '@/global/auth';
import {
  AuthenticationRequiredPanels,
  CreatingPanels,
  MissingJojikPanels,
  MultipleSelectedPanels,
  NoneSelectedPanels,
  OebuLinkListSection,
  OneSelectedPanels,
  useOebuLinkListViewSections,
} from '@/domain/oebu-link/section';

type PageParams = {
  jo?: string | string[];
};

export default function OebuLinksListViewPage() {
  const params = useParams<PageParams>();
  const jojikNanoId = Array.isArray(params?.jo) ? (params?.jo[0] ?? '') : params?.jo ?? '';
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions, pageSizeOptions, iconFilterOptions } =
    useOebuLinkListViewSections({ jojikNanoId, isAuthenticated });

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
      pageSizeOptions,
      iconFilterOptions,
    }),
    [iconFilterOptions, listSectionProps, pageSizeOptions, sortOptions],
  );

  const pageKey = jojikNanoId || 'no-jo';

  const {
    jojikNanoId: settingsJojikNanoId,
    selectedLinks,
    isCreating,
    onStartCreate,
    onExitCreate,
    onAfterMutation,
    isAuthenticated: settingsIsAuthenticated,
    iconOptions,
  } = settingsSectionProps;

  const noneSelectedPanel = !settingsJojikNanoId ? (
    <MissingJojikPanels />
  ) : !settingsIsAuthenticated ? (
    <AuthenticationRequiredPanels />
  ) : isCreating ? (
    <CreatingPanels
      jojikNanoId={settingsJojikNanoId}
      iconOptions={iconOptions}
      onExit={onExitCreate}
      onAfterMutation={onAfterMutation}
    />
  ) : (
    <NoneSelectedPanels onStartCreate={onStartCreate} />
  );

  const oneSelectedPanel = (() => {
    if (!settingsJojikNanoId) return <MissingJojikPanels />;
    if (!settingsIsAuthenticated) return <AuthenticationRequiredPanels />;
    if (isCreating)
      return (
        <CreatingPanels
          jojikNanoId={settingsJojikNanoId}
          iconOptions={iconOptions}
          onExit={onExitCreate}
          onAfterMutation={onAfterMutation}
        />
      );

    const [primarySelected] = selectedLinks;

    return primarySelected ? (
      <OneSelectedPanels
        oebuLinkNanoId={primarySelected.nanoId}
        oebuLinkName={primarySelected.name}
        iconOptions={iconOptions}
        onAfterMutation={onAfterMutation}
      />
    ) : (
      noneSelectedPanel
    );
  })();

  const multipleSelectedPanel = !settingsJojikNanoId ? (
    <MissingJojikPanels />
  ) : !settingsIsAuthenticated ? (
    <AuthenticationRequiredPanels />
  ) : isCreating ? (
    <CreatingPanels
      jojikNanoId={settingsJojikNanoId}
      iconOptions={iconOptions}
      onExit={onExitCreate}
      onAfterMutation={onAfterMutation}
    />
  ) : (
    <MultipleSelectedPanels oebuLinks={selectedLinks} />
  );

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedLinks}
      NoneSelectedComponent={noneSelectedPanel}
      OneSelectedComponent={oneSelectedPanel}
      MultipleSelectedComponent={multipleSelectedPanel}
    >
      <OebuLinkListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
