import PlaceholderPage, { PlaceholderCard, PlaceholderSection } from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    jo: string;
  };
};

export default function JoManageHomePage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`조직 ${params.jo} 관리 홈`}
      description="조직별 진행 상황과 일정, 담당자를 관리하는 홈 화면입니다."
      meta={<span className={placeholderStyles.metaChip}>조직 코드: {params.jo}</span>}
    >
      <PlaceholderSection
        title="핵심 지표"
        description="실제 데이터가 연결되면 조직 KPI와 알림이 노출됩니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="운영 지표" />
          <PlaceholderCard label="금주 일정" />
          <PlaceholderCard label="요청 처리 현황" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
