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

export default function JoJawonsOebuLinksLvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>조직 · 자원</p>
          <h1 className={sectionTitle}>외부 링크 보관함</h1>
        </div>
        <p className={sectionDescription}>
          수업 자료, 참고 영상, 업무 툴 등 외부 리소스를 한곳에서 관리합니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>링크 분류</h2>
            <p className={descriptionDetail}>
              카테고리와 즐겨찾기를 제공해 자주 사용하는 링크에 빠르게 접근할 수 있게 합니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>접근 제어</h2>
            <p className={descriptionDetail}>
              조직 내 역할에 따라 노출 범위를 설정하고, 사용 기록을 확인합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
