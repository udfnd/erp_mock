import {
  descriptionDetail,
  descriptionItem,
  descriptionList,
  eyebrow,
  pageContainer,
  sectionCard,
  sectionDescription,
  sectionTitle,
  descriptionTerm,
} from '@/app/(erp)/pageShell.css';

export default function GiManageHomeDvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>기관 · 데이터 뷰</p>
          <h1 className={sectionTitle}>기관 홈 대시보드</h1>
        </div>
        <p className={sectionDescription}>
          기관 운영 현황을 한눈에 파악하고 주요 KPI를 점검할 수 있는 홈 화면입니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>주요 위젯</h2>
            <p className={descriptionDetail}>
              당일 일정, 수강생 현황, 미처리 업무 등 기관 운영자가 매일 확인해야 하는 정보를
              집중 배치합니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>탐색 동선</h2>
            <p className={descriptionDetail}>
              위젯별로 상세 페이지로 연결되는 링크를 제공해, 주요 업무 페이지로 빠르게 이동할 수
              있도록 구성합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
