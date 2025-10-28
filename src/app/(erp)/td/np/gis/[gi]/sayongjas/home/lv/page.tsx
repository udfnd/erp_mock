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

export default function GiSayongjasHomeLvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>기관 · 사용자</p>
          <h1 className={sectionTitle}>기관 사용자 관리</h1>
        </div>
        <p className={sectionDescription}>
          기관에 소속된 교직원, 강사, 관리자 계정을 조회하고 권한을 부여합니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>사용자 검색</h2>
            <p className={descriptionDetail}>
              역할, 조직, 담당 과목 등 다양한 필터로 사용자를 검색할 수 있도록 구성합니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>초대 및 권한</h2>
            <p className={descriptionDetail}>
              신규 사용자를 초대하고, 역할 기반 권한 템플릿을 배정할 수 있는 플로우를 제공합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
