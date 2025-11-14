'use client';

import { useParams } from 'next/navigation';

import { useAuth } from '@/global/auth';
import {
  JojikListSection,
  JojikSettingsSection,
  useJojikListViewSections,
} from '@/domain/jojik/section';
import { cssObj } from './style';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanJojikListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');
  const { isAuthenticated } = useAuth();

  const {
    listSectionProps,
    settingsSectionProps,
    createdAtFilterOptions,
    sortOptions,
    pageSizeOptions,
  } = useJojikListViewSections({ gigwanNanoId, isAuthenticated });

  const listSectionAllProps = {
    ...listSectionProps,
    createdAtFilterOptions,
    sortOptions,
    pageSizeOptions,
  };

  const pageKey = gigwanNanoId || 'no-gi';

  return (
    <div css={cssObj.page} key={pageKey}>
      <JojikListSection {...listSectionAllProps} />
      <JojikSettingsSection {...settingsSectionProps} />
    </div>
  );
}
