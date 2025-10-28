import PlaceholderPage, { PlaceholderCard, PlaceholderSection } from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    gi: string;
  };
};

export default function GiManageHomePage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`기관 ${params.gi} 관리 홈`}
      description="기관 전반의 운영 현황과 주요 액션을 한 눈에 확인하는 대시보드입니다."
      meta={<span className={placeholderStyles.metaChip}>기관 코드: {params.gi}</span>}
    >
      <PlaceholderSection
        title="위젯 구성"
        description="실제 운영에서는 맞춤 위젯이 배치됩니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="출결 요약" />
          <PlaceholderCard label="신규 알림" />
          <PlaceholderCard label="진행 중 과제" />
          <PlaceholderCard label="시설 점검 일정" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
