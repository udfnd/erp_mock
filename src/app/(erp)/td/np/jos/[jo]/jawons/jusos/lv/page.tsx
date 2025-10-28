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

export default function JoJawonsJusosLvPage() {
  return (
    <div className={pageContainer}>
      <section className={sectionCard}>
        <div>
          <p className={eyebrow}>조직 · 자원</p>
          <h1 className={sectionTitle}>주소록</h1>
        </div>
        <p className={sectionDescription}>
          학부모, 외부 강사, 협력업체 등 조직과 연계된 연락처를 통합 관리합니다.
        </p>
        <div className={descriptionList}>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>연락처 정보</h2>
            <p className={descriptionDetail}>
              기본 연락처 외에도 담당자 메모, 후속 일정 등 추가 정보를 저장할 수 있습니다.
            </p>
          </div>
          <div className={descriptionItem}>
            <h2 className={descriptionTerm}>활용 시나리오</h2>
            <p className={descriptionDetail}>
              문자 발송, 상담 기록 연결 등 다른 모듈과 연계되는 액션을 제공합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
