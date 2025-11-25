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

  return (
    <ListViewLayout
      key={pageKey}
      selectedItems={settingsSectionProps.selectedJojiks}
      isCreating={isCreating}
      isParentMissing={!settingsGigwanNanoId}
      rightPanelProps={{
        gigwanNanoId: settingsGigwanNanoId,
        onStartCreate,
        onExitCreate,
        onAfterMutation,
        isAuthenticated: settingsSectionProps.isAuthenticated,
      }}
      CreatingComponent={JojikCreatingPanels}
      NoneSelectedComponent={JojikNoneSelectedPanels}
      SingleSelectedComponent={JojikSingleSelectedPanels}
      MultipleSelectedComponent={JojikMultipleSelectedPanels}
      MissingParentComponent={JojikMissingGigwanPanels}
      getSingleSelectedProps={({ nanoId, name }) => ({
        jojikNanoId: nanoId,
        jojikName: name,
      })}
      getMultipleSelectedProps={(jojiks) => ({ jojiks })}
    >
      <JojiksListSection {...listSectionAllProps} />
    </ListViewLayout>
  );
}
