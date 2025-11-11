'use client';

import { useParams } from 'next/navigation';

import { cssObj } from './style';
import {
  BasicInformationSection,
  EmploymentCategoriesSection,
  WorkTypeStatusesSection,
} from '@/domain/gigwan/section';
import { TertiaryNav } from '@/global/navigation';
import { getTertiaryNavItems } from '@/global/navigation/nav.data';

const GIGWAN_MANAGE_TERTIARY_ITEMS = getTertiaryNavItems('/td/np/gis', '/td/np/gis/[gi]/manage');

export default function GigwanSettingServicePage() {
  const { gi } = useParams<{ gi: string }>();
  const gigwanNanoId = Array.isArray(gi) ? gi[0] : gi;

  if (!gigwanNanoId) return null;

  return (
    <>
      <TertiaryNav navItems={GIGWAN_MANAGE_TERTIARY_ITEMS} />
      <div css={cssObj.page}>
        <BasicInformationSection gigwanNanoId={gigwanNanoId} />
        <EmploymentCategoriesSection gigwanNanoId={gigwanNanoId} />
        <WorkTypeStatusesSection gigwanNanoId={gigwanNanoId} />
      </div>
    </>
  );
}
