import PlaceholderPage, { PlaceholderCard, PlaceholderSection } from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    gi: string;
  };
};

export default function GiOrganizationsPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`기관 ${params.gi} 조직 관리`}
      description="기관에 속한 조직들의 구조와 핵심 정보를 관리하는 화면입니다."
      meta={<span className={placeholderStyles.metaChip}>기관 코드: {params.gi}</span>}
    >
      <PlaceholderSection
        title="조직 분류"
        description="실제 서비스에서는 조직 트리와 권한 요약이 표시됩니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="본원" />
          <PlaceholderCard label="분원" />
          <PlaceholderCard label="연구소" />
          <PlaceholderCard label="부속기관" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
