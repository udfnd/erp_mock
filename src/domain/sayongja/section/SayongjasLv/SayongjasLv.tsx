'use client';

import { useMemo } from 'react';

import { useAuth } from '@/global/auth';
import {
  SayongjaListSection,
  SayongjaSettingsSection,
  useSayongjaListViewSections,
} from '@/domain/sayongja/section/ListView';

import { cssObj } from './styles';

type SayongjasLvProps = {
  gigwanNanoId: string;
};

export function SayongjasLv({ gigwanNanoId }: SayongjasLvProps) {
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

  const listSectionAllProps = useMemo(
    () => ({
      ...listSectionProps,
      sortOptions,
      pageSizeOptions,
      jojikFilterOptions,
      employmentCategoryOptions,
      workTypeOptions,
      isHwalseongFilterOptions,
    }),
    [
      employmentCategoryOptions,
      isHwalseongFilterOptions,
      jojikFilterOptions,
      listSectionProps,
      pageSizeOptions,
      sortOptions,
      workTypeOptions,
    ],
  );

  const settingsSectionAllProps = useMemo(
    () => ({
      ...settingsSectionProps,
      employmentCategoryOptions,
      workTypeOptions,
    }),
    [employmentCategoryOptions, settingsSectionProps, workTypeOptions],
  );

  const pageKey = gigwanNanoId || 'no-gi';

  return (
    <div css={cssObj.page} key={pageKey}>
      <SayongjaListSection {...listSectionAllProps} />
      <SayongjaSettingsSection {...settingsSectionAllProps} />
    </div>
  );
}
