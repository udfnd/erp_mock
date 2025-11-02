import PlaceholderPage from '@/app/(erp)/_components/PlaceholderPage';
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
    ></PlaceholderPage>
  );
}
