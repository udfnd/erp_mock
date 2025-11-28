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

  const { listSectionProps, settingsSectionProps, sortOptions } = useJusoListViewSections({
    jojikNanoId,
    isAuthenticated,
  });

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
    }),
    [listSectionProps, sortOptions],
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

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedJusos}
      isCreating={isCreating}
      isParentMissing={!settingsJojikNanoId}
      rightPanelProps={{
        jojikNanoId: settingsJojikNanoId,
        onStartCreate,
        onExitCreate,
        onAfterMutation,
        isAuthenticated: settingsIsAuthenticated,
      }}
      CreatingComponent={CreatingPanels}
      NoneSelectedComponent={NoneSelectedPanels}
      SingleSelectedComponent={OneSelectedPanels}
      MultipleSelectedComponent={MultipleSelectedPanels}
      // MissingParentComponent={MissingJojikPanels} TODO: refactor
      getSingleSelectedProps={(selectedItem, props) => ({
        jusoNanoId: selectedItem.nanoId,
        jusoName: selectedItem.jusoName,
        onAfterMutation: props.onAfterMutation,
        isAuthenticated: props.isAuthenticated,
      })}
      getMultipleSelectedProps={(jusos) => ({ jusos })}
    >
      <JusoListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
