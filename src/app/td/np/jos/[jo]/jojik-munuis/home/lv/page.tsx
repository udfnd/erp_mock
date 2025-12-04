'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { useAuth } from '@/global/auth';
import {
  JojikMunuiListSection,
  CreatingPanels,
  MissingJojikPanels,
  MultipleSelectedPanels,
  NoneSelectedPanels,
  OneSelectedPanels,
  useJojikMunuiListViewSections,
} from '@/domain/jaewonsaeng/jojik-munui/section/ListView';

type PageParams = { jo?: string | string[] };

const extractJojikNanoId = (value: PageParams['jo']): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};

export default function NpJojikMunuiListViewPage() {
  const params = useParams<PageParams>();
  const jojikNanoId = extractJojikNanoId(params?.jo);
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions } = useJojikMunuiListViewSections({
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
  const { selectedMunuis, isCreating, onStartCreate, onExitCreate, onAfterMutation } = settingsSectionProps;

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedMunuis}
      isCreating={isCreating}
      isParentMissing={!jojikNanoId}
      rightPanelProps={{
        jojikNanoId,
        onStartCreate,
        onExitCreate,
        onAfterMutation,
        isAuthenticated,
      }}
      CreatingComponent={CreatingPanels}
      NoneSelectedComponent={NoneSelectedPanels}
      SingleSelectedComponent={OneSelectedPanels}
      MultipleSelectedComponent={MultipleSelectedPanels}
      MissingParentComponent={MissingJojikPanels}
      getSingleSelectedProps={(selectedItem, props) => ({
        munuiNanoId: selectedItem.nanoId,
        munuiTitle: selectedItem.title,
        jojikNanoId: props.jojikNanoId,
        onAfterMutation: props.onAfterMutation,
        isAuthenticated: props.isAuthenticated,
      })}
      getMultipleSelectedProps={(munuis) => ({ munuis })}
    >
      <JojikMunuiListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
