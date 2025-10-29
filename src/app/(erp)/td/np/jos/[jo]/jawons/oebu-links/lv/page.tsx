import PlaceholderPage, {
  PlaceholderCard,
  PlaceholderSection,
} from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    jo: string;
  };
};

export default function JoResourceExternalLinksPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`조직 ${params.jo} 외부 링크`}
      description="업무에 필요한 외부 시스템과 자료를 연결하는 화면입니다."
      meta={<span className={placeholderStyles.metaChip}>조직 코드: {params.jo}</span>}
    >
      <PlaceholderSection
        title="링크 카테고리"
        description="서비스에서는 즐겨찾기와 태그를 활용한 검색이 제공됩니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="교육부 시스템" />
          <PlaceholderCard label="재무 회계" />
          <PlaceholderCard label="인사 관리" />
          <PlaceholderCard label="협력 포털" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
