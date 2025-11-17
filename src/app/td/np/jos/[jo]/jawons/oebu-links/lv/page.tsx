'use client';

import { useParams } from 'next/navigation';

import { useAuth } from '@/global/auth';
import {
  OebuLinkListSection,
  OebuLinkSettingsSection,
  useOebuLinkListViewSections,
} from '@/domain/oebu-link/section';
import { cssObj } from './style';

type PageParams = {
  jo?: string | string[];
};

export default function OebuLinksListViewPage() {
  const params = useParams<PageParams>();
  const jojikNanoId = Array.isArray(params?.jo) ? (params?.jo[0] ?? '') : (params?.jo ?? '');
  const { isAuthenticated } = useAuth();

  const { listSectionProps, settingsSectionProps, sortOptions, pageSizeOptions, iconFilterOptions } =
    useOebuLinkListViewSections({ jojikNanoId, isAuthenticated });

  const listSectionAllProps = {
    ...listSectionProps,
    sortOptions,
    pageSizeOptions,
    iconFilterOptions,
  };

  const pageKey = jojikNanoId || 'no-jo';

  return (
    <div css={cssObj.page} key={pageKey}>
      <OebuLinkListSection {...listSectionAllProps} />
      <OebuLinkSettingsSection {...settingsSectionProps} />
    </div>
  );
}
