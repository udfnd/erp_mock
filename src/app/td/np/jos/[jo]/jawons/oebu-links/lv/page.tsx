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
  const jojikNanoId = Array.isArray(params?.jo) ? (params?.jo[0] ?? '') : (params?.jo ?? '');
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions, iconFilterOptions } =
    useOebuLinkListViewSections({ jojikNanoId, isAuthenticated });

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
      iconFilterOptions,
    }),
    [iconFilterOptions, listSectionProps, sortOptions],
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

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedLinks}
      isCreating={isCreating}
      isParentMissing={!settingsJojikNanoId}
      isAuthenticated={settingsIsAuthenticated}
      rightPanelProps={{
        jojikNanoId: settingsJojikNanoId,
        onStartCreate,
        onExitCreate,
        onAfterMutation,
        iconOptions,
      }}
      CreatingComponent={CreatingPanels}
      NoneSelectedComponent={NoneSelectedPanels}
      SingleSelectedComponent={OneSelectedPanels}
      MultipleSelectedComponent={MultipleSelectedPanels}
      MissingParentComponent={MissingJojikPanels}
      AuthenticationRequiredComponent={AuthenticationRequiredPanels}
      getSingleSelectedProps={(selectedItem, props) => ({
        oebuLinkNanoId: selectedItem.nanoId,
        oebuLinkName: selectedItem.name,
        iconOptions: props.iconOptions,
        onAfterMutation: props.onAfterMutation,
      })}
      getMultipleSelectedProps={(oebuLinks) => ({ oebuLinks })}
    >
      <OebuLinkListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
