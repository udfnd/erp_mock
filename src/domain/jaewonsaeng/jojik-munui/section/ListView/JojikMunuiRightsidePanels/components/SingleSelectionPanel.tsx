import { type FormEvent, useCallback, useState } from 'react';

import { Button } from '@/common/components';
import {
  useGetJojikMunuiDetailQuery,
  useUpdateJojikMunuiMutation,
} from '@/domain/jaewonsaeng/jojik-munui/api';
import type { JojikMunuiListItem } from '@/domain/jaewonsaeng/jojik-munui/api';
import { useJojikQuery } from '@/domain/jojik/api';
import { useGetJojikAllimDetailQuery } from '@/domain/jaewonsaeng/jojik-allim/api';
import {
  useGetJaewonsaengOverallQuery,
  useGetJaewonsaengLinkedHadaProfilesQuery,
} from '@/domain/jaewonsaeng/api';
import { useGetMyProfileQuery } from '@/domain/auth/api';
import { useGetSayongjaDetailQuery } from '@/domain/sayongja/api';

import { cssObj } from '../../styles';
import {
  AcademyIcon,
  AlarmIcon,
  BirthdayIcon,
  EditIcon,
  PhoneIcon,
  SaveIcon,
  SendIcon,
  SpeechIcon,
  StudentIcon,
} from '@/common/icons';
import Image from 'next/image';

