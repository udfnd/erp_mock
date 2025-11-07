'use client';

import { useParams } from 'next/navigation';

import { cssObj } from './style';
import {
  BasicInformationSection,
  EmploymentCategoriesSection,
  WorkTypeStatusesSection,
} from './section';

export default function GigwanSettingServicePage() {
  const { gi } = useParams<{ gi: string }>();
  const gigwanNanoId = Array.isArray(gi) ? gi[0] : gi;

  if (!gigwanNanoId) return null;

  return (
    <div css={cssObj.page}>
      <BasicInformationSection gigwanNanoId={gigwanNanoId} />
      <EmploymentCategoriesSection gigwanNanoId={gigwanNanoId} />
      <WorkTypeStatusesSection gigwanNanoId={gigwanNanoId} />
    </div>
  );
}
