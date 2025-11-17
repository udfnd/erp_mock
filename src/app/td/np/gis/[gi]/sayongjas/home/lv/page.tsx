'use client';

import { useParams } from 'next/navigation';

import { useAuth } from '@/global/auth';
import {
  SayongjaListSection,
  SayongjaSettingsSection,
  useSayongjaListViewSections,
} from '@/domain/sayongja/section';
import { cssObj } from './style';

type PageParams = {
  gi?: string | string[];
};

export default function NpGigwanSayongjaListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');
  const { isAuthenticated } = useAuth();

  const {
    listSectionProps,
    settingsSectionProps,
    sortOptions,
    pageSizeOptions,
    isHwalseongFilterOptions,
    jojikFilterOptions,
    employmentCategoryOptions,
    workTypeOptions,
  } = useSayongjaListViewSections({ gigwanNanoId, isAuthenticated });

  const listSectionAllProps = {
    ...listSectionProps,
    sortOptions,
    pageSizeOptions,
    jojikFilterOptions,
    employmentCategoryOptions,
    workTypeOptions,
    isHwalseongFilterOptions,
  };

  const settingsSectionAllProps = {
    ...settingsSectionProps,
    employmentCategoryOptions,
    workTypeOptions,
  };

  const pageKey = gigwanNanoId || 'no-gi';

  return (
    <div css={cssObj.page} key={pageKey}>
      <SayongjaListSection {...listSectionAllProps} />
      <SayongjaSettingsSection {...settingsSectionAllProps} />
    </div>
  );
}
