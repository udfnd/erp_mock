import PlaceholderPage, { PlaceholderCard, PlaceholderSection } from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    jo: string;
  };
};

export default function JoManageSettingPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`조직 ${params.jo} 설정`}
      description="조직별 세부 정책과 역할을 관리하는 화면입니다."
      meta={<span className={placeholderStyles.metaChip}>조직 코드: {params.jo}</span>}
    >
      <PlaceholderSection
        title="설정 항목"
        description="각 항목은 개별 페이지 또는 모달로 연결됩니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="기본 정보" />
          <PlaceholderCard label="업무 프로세스" />
          <PlaceholderCard label="권한 연동" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
