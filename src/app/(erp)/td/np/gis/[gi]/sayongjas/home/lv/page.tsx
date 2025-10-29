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

export default function GiUsersPage({ params }: PageProps) {
  return (
    <PlaceholderPage
      title={`기관 ${params.gi} 사용자 관리`}
      description="기관 구성원의 계정과 접근 권한을 관리하는 화면입니다."
      meta={<span className={placeholderStyles.metaChip}>기관 코드: {params.gi}</span>}
    >
      <PlaceholderSection
        title="사용자 그룹"
        description="실제 서비스에서는 역할별 사용자 목록과 상태가 출력됩니다."
      >
        <div className={placeholderStyles.cardGrid}>
          <PlaceholderCard label="강사진" />
          <PlaceholderCard label="행정팀" />
          <PlaceholderCard label="원장단" />
          <PlaceholderCard label="외부 협력" />
        </div>
      </PlaceholderSection>
    </PlaceholderPage>
  );
}
