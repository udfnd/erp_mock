'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { useAuth } from '@/global/auth';
import {
  HadaRequestListSection,
  CreatingPanels,
  MissingJojikPanels,
  MultipleSelectedPanels,
  NoneSelectedPanels,
  OneSelectedPanels,
  useHadaRequestListViewSections,
} from '@/domain/jaewonsaeng/hada-requests/section/ListView';

type PageParams = { jo?: string | string[] };

const extractJojikNanoId = (value: PageParams['jo']): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};

export default function NpJojikHadaRequestsListViewPage() {
  const params = useParams<PageParams>();
  const jojikNanoId = extractJojikNanoId(params?.jo);
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions } = useHadaRequestListViewSections({
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

  const { selectedRequests, isCreating, onStartCreate, onExitCreate, onAfterMutation } = settingsSectionProps;

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedRequests}
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
        requestNanoId: selectedItem.nanoId,
        requestName: selectedItem.name,
        jojikNanoId: props.jojikNanoId,
        onAfterMutation: props.onAfterMutation,
        isAuthenticated: props.isAuthenticated,
      })}
      getMultipleSelectedProps={(requests) => ({ requests })}
    >
      <HadaRequestListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
