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

export default function GiManageSettingSvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>기관 · 설정</p>
          <h1 className={sectionTitle}>기관 설정</h1>
        </div>
        <p className={sectionDescription}>
          기관 기본 정보, 커리큘럼, 운영 시간 등 핵심 설정을 관리하는 화면입니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>기본 정보</h2>
            <p className={descriptionDetail}>
              기관명, 로고, 연락처, 지도 노출 등 외부에 노출되는 공통 정보를 관리합니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>운영 정책</h2>
            <p className={descriptionDetail}>
              상담 가능 시간, 수납 정책, 청구서 서식 등 기관 공통 운영 규칙을 설정합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
