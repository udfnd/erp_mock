import PlaceholderPage, { PlaceholderCard, PlaceholderSection } from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    jo: string;
  };
};

export default function JoOverviewPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`조직 ${params.jo} 대시보드`}
      description="조직 운영 지표와 담당자 정보를 모아둔 기본 화면입니다."
      meta={<span className={placeholderStyles.metaChip}>조직 코드: {params.jo}</span>}
    >
      <PlaceholderSection
        title="핵심 업무"
        description="주요 업무 흐름과 바로가기를 정리합니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="조직 홈" />
          <PlaceholderCard label="자원 관리" />
          <PlaceholderCard label="설정" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
