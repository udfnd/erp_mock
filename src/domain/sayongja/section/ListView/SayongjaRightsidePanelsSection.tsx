'use client';

import type { ReactNode } from 'react';

import {
  CreatingPanels,
  MissingGigwanPanels,
  MultipleSelectedPanels,
  NoneSelectedPanels,
  OneSelectedPanels,
  type SayongjaRightsidePanelState,
} from '@/domain/sayongja/section/ListView/SayongjaRightsidePanels/statePanels';
import type { SayongjaRightsidePanelsSectionProps } from './useSayongjaListViewSections';

export type SayongjaRightsidePanelsSectionComponentProps = SayongjaRightsidePanelsSectionProps & {
  employmentCategoryOptions: { label: string; value: string }[];
  workTypeOptions: { label: string; value: string }[];
};

export type SayongjaRightsidePanels = {
  noneSelected: ReactNode;
  oneSelected: ReactNode;
  multipleSelected: ReactNode;
};

export function createSayongjaRightsidePanels({
  employmentCategoryOptions,
  workTypeOptions,
  ...RightsidePanelsSectionProps
}: SayongjaRightsidePanelsSectionComponentProps): SayongjaRightsidePanels {
  const sharedProps = {
    employmentCategoryOptions,
    workTypeOptions,
    ...RightsidePanelsSectionProps,
  };
  const {
    gigwanNanoId,
    isCreating,
    onExitCreate,
    onAfterMutation,
    onStartCreate,
    selectedSayongjas,
  } = sharedProps;

  if (!gigwanNanoId) {
    const panel = <MissingGigwanPanels />;

    return { noneSelected: panel, oneSelected: panel, multipleSelected: panel };
  }

  if (isCreating) {
    const creatingPanel = (
      <CreatingPanels
        gigwanNanoId={gigwanNanoId}
        onExit={isCreating ? onExitCreate : undefined}
        onAfterMutation={onAfterMutation}
        employmentCategoryOptions={employmentCategoryOptions}
        workTypeOptions={workTypeOptions}
      />
    );

    return {
      noneSelected: creatingPanel,
      oneSelected: creatingPanel,
      multipleSelected: creatingPanel,
    };
  }

  const noneSelectedPanel = <NoneSelectedPanels onStartCreate={onStartCreate} />;

  const [primarySelected] = selectedSayongjas;

  const singleSelectedPanel = primarySelected ? (
    <OneSelectedPanels
      sayongjaNanoId={primarySelected.nanoId}
      sayongjaName={primarySelected.name}
      gigwanNanoId={gigwanNanoId}
      onAfterMutation={onAfterMutation}
      isAuthenticated={sharedProps.isAuthenticated}
      employmentCategoryOptions={employmentCategoryOptions}
      workTypeOptions={workTypeOptions}
    />
  ) : (
    noneSelectedPanel
  );

  const multipleSelectedPanel = (
    <MultipleSelectedPanels sayongjas={selectedSayongjas} />
  );

  return {
    noneSelected: noneSelectedPanel,
    oneSelected: singleSelectedPanel,
    multipleSelected: multipleSelectedPanel,
  } as SayongjaRightsidePanelState;
}

export function SayongjaRightsidePanelsSection({
  gigwanNanoId,
  selectedSayongjas,
  isCreating,
  onStartCreate,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
  employmentCategoryOptions,
  workTypeOptions,
}: SayongjaRightsidePanelsSectionComponentProps) {
  const panels = createSayongjaRightsidePanels({
    gigwanNanoId,
    selectedSayongjas,
    isCreating,
    onStartCreate,
    onExitCreate,
    onAfterMutation,
    isAuthenticated,
    employmentCategoryOptions,
    workTypeOptions,
  });

  if (selectedSayongjas.length === 0) {
    return panels.noneSelected;
  }

  if (selectedSayongjas.length === 1) {
    return panels.oneSelected;
  }

  return panels.multipleSelected;
}
