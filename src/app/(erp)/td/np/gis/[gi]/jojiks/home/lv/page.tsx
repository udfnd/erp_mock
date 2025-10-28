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

export default function GiJojiksHomeLvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>기관 · 조직</p>
          <h1 className={sectionTitle}>소속 조직 목록</h1>
        </div>
        <p className={sectionDescription}>
          기관에 속한 학년, 반, 부서 등 조직 단위를 탐색하고 구조를 관리합니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>조직 트리</h2>
            <p className={descriptionDetail}>
              상하위 조직을 트리로 표현하여 인원 수, 담당자, 개설 강좌를 빠르게 확인할 수 있게
              합니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>조직 생성</h2>
            <p className={descriptionDetail}>
              신규 조직을 생성하거나 위치를 이동할 수 있으며, 변경 이력을 기록합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
