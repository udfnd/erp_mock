'use client';

import { useMemo } from 'react';

import { ListViewLayout } from '@/domain/sayongja/section';
import { JojikListSection, JojikSettingsSection, useJojikListViewSections } from '@/domain/jojik/section/ListView';
import { useAuth } from '@/global/auth';

import { cssObj } from './styles';

type JojiksLvProps = {
  gigwanNanoId: string;
};

export function JojiksLv({ gigwanNanoId }: JojiksLvProps) {
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions, pageSizeOptions } =
    useJojikListViewSections({ gigwanNanoId, isAuthenticated });

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
      pageSizeOptions,
    }),
    [listSectionProps, pageSizeOptions, sortOptions],
  );

  const pageKey = gigwanNanoId || 'no-gi';

  return (
    <div css={cssObj.page} key={pageKey}>
      <ListViewLayout
        selectedItems={settingsSectionProps.selectedJojiks}
        NoneSelectedComponent={<JojikSettingsSection {...settingsSectionProps} selectedJojiks={[]} />}
        OneSelectedComponent={
          <JojikSettingsSection
            {...settingsSectionProps}
            selectedJojiks={settingsSectionProps.selectedJojiks.slice(0, 1)}
          />
        }
        MultipleSelectedComponent={<JojikSettingsSection {...settingsSectionProps} />}
      >
        <JojikListSection {...listSectionAllProps} />
      </ListViewLayout>
    </div>
  );
}