export type SingleSelectionPanelProps = {
  jojikMunuiNanoId: string;
  jojikMunuiTitle: string;
  jojikNanoId: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

export type SingleSelectionPanelContentProps = {
  jojikMunuiNanoId: string;
  jojikMunuiTitle: string;
  jojikNanoId: string;
  content: string;
  jaewonsaengNanoId: string;
  createdAt: string;
  jojikMunuiSangtaeName: string;
  linkedMunuiNanoId: string | null;
  linkedAllimNanoId: string | null;
  dapbyeonContent: string | null;
  dapbyeonAt: string | null;
  dapbyeonGesiAt: string | null;
  dapbyeonViewedAt: string | null;
  dapbyeonChwisoAt: string | null;
  dapbyeonChwisoByNanoId: string | null;
  onAfterMutation: () => Promise<unknown> | void;
  updateMutation: ReturnType<typeof useUpdateJojikMunuiMutation>;
  isAuthenticated: boolean;
};

export function SingleSelectionPanel({
  jojikMunuiNanoId,
  jojikMunuiTitle,
  jojikNanoId,
  onAfterMutation,
  isAuthenticated,
}: SingleSelectionPanelProps) {
  const { data: jojikMunuiDetail, isLoading } = useGetJojikMunuiDetailQuery(jojikMunuiNanoId, {
    enabled: isAuthenticated && Boolean(jojikMunuiNanoId),
  });

  const updateMutation = useUpdateJojikMunuiMutation();

  if (isLoading && !jojikMunuiDetail) {
    return (
      <>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>{jojikMunuiTitle}</h2>
          <p css={cssObj.panelSubtitle}>선택한 문의 정보를 불러오는 중입니다...</p>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.helperText}>선택한 문의 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  const effectiveTitle = jojikMunuiDetail?.title ?? jojikMunuiTitle ?? '';
  const effectiveContent = jojikMunuiDetail?.content ?? '';
  const effectiveJaewonsaengNanoId = jojikMunuiDetail?.jaewonsaengNanoId ?? '';
  const effectiveCreatedAt = jojikMunuiDetail?.createdAt ?? '';
  const effectiveJojikMunuiSangtaeName = jojikMunuiDetail?.jojikMunuiSangtaeName ?? '';
  const effectiveLinkedMunuiNanoId = jojikMunuiDetail?.linkedMunuiNanoId ?? null;
  const effectiveLinkedAllimNanoId = jojikMunuiDetail?.linkedAllimNanoId ?? null;
  const effectiveDapbyeonContent = jojikMunuiDetail?.dapbyeon.dapbyeonContent ?? null;
  const effectiveDapbyeonAt = jojikMunuiDetail?.dapbyeon.dapbyeonAt ?? null;
  const effectiveDapbyeonGesiAt = jojikMunuiDetail?.dapbyeon.dapbyeonGesiAt ?? null;
  const effectiveDapbyeonViewedAt = jojikMunuiDetail?.dapbyeon.dapbyeonViewedAt ?? null;
  const effectiveDapbyeonChwisoAt = jojikMunuiDetail?.dapbyeon.dapbyeonChwisoAt ?? null;
  const effectiveDapbyeonChwisoByNanoId = jojikMunuiDetail?.dapbyeon.dapbyeonChwisoByNanoId ?? null;

  return (
    <SingleSelectionPanelContent
      key={`${jojikMunuiNanoId}:${effectiveTitle}:${effectiveContent}`}
      jojikMunuiNanoId={jojikMunuiNanoId}
      jojikMunuiTitle={effectiveTitle}
      jojikNanoId={jojikNanoId}
      content={effectiveContent}
      jaewonsaengNanoId={effectiveJaewonsaengNanoId}
      createdAt={effectiveCreatedAt}
      jojikMunuiSangtaeName={effectiveJojikMunuiSangtaeName}
      linkedMunuiNanoId={effectiveLinkedMunuiNanoId}
      linkedAllimNanoId={effectiveLinkedAllimNanoId}
      dapbyeonContent={effectiveDapbyeonContent}
      dapbyeonAt={effectiveDapbyeonAt}
      dapbyeonGesiAt={effectiveDapbyeonGesiAt}
      dapbyeonViewedAt={effectiveDapbyeonViewedAt}
      dapbyeonChwisoAt={effectiveDapbyeonChwisoAt}
      dapbyeonChwisoByNanoId={effectiveDapbyeonChwisoByNanoId}
      onAfterMutation={onAfterMutation}
      updateMutation={updateMutation}
      isAuthenticated={isAuthenticated}
    />
  );
}

export function SingleSelectionPanelContent({
  jojikMunuiNanoId,
  jojikMunuiTitle,
  jojikNanoId,
  content,
  jaewonsaengNanoId,
  createdAt,
  jojikMunuiSangtaeName,
  linkedMunuiNanoId,
  linkedAllimNanoId,
  dapbyeonContent,
  dapbyeonAt,
  dapbyeonGesiAt,
  dapbyeonViewedAt,
  dapbyeonChwisoAt,
  dapbyeonChwisoByNanoId,
  onAfterMutation,
  updateMutation,
  isAuthenticated,
}: SingleSelectionPanelContentProps) {
  const [isEditingDapbyeon, setIsEditingDapbyeon] = useState(false);
  const [dapbyeonInputValue, setDapbyeonInputValue] = useState(dapbyeonContent ?? '');

  const { data: jojikDetail } = useJojikQuery(jojikNanoId, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });

  const { data: linkedMunuiDetail } = useGetJojikMunuiDetailQuery(linkedMunuiNanoId ?? '', {
    enabled: isAuthenticated && Boolean(linkedMunuiNanoId),
  });

  const { data: linkedAllimDetail } = useGetJojikAllimDetailQuery(linkedAllimNanoId ?? '', {
    enabled: isAuthenticated && Boolean(linkedAllimNanoId),
  });

  const { data: jaewonsaengOverall } = useGetJaewonsaengOverallQuery(jaewonsaengNanoId, {
    enabled: isAuthenticated && Boolean(jaewonsaengNanoId),
  });

  const { data: jaewonsaengHadaProfiles } = useGetJaewonsaengLinkedHadaProfilesQuery(
    jaewonsaengNanoId,
    {
      enabled: isAuthenticated && Boolean(jaewonsaengNanoId),
    },
  );

  const { data: myProfile } = useGetMyProfileQuery({
    enabled: isAuthenticated,
  });

  const { data: chwisojaProfile } = useGetSayongjaDetailQuery(dapbyeonChwisoByNanoId ?? '', {
    enabled: isAuthenticated && Boolean(dapbyeonChwisoByNanoId),
  });

  const isUpdating = updateMutation.isPending;
  const hasDapbyeon = Boolean(dapbyeonContent);

  const handleStartEdit = useCallback(() => {
    setDapbyeonInputValue(dapbyeonContent ?? '');
    setIsEditingDapbyeon(true);
  }, [dapbyeonContent]);

  const handleCancelEdit = useCallback(() => {
    setDapbyeonInputValue('');
    setIsEditingDapbyeon(false);
  }, []);

  const handleSaveDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await updateMutation.mutateAsync({
      nanoId: jojikMunuiNanoId,
      data: {
        dapbyeonContent: dapbyeonInputValue.trim() || null,
        munuiSangtae: 'miGesi',
      },
    });

    setIsEditingDapbyeon(false);
    await onAfterMutation();
  };

  const handlePublishDapbyeon = async () => {
    await updateMutation.mutateAsync({
      nanoId: jojikMunuiNanoId,
      data: {
        dapbyeonContent: dapbyeonInputValue.trim() || null,
        munuiSangtae: 'gesi',
      },
    });

    setIsEditingDapbyeon(false);
    await onAfterMutation();
  };

  const handleChwisoDapbyeon = async () => {
    if (!window.confirm('답변을 취소하시겠습니까?')) return;

    await updateMutation.mutateAsync({
      nanoId: jojikMunuiNanoId,
      data: {
        munuiSangtae: 'chwiso',
      },
    });

    setIsEditingDapbyeon(false);
    setDapbyeonInputValue('');
    await onAfterMutation();
  };

  const formatDate = (value: string | null) => {
    if (!value) return '-';

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const hour = String(parsed.getHours()).padStart(2, '0');
    const minute = String(parsed.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hour}:${minute}`;
  };

  const PROFILE_PLACEHOLDER_IMAGE = 'https://placehold.co/48x48';

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{jojikMunuiTitle}</h2>
      </div>
      <div css={cssObj.panelBody}>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>문의 재원생/수강생 정보</h3>
          {jaewonsaengOverall ? (
            <div css={cssObj.jaewonsaengInfoSection(jaewonsaengOverall.jaewonsaeng.isHwalseong)}>
              <StudentIcon />
              <p css={cssObj.jaewonsaengName}>{jaewonsaengOverall.jaewonsaeng.name}</p>
              <p css={cssObj.jaewonsaengNickname}>
                {jaewonsaengOverall.jaewonsaeng.nickname ?? '-'}
              </p>
              <p css={cssObj.chip}>{jaewonsaengOverall.jaewonsaeng.jaewonCategorySangtaeName}</p>
            </div>
          ) : (
            <p css={cssObj.helperText}>재원생 정보를 불러오는 중입니다...</p>
          )}
        </div>

        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>하다 연동 정보</h3>
          {jaewonsaengHadaProfiles ? (
            <>
              {jaewonsaengHadaProfiles.haksaengProfile ? (
                <>
                  <div>
                    <p css={cssObj.panelSubtitle}>연결된 재원생</p>
                    <div css={cssObj.hadaInfoSection}>
                      <p>본인 정보</p>
                      <div css={cssObj.hadaInfoBox}>
                        <div css={cssObj.hadaProfileWrapper}>
                          <Image
                            src={PROFILE_PLACEHOLDER_IMAGE}
                            alt="내 프로필 이미지"
                            width={48}
                            height={48}
                            unoptimized
                            css={cssObj.hadaImage}
                          />
                          <div css={cssObj.hadaNameBox}>
                            <div css={cssObj.hadaName}>
                              {jaewonsaengHadaProfiles.haksaengProfile.name}
                              <span css={cssObj.chip}>
                                {jaewonsaengHadaProfiles.haksaengProfile.genderName}
                              </span>
                            </div>
                            <p css={cssObj.hadaSikbyeolja}>
                              {jaewonsaengHadaProfiles.haksaengProfile.profileSikbyeolja}
                            </p>
                          </div>
                        </div>
                        <p css={cssObj.hadaInfo}>
                          <PhoneIcon />
                          {jaewonsaengHadaProfiles.haksaengProfile.phoneNumber ?? '-'}
                        </p>
                        <p css={cssObj.hadaInfo}>
                          <BirthdayIcon />
                          {jaewonsaengHadaProfiles.haksaengProfile.birthDate ?? '-'}
                        </p>
                        <p css={cssObj.hadaInfo}>
                          광고성 수신
                          <span>
                            {jaewonsaengHadaProfiles.haksaengProfile.isAdAllowed
                              ? '동의'
                              : '비동의'}
                          </span>
                        </p>
                      </div>
                      <p>연동 보호자 정보</p>
                      {jaewonsaengHadaProfiles.bohojaProfiles.length > 0 ? (
                        <>
                          {jaewonsaengHadaProfiles.bohojaProfiles.map((profile) => (
                            <div key={profile.profileSikbyeolja} css={cssObj.hadaInfoBox}>
                              <div css={cssObj.hadaName}>
                                <p css={cssObj.panelText}>{profile.name}</p>
                                <p css={cssObj.chip}>{profile.gwangye}</p>
                              </div>
                              <p css={cssObj.hadaInfo}>
                                <PhoneIcon />
                                {profile.phoneNumber ?? '-'}
                              </p>
                            </div>
                          ))}
                        </>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : (
                <p css={cssObj.helperText}>학생 프로필이 연동되지 않았습니다.</p>
              )}
            </>
          ) : (
            <p css={cssObj.helperText}>하다 연동 정보를 불러오는 중입니다...</p>
          )}
        </div>
        <div css={cssObj.panelSection}>
          <p css={cssObj.panelSubtitle}>문의 정보</p>
          <div css={cssObj.munuiWrapper}>
            <strong css={cssObj.munuiTitle}>{jojikMunuiTitle}</strong>
            <div css={cssObj.munuiDate}>
              문의 일시
              <span>{formatDate(createdAt)}</span>
            </div>
            <p css={cssObj.munuiContent}>{content}</p>
          </div>
          <h3 css={cssObj.panelSubtitle}>관련 객체</h3>
          {jojikDetail ? (
            <div css={cssObj.linkedObjectItem}>
              <span css={cssObj.linkedObjectName}>
                <AcademyIcon /> <p>{jojikDetail.name}</p>
              </span>
            </div>
          ) : null}
          {linkedMunuiDetail ? (
            <div css={cssObj.linkedObjectItem}>
              <span css={cssObj.linkedObjectName}>
                <SpeechIcon />
                <p>{linkedMunuiDetail.title}</p>
              </span>
            </div>
          ) : null}
          {linkedAllimDetail ? (
            <div css={cssObj.linkedObjectItem}>
              <span css={cssObj.linkedObjectName}>
                <AlarmIcon /> <p>{linkedAllimDetail.title}</p>
              </span>
            </div>
          ) : null}
          {!jojikDetail && !linkedMunuiDetail && !linkedAllimDetail ? (
            <p css={cssObj.helperText}>관련 객체가 없습니다.</p>
          ) : null}
        </div>

        <div css={cssObj.panelSection}>
          <div css={cssObj.dapbyeonHeaderWrapper}>
            <h3 css={cssObj.panelSubtitle}>답변</h3>
            {!isEditingDapbyeon && (
              <Button
                size="small"
                styleType="text"
                variant="assistive"
                iconRight={<EditIcon />}
                onClick={handleStartEdit}
              >
                {hasDapbyeon ? '답변 수정' : '답변 작성'}
              </Button>
            )}
          </div>
          {dapbyeonChwisoAt && !isEditingDapbyeon ? (
            <>
              <div css={cssObj.noDapbyeonText}>
                <p css={cssObj.dapbyeonCancelText}>답변이 취소되었습니다.</p>
                <div css={cssObj.dapbyeonDateInfo}>
                  <label>답변 취소 일시</label>
                  <p>{formatDate(dapbyeonChwisoAt)}</p>
                </div>
              </div>
              {chwisojaProfile && (
                <div css={cssObj.chwisojaProfileWrapper}>
                  <label>취소자</label>
                  <div css={cssObj.jaewonsaengInfoSection(true)}>
                    <Image
                      src={PROFILE_PLACEHOLDER_IMAGE}
                      alt="내 프로필 이미지"
                      width={16}
                      height={16}
                      unoptimized
                      css={cssObj.dapbyeonWritterImage}
                    />
                    <p css={cssObj.dapbyeonWritterName}>{chwisojaProfile.name}</p>
                    <p css={cssObj.chip}>{chwisojaProfile.employmentSangtae?.name ?? '-'}</p>
                  </div>
                </div>
              )}
            </>
          ) : null}
          {hasDapbyeon && !dapbyeonChwisoAt && !isEditingDapbyeon ? (
            <>
              <div css={cssObj.dapbyeonContent}>
                <div css={cssObj.dapbyeonDateInfo}>
                  <label>답변 일시</label>
                  <p>{formatDate(dapbyeonGesiAt)}</p>
                </div>
                <div css={cssObj.dapbyeonDateInfo}>
                  <label>답변 읽음</label>
                  <p>{formatDate(dapbyeonViewedAt)}</p>
                </div>
                <p>{dapbyeonContent}</p>
              </div>
            </>
          ) : null}
          {!hasDapbyeon && !dapbyeonChwisoAt && !isEditingDapbyeon ? (
            <>
              <div css={cssObj.noDapbyeonText}>작성된 답변이 존재하지 않습니다.</div>
            </>
          ) : null}
          {isEditingDapbyeon ? (
            <form css={cssObj.dapbyeonInputArea} onSubmit={handleSaveDraft}>
              {myProfile && (
                <div css={cssObj.jaewonsaengInfoSection(true)}>
                  <Image
                    src={PROFILE_PLACEHOLDER_IMAGE}
                    alt="내 프로필 이미지"
                    width={16}
                    height={16}
                    unoptimized
                    css={cssObj.dapbyeonWritterImage}
                  />
                  <p css={cssObj.dapbyeonWritterName}>{myProfile.name}</p>
                  <p css={cssObj.chip}>{myProfile.employmentSangtae?.name ?? '-'}</p>
                </div>
              )}
              <div css={cssObj.dapbyeonBubbleContainer}>
                <div css={cssObj.dapbyeonBubble}>
                  <textarea
                    value={dapbyeonInputValue}
                    onChange={(e) => {
                      if (e.target.value.length <= 1000) {
                        setDapbyeonInputValue(e.target.value);
                      }
                    }}
                    placeholder="답변을 입력하세요"
                    css={cssObj.dapbyeonTextarea}
                  />
                  <div css={cssObj.dapbyeonFooter}>
                    <div css={cssObj.dapbyeonCharCount}>{dapbyeonInputValue.length} / 1000</div>
                    <div css={cssObj.dapbyeonActions}>
                      <Button
                        type="submit"
                        size="small"
                        styleType="text"
                        iconLeft={<SaveIcon />}
                        disabled={isUpdating}
                      >
                        저장
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        styleType="text"
                        onClick={handlePublishDapbyeon}
                        iconLeft={<SendIcon />}
                        disabled={isUpdating}
                      >
                        답변 게시
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        styleType="text"
                        variant="assistive"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : null}
          {!isEditingDapbyeon && (
            <div css={cssObj.sectionActions}>
              <Button
                size="small"
                styleType="text"
                variant="red"
                onClick={handleChwisoDapbyeon}
                disabled={isUpdating}
                isFull
              >
                {hasDapbyeon ? '문의 답변 취소' : '문의 답변 안함'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export type MultiSelectionPanelProps = {
  jojikMunuis: JojikMunuiListItem[];
};

export function MultiSelectionPanel({ jojikMunuis }: MultiSelectionPanelProps) {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>문의 {jojikMunuis.length}개 설정</h2>
      </div>
      <div css={cssObj.panelBody}>
        <div css={cssObj.salesDiv}>
          <span>준비중입니다.</span>
        </div>
      </div>
    </>
  );
}
