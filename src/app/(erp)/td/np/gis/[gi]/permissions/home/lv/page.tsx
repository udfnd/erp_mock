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

export default function GiPermissionsHomeLvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>기관 · 권한</p>
          <h1 className={sectionTitle}>권한 관리</h1>
        </div>
        <p className={sectionDescription}>
          기관 단위에서 사용자별 접근 권한을 검토하고 조정하는 화면입니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>권한 현황</h2>
            <p className={descriptionDetail}>
              사용자별 권한 맵을 시각화하여, 과도한 권한이 부여된 계정을 빠르게 식별할 수 있도록
              합니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>변경 로그</h2>
            <p className={descriptionDetail}>
              최근 권한 변경 이력을 시간순으로 기록하여, 감사 대응이 가능하도록 준비합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
