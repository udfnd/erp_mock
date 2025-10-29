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

export default function JoResourceMemosPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`조직 ${params.jo} 메모 자원`}
      description="조직 내 공유 메모와 문서를 관리하는 공간입니다."
      meta={<span className={placeholderStyles.metaChip}>조직 코드: {params.jo}</span>}
    >
      <PlaceholderSection
        title="메모 폴더"
        description="실제 화면에서는 폴더 구조와 최근 수정 정보를 제공합니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="업무 메뉴얼" />
          <PlaceholderCard label="행정 양식" />
          <PlaceholderCard label="회의록" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
