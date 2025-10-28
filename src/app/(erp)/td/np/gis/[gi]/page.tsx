import PlaceholderPage, { PlaceholderCard, PlaceholderSection } from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    gi: string;
  };
};

export default function GiOverviewPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`기관 ${params.gi} 대시보드`}
      description="기관 운영을 위한 핵심 정보와 빠른 진입점을 모아둔 허브 화면입니다."
      meta={<span className={placeholderStyles.metaChip}>기관 코드: {params.gi}</span>}
    >
      <PlaceholderSection
        title="빠른 바로가기"
        description="자주 확인하는 관리 메뉴를 카드 형태로 정리했습니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="기관 홈 진입" />
          <PlaceholderCard label="조직 관리 홈" />
          <PlaceholderCard label="사용자 목록" />
          <PlaceholderCard label="권한 정책" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
