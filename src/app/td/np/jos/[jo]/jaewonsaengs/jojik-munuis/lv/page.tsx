'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { extractJojikNanoId } from '@/common/utils';
import { useAuth } from '@/global/auth';
import {
  JojikMunuiListSection,
  MissingJojikPanels,
  MultipleSelectedPanels,
  NoneSelectedPanels,
  OneSelectedPanels,
  useJojikMunuiListViewSections,
} from '@/domain/jaewonsaeng/jojik-munui/section/ListView';

type PageParams = {
  jo?: string | string[];
};

export default function NpJojikJojikMunuiListViewPage() {
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

  const {
    jojikNanoId: settingsJojikNanoId,
    onAfterMutation,
    isAuthenticated: settingsIsAuthenticated,
  } = settingsSectionProps;

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedJojikMunuis}
      isCreating={false}
      isParentMissing={!settingsJojikNanoId}
      rightPanelProps={{
        jojikNanoId: settingsJojikNanoId,
        onAfterMutation,
        isAuthenticated: settingsIsAuthenticated,
      }}
      NoneSelectedComponent={NoneSelectedPanels}
      SingleSelectedComponent={OneSelectedPanels}
      MultipleSelectedComponent={MultipleSelectedPanels}
      MissingParentComponent={MissingJojikPanels}
      getSingleSelectedProps={(selectedItem, props) => ({
        jojikMunuiNanoId: selectedItem.nanoId,
        jojikMunuiTitle: selectedItem.title,
        jojikNanoId: props.jojikNanoId,
        onAfterMutation: props.onAfterMutation,
        isAuthenticated: props.isAuthenticated,
      })}
      getMultipleSelectedProps={(jojikMunuis) => ({ jojikMunuis })}
    >
      <JojikMunuiListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
