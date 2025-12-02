'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { useAuth } from '@/global/auth';
import {
  JaewonsaengListSection,
  CreatingPanels,
  MissingJojikPanels,
  MultipleSelectedPanels,
  NoneSelectedPanels,
  OneSelectedPanels,
  useJaewonsaengListViewSections,
} from '@/domain/jaewonsaeng/section/ListView';

type PageParams = { jo?: string | string[] };

const extractJojikNanoId = (value: PageParams['jo']): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};

export default function NpJojikJaewonsaengListViewPage() {
  const params = useParams<PageParams>();
  const jojikNanoId = extractJojikNanoId(params?.jo);
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions } = useJaewonsaengListViewSections({
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

  const { selectedJaewonsaengs, isCreating, onStartCreate, onExitCreate, onAfterMutation } =
    settingsSectionProps;

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedJaewonsaengs}
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
        jaewonsaengNanoId: selectedItem.nanoId,
        jaewonsaengName: selectedItem.name,
        jojikNanoId: props.jojikNanoId,
        onAfterMutation: props.onAfterMutation,
        isAuthenticated: props.isAuthenticated,
        isHadaLinked: selectedItem.isHadaLinked,
      })}
      getMultipleSelectedProps={(jaewonsaengs) => ({ jaewonsaengs })}
    >
      <JaewonsaengListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
