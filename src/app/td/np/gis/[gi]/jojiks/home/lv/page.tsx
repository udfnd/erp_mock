'use client';

import { useParams } from 'next/navigation';

import { useAuth } from '@/global/auth';
import {
  JojikListSection,
  JojikSettingsSection,
  useJojikListViewSections,
  jojikListViewCss,
} from '@/domain/jojik/section';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanJojikListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? params?.gi[0] ?? '' : params?.gi ?? '';
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, createdAtFilterOptions, sortOptions, pageSizeOptions } =
    useJojikListViewSections({ gigwanNanoId, isAuthenticated });

  return (
    <div css={jojikListViewCss.page} key={gigwanNanoId || 'no-gi'}>
      <JojikListSection
        {...listSectionProps}
        createdAtFilterOptions={createdAtFilterOptions}
        sortOptions={sortOptions}
        pageSizeOptions={pageSizeOptions}
      />
      <JojikSettingsSection {...settingsSectionProps} />
    </div>
  );
}
