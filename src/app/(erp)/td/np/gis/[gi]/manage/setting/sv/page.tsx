import PlaceholderPage, { PlaceholderCard, PlaceholderSection } from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    gi: string;
  };
};

export default function GiManageSettingPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`기관 ${params.gi} 설정`}
      description="기관 운영 정책, 기본 정보, 시스템 연동 설정을 관리합니다."
      meta={<span className={placeholderStyles.metaChip}>기관 코드: {params.gi}</span>}
    >
      <PlaceholderSection
        title="설정 카테고리"
        description="세부 설정 메뉴는 카드 단위로 노출됩니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="기본 정보" />
          <PlaceholderCard label="알림/공지" />
          <PlaceholderCard label="연동 관리" />
          <PlaceholderCard label="보안 정책" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
