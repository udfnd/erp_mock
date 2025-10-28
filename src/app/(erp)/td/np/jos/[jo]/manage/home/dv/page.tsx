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

export default function JoManageHomeDvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>조직 · 데이터 뷰</p>
          <h1 className={sectionTitle}>조직 홈 대시보드</h1>
        </div>
        <p className={sectionDescription}>
          조직 단위 수업, 강사, 학생 현황을 집중 확인할 수 있는 홈 화면입니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>운영 지표</h2>
            <p className={descriptionDetail}>
              출결, 과제 제출률, 강사 스케줄 등 조직 특화 지표를 카드 형태로 제공합니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>빠른 액션</h2>
            <p className={descriptionDetail}>
              공지 발송, 일정 등록 등 조직 관리자가 자주 사용하는 작업을 바로 수행할 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
