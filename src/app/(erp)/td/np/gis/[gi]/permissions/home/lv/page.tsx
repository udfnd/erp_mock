import PlaceholderPage, { PlaceholderCard, PlaceholderSection } from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    gi: string;
  };
};

export default function GiPermissionsPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`기관 ${params.gi} 권한 관리`}
      description="기관 내 역할과 권한 정책을 설계하고 적용하는 화면입니다."
      meta={<span className={placeholderStyles.metaChip}>기관 코드: {params.gi}</span>}
    >
      <PlaceholderSection
        title="권한 세트"
        description="권한 그룹과 정책이 카드 단위로 구성됩니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="관리자 권한" />
          <PlaceholderCard label="교직원 권한" />
          <PlaceholderCard label="외부 사용자 권한" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
