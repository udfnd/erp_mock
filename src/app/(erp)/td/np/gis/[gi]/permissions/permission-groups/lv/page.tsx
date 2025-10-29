import PlaceholderPage, {
  PlaceholderCard,
  PlaceholderSection,
} from '@/app/(erp)/_components/PlaceholderPage';
import * as placeholderStyles from '@/app/(erp)/_components/placeholderPage.css';

type PageProps = {
  params: {
    gi: string;
  };
};

export default function GiPermissionGroupsPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`기관 ${params.gi} 권한 그룹`}
      description="권한 그룹별 구성과 세부 권한을 정리하는 화면입니다."
      meta={<span className={placeholderStyles.metaChip}>기관 코드: {params.gi}</span>}
    >
      <PlaceholderSection
        title="권한 그룹"
        description="그룹별 담당 업무와 소속 인원이 카드로 정리됩니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="슈퍼 관리자" />
          <PlaceholderCard label="교육 관리자" />
          <PlaceholderCard label="상담 매니저" />
          <PlaceholderCard label="파트타이머" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
