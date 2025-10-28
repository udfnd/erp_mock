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

export default function JoJawonsMemosLvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>조직 · 자원</p>
          <h1 className={sectionTitle}>메모 리포지토리</h1>
        </div>
        <p className={sectionDescription}>
          조직 내부 공지, 회의록, 교육 노하우 등을 메모 형태로 축적하고 공유합니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>분류 체계</h2>
            <p className={descriptionDetail}>
              태그와 폴더를 활용해 메모를 정리하고, 검색과 권한 관리를 지원합니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>협업 기능</h2>
            <p className={descriptionDetail}>
              메모별 댓글과 확인 요청 기능을 제공해 구성원 간 협업 효율을 높입니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
