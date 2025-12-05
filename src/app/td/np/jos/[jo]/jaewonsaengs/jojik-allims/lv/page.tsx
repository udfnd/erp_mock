'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { extractJojikNanoId } from '@/common/utils';
import { useAuth } from '@/global/auth';
import {
  JojikAllimListSection,
  MissingJojikPanels,
  CreatingPanels,
  MultipleSelectedPanels,
  NoneSelectedPanels,
  OneSelectedPanels,
  useJojikAllimListViewSections,
} from '@/domain/jaewonsaeng/jojik-allim/section/ListView';

type PageParams = {
  jo?: string | string[];
};

export default function NpJojikJojikAllimListViewPage() {
  const params = useParams<PageParams>();
  const jojikNanoId = extractJojikNanoId(params?.jo);
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions } = useJojikAllimListViewSections({
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

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedJojikAllims}
      isCreating={settingsSectionProps.isCreating}
      isParentMissing={!settingsSectionProps.jojikNanoId}
      rightPanelProps={settingsSectionProps}
      CreatingComponent={CreatingPanels}
      NoneSelectedComponent={NoneSelectedPanels}
      SingleSelectedComponent={OneSelectedPanels}
      MultipleSelectedComponent={MultipleSelectedPanels}
      MissingParentComponent={MissingJojikPanels}
      getSingleSelectedProps={(selectedItem, props) => ({
        allimNanoId: selectedItem.nanoId,
        allimTitle: selectedItem.title,
        jojikNanoId: props.jojikNanoId,
        onAfterMutation: props.onAfterMutation,
        isAuthenticated: props.isAuthenticated,
      })}
      getMultipleSelectedProps={(allims) => ({ allims })}
    >
      <JojikAllimListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
