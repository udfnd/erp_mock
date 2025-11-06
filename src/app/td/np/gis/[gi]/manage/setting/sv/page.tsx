'use client';

import { useParams } from 'next/navigation';

import * as styles from './style';
import { BasicInformationSection } from './sections/BasicInformationSection';
import { EmploymentCategoriesSection } from './sections/EmploymentCategoriesSection';
import { WorkTypeStatusesSection } from './sections/WorkTypeStatusesSection';

export default function GigwanSettingServicePage() {
  const { gi } = useParams<{ gi: string }>();
  const gigwanNanoId = Array.isArray(gi) ? gi[0] : gi;

  if (!gigwanNanoId) return null;

  return (
    <div css={styles.page}>
      <BasicInformationSection gigwanNanoId={gigwanNanoId} />
      <EmploymentCategoriesSection gigwanNanoId={gigwanNanoId} />
      <WorkTypeStatusesSection gigwanNanoId={gigwanNanoId} />
    </div>
  );
}
