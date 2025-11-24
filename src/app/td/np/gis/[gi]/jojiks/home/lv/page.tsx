'use client';

import { useParams } from 'next/navigation';

import { ListViewLayout } from '@/common/lv/layout';
import { extractGigwanNanoId } from '@/common/utils';
import {
  JojiksListSection,
  JojikCreatingPanels,
  JojikMissingGigwanPanels,
  JojikMultipleSelectedPanels,
  JojikNoneSelectedPanels,
  JojikSingleSelectedPanels,
  useJojikListViewSections,
} from '@/domain/jojik/section/ListView';
import { useAuth } from '@/global/auth';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanJojikListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = extractGigwanNanoId(params?.gi);
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions } = useJojikListViewSections({
    gigwanNanoId,
    isAuthenticated,
  });

  const pageKey = gigwanNanoId || 'no-gi';
  const {
    gigwanNanoId: settingsGigwanNanoId,
    selectedJojiks,
    isCreating,
    onStartCreate,
    onExitCreate,
    onAfterMutation,
  } = settingsSectionProps;

  const listSectionAllProps = {
    ...listSectionProps,
    sortOptions,
  };

  const noneSelectedPanel =
    !settingsGigwanNanoId ? (
      <JojikMissingGigwanPanels />
    ) : isCreating ? (
      <JojikCreatingPanels
        gigwanNanoId={settingsGigwanNanoId}
        onExitCreate={onExitCreate}
        onAfterMutation={onAfterMutation}
      />
    ) : (
      <JojikNoneSelectedPanels onStartCreate={onStartCreate} />
    );

  const oneSelectedPanel = (() => {
    if (!settingsGigwanNanoId) return <JojikMissingGigwanPanels />;
    if (isCreating)
      return (
        <JojikCreatingPanels
          gigwanNanoId={settingsGigwanNanoId}
          onExitCreate={onExitCreate}
          onAfterMutation={onAfterMutation}
        />
      );

    const [primarySelectedJojik] = selectedJojiks;

    return primarySelectedJojik ? (
      <JojikSingleSelectedPanels
        jojikNanoId={primarySelectedJojik.nanoId}
        jojikName={primarySelectedJojik.name}
        onAfterMutation={onAfterMutation}
        isAuthenticated={settingsSectionProps.isAuthenticated}
      />
    ) : (
      noneSelectedPanel
    );
  })();

  const multipleSelectedPanel = !settingsGigwanNanoId ? (
    <JojikMissingGigwanPanels />
  ) : isCreating ? (
    <JojikCreatingPanels
      gigwanNanoId={settingsGigwanNanoId}
      onExitCreate={onExitCreate}
      onAfterMutation={onAfterMutation}
    />
  ) : (
    <JojikMultipleSelectedPanels jojiks={selectedJojiks} />
  );

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedJojiks}
      NoneSelectedComponent={noneSelectedPanel}
      OneSelectedComponent={oneSelectedPanel}
      MultipleSelectedComponent={multipleSelectedPanel}
    >
      <JojiksListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
