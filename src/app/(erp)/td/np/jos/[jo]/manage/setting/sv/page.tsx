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

export default function JoManageSettingSvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>조직 · 설정</p>
          <h1 className={sectionTitle}>조직 운영 설정</h1>
        </div>
        <p className={sectionDescription}>
          강의실 배정, 커리큘럼, 담당 강사 등 조직별 운영 정보를 관리합니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>시간표 템플릿</h2>
            <p className={descriptionDetail}>
              학기/분기별 시간표 템플릿을 구성하고, 휴강·보강 일정을 관리합니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>담당 강사</h2>
            <p className={descriptionDetail}>
              강사 배정 및 담당 교과 변경 이력을 추적하여 안정적인 수업 운영을 지원합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
