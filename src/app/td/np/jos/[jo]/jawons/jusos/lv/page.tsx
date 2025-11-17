'use client';

import { useParams } from 'next/navigation';

import { useAuth } from '@/global/auth';
import { JusoListSection, JusoSettingsSection, useJusoListViewSections } from '@/domain/juso/section';
import { cssObj } from './style';

type PageParams = {
  jo?: string | string[];
};

export default function NpJojikJawonJusoListViewPage() {
  const params = useParams<PageParams>();
  const jojikNanoId = Array.isArray(params?.jo) ? params?.jo[0] ?? '' : params?.jo ?? '';
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions, pageSizeOptions } = useJusoListViewSections({
    jojikNanoId,
    isAuthenticated,
  });

  const listSectionAllProps = {
    ...listSectionProps,
    sortOptions,
    pageSizeOptions,
  };

  const pageKey = jojikNanoId || 'no-jo';

  return (
    <div css={cssObj.page} key={pageKey}>
      <JusoListSection {...listSectionAllProps} />
      <JusoSettingsSection {...settingsSectionProps} />
    </div>
  );
}
