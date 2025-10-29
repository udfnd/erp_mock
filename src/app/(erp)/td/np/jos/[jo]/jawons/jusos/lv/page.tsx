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

export default function JoResourceAddressesPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`조직 ${params.jo} 주소 자원`}
      description="조직이 관리하는 시설과 캠퍼스 주소 정보를 한 곳에서 관리합니다."
      meta={<span className={placeholderStyles.metaChip}>조직 코드: {params.jo}</span>}
    >
      <PlaceholderSection
        title="시설 분류"
        description="지도 연동과 상세 주소 관리 기능이 제공될 예정입니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="본관" />
          <PlaceholderCard label="별관" />
          <PlaceholderCard label="체육관" />
          <PlaceholderCard label="기숙사" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
