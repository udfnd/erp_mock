'use client';

import { useState } from 'react';
import { Button, Dropdown } from '@/common/components';
import {
  useCreateJojikBejaewonsaengAllimMutation,
  useCreateJojikAllimMutation,
  useCreateJojikBejaewonsaengTemplateAllimMutation,
  useCreateJojikTemplateAllimMutation,
} from '../../../../api';
import { useGetAllimTypesQuery } from '@/domain/allim-type/api';
import { useGetSmsBalsinBunhosQuery } from '@/domain/sms-balsin-bunho/api';
import { useGetKakaoChannelsQuery } from '@/domain/kakao-channel/api';
import { useGetEmailDomainsQuery } from '@/domain/email-domain/api';
import { useGetHadaAllimChannelsQuery } from '@/domain/hada-allim-channel/api';
import { useGetAllimTemplatesQuery } from '@/domain/allim-template/api';
import { useGetJaewonsaengsQuery } from '@/domain/jaewonsaeng/api';
import { cssObj } from '../../styles';

export type CreateAllimPanelProps = {
  jojikNanoId: string;
  branch: 'jaewonsaeng' | 'bejaewonsaeng';
  type: 'normal' | 'template';
  onAfterMutation: () => void;
  onExit: () => void;
};

export function CreateAllimPanel({
  jojikNanoId,
  branch,
  type,
  onAfterMutation,
  onExit,
}: CreateAllimPanelProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allimTypeNanoId, setAllimTypeNanoId] = useState('');

  // For jaewonsaeng branches
  const [jaewonsaengNanoId, setJaewonsaengNanoId] = useState('');
  const [hadaProfileSikbyeolja, setHadaProfileSikbyeolja] = useState('');

  // For HADA allim (jaewonsaeng only)
  const [enableHada, setEnableHada] = useState(false);
  const [hadaAllimChannelNanoId, setHadaAllimChannelNanoId] = useState('');
  const [isPushNotification, setIsPushNotification] = useState(false);
  const [hadaSendScheduleAt, setHadaSendScheduleAt] = useState<string | null>(null);

  const [enableSms, setEnableSms] = useState(false);
  const [smsBalsinBunhoNanoId, setSmsBalsinBunhoNanoId] = useState('');
  const [susinPhoneNumber, setSusinPhoneNumber] = useState('');
  const [smsSendScheduleAt, setSmsSendScheduleAt] = useState<string | null>(null);
  const [smsIsSendIfFailed, setSmsIsSendIfFailed] = useState(false);

  const [enableKakao, setEnableKakao] = useState(false);
  const [kakaoChannelNanoId, setKakaoChannelNanoId] = useState('');
  const [kakaoSusinPhoneNumber, setKakaoSusinPhoneNumber] = useState('');
  const [kakaoSendScheduleAt, setKakaoSendScheduleAt] = useState<string | null>(null);
  const [kakaoIsSendIfFailed, setKakaoIsSendIfFailed] = useState(false);

  const [enableEmail, setEnableEmail] = useState(false);
  const [emailDomainNanoId, setEmailDomainNanoId] = useState('');
  const [balsinjaNanoId, setBalsinjaNanoId] = useState('');
  const [susinEmailAddress, setSusinEmailAddress] = useState('');
  const [emailSendScheduleAt, setEmailSendScheduleAt] = useState<string | null>(null);
  const [emailIsSendIfFailed, setEmailIsSendIfFailed] = useState(false);

  // For template branches
  const [allimTemplateNanoId, setAllimTemplateNanoId] = useState('');
  const [allimTemplateParameterInput, setAllimTemplateParameterInput] = useState('');

  const createBejaewonsaengMutation = useCreateJojikBejaewonsaengAllimMutation();
  const createBejaewonsaengTemplateMutation = useCreateJojikBejaewonsaengTemplateAllimMutation();
  const createJaewonsaengMutation = useCreateJojikAllimMutation();
  const createJaewonsaengTemplateMutation = useCreateJojikTemplateAllimMutation();

  const { data: allimTypesData } = useGetAllimTypesQuery();
  const { data: smsBalsinBunhosData } = useGetSmsBalsinBunhosQuery({ jojikNanoId });
  const { data: kakaoChannelsData } = useGetKakaoChannelsQuery({ jojikNanoId });
  const { data: emailDomainsData } = useGetEmailDomainsQuery({ jojikNanoId });
  const { data: hadaAllimChannelsData } = useGetHadaAllimChannelsQuery(
    { jojikNanoId },
    { enabled: branch === 'jaewonsaeng' },
  );
  const { data: allimTemplatesData } = useGetAllimTemplatesQuery(
    { jojikNanoId },
    { enabled: type === 'template' },
  );
  const { data: jaewonsaengsData } = useGetJaewonsaengsQuery(
    { jojikNanoId },
    { enabled: branch === 'jaewonsaeng' },
  );

  const allimTypes = allimTypesData?.allimTypes || [];
  const smsBalsinBunhos = smsBalsinBunhosData?.balsinBunhos || [];
  const kakaoChannels = kakaoChannelsData?.kakaoChannels || [];
  const emailDomains = emailDomainsData?.domains || [];
  const hadaAllimChannels = hadaAllimChannelsData?.allimChannels || [];
  const allimTemplates = allimTemplatesData?.templates || [];
  const jaewonsaengs = jaewonsaengsData?.jaewonsaengs || [];

  const getBranchTitle = () => {
    if (branch === 'jaewonsaeng') {
      return type === 'normal' ? '재원생 일반 알림 생성' : '재원생 템플릿 알림 생성';
    }
    return type === 'normal' ? '비재원생 일반 알림 생성' : '비재원생 템플릿 알림 생성';
  };

  const handleSubmit = async () => {
    try {
      if (branch === 'bejaewonsaeng' && type === 'normal') {
        await createBejaewonsaengMutation.mutateAsync({
          jojikNanoId,
          title,
          content,
          allimTypeNanoId,
          smsBalsinInfo: enableSms
            ? {
                smsBalsinBunhoNanoId,
                susinPhoneNumber,
                sendScehduleAt: smsSendScheduleAt,
                isSendIfFailed: smsIsSendIfFailed,
              }
            : null,
          kakaoBalsinInfo: enableKakao
            ? {
                kakaoChannelNanoId,
                susinPhoneNumber: kakaoSusinPhoneNumber,
                sendScheduleAt: kakaoSendScheduleAt,
                isSendIfFailed: kakaoIsSendIfFailed,
              }
            : null,
          emailBalsinInfo: enableEmail
            ? {
                balsinjaNanoId,
                susinEmailAddress,
                sendScheduleAt: emailSendScheduleAt,
                isSendIfFailed: emailIsSendIfFailed,
              }
            : null,
        });
      } else if (branch === 'bejaewonsaeng' && type === 'template') {
        await createBejaewonsaengTemplateMutation.mutateAsync({
          jojikNanoId,
          allimTypeNanoId,
          allimTemplateNanoId,
          allimTemplateParameterInput,
          smsBalsinInfo: enableSms
            ? {
                smsBalsinBunhoNanoId,
                susinPhoneNumber,
                sendScehduleAt: smsSendScheduleAt,
                isSendIfFailed: smsIsSendIfFailed,
              }
            : null,
          kakaoBalsinInfo: enableKakao
            ? {
                kakaoChannelNanoId,
                susinPhoneNumber: kakaoSusinPhoneNumber,
                sendScheduleAt: kakaoSendScheduleAt,
                isSendIfFailed: kakaoIsSendIfFailed,
              }
            : null,
          emailBalsinInfo: enableEmail
            ? {
                balsinjaNanoId,
                susinEmailAddress,
                sendScheduleAt: emailSendScheduleAt,
                isSendIfFailed: emailIsSendIfFailed,
              }
            : null,
        });
      } else if (branch === 'jaewonsaeng' && type === 'normal') {
        await createJaewonsaengMutation.mutateAsync({
          jojikNanoId,
          jaewonsaengNanoId,
          hadaProfileSikbyeolja: Number(hadaProfileSikbyeolja),
          title,
          content,
          allimTypeNanoId,
          hadaAllimInfo: enableHada
            ? {
                hadaAllimChannelNanoId,
                isPushNotification,
                sendScheduleAt: hadaSendScheduleAt,
              }
            : null,
          smsBalsinInfo: enableSms
            ? {
                smsBalsinBunhoNanoId,
                sendScehduleAt: smsSendScheduleAt,
                isSendIfFailed: smsIsSendIfFailed,
              }
            : null,
          kakaoBalsinInfo: enableKakao
            ? {
                kakaoChannelNanoId,
                sendScheduleAt: kakaoSendScheduleAt,
                isSendIfFailed: kakaoIsSendIfFailed,
              }
            : null,
          emailBalsinInfo: enableEmail
            ? {
                balsinjaNanoId,
                sendScheduleAt: emailSendScheduleAt,
                isSendIfFailed: emailIsSendIfFailed,
              }
            : null,
        });
      } else if (branch === 'jaewonsaeng' && type === 'template') {
        await createJaewonsaengTemplateMutation.mutateAsync({
          jojikNanoId,
          jaewonsaengNanoId,
          hadaProfileSikbyeolja: Number(hadaProfileSikbyeolja),
          allimTypeNanoId,
          allimTemplateNanoId,
          allimTemplateParameterInput,
          hadaAllimInfo: enableHada
            ? {
                hadaAllimChannelNanoId,
                isPushNotification,
                sendScheduleAt: hadaSendScheduleAt,
              }
            : null,
          smsBalsinInfo: enableSms
            ? {
                smsBalsinBunhoNanoId,
                sendScehduleAt: smsSendScheduleAt,
                isSendIfFailed: smsIsSendIfFailed,
              }
            : null,
          kakaoBalsinInfo: enableKakao
            ? {
                kakaoChannelNanoId,
                sendScheduleAt: kakaoSendScheduleAt,
                isSendIfFailed: kakaoIsSendIfFailed,
              }
            : null,
          emailBalsinInfo: enableEmail
            ? {
                balsinjaNanoId,
                sendScheduleAt: emailSendScheduleAt,
                isSendIfFailed: emailIsSendIfFailed,
              }
            : null,
        });
      }
      onAfterMutation();
    } catch (error) {
      console.error('Failed to create allim:', error);
    }
  };

  const canSubmit = (() => {
    const hasChannel =
      enableSms || enableKakao || enableEmail || (branch === 'jaewonsaeng' && enableHada);
    if (!allimTypeNanoId || !hasChannel) return false;

    if (branch === 'jaewonsaeng') {
      if (!jaewonsaengNanoId || !hadaProfileSikbyeolja) return false;
      if (type === 'template') {
        return Boolean(allimTemplateNanoId && allimTemplateParameterInput);
      }
      return Boolean(title && content);
    }

    if (type === 'template') {
      return Boolean(allimTemplateNanoId && allimTemplateParameterInput);
    }
    return Boolean(title && content);
  })();

  const isLoading =
    createBejaewonsaengMutation.isPending ||
    createBejaewonsaengTemplateMutation.isPending ||
    createJaewonsaengMutation.isPending ||
    createJaewonsaengTemplateMutation.isPending;

  return (
    <div>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{getBranchTitle()}</h2>
      </div>

      <div css={cssObj.panelBody}>
        {branch === 'jaewonsaeng' && (
          <>
            <div css={cssObj.formField}>
              <label css={cssObj.panelLabel}>재원생</label>
              <Dropdown
                value={jaewonsaengNanoId}
                options={jaewonsaengs.map((jaewonsaeng) => ({
                  value: jaewonsaeng.nanoId,
                  label: jaewonsaeng.name,
                }))}
                placeholder="재원생을 선택하세요"
                onChange={setJaewonsaengNanoId}
              />
            </div>

            <div css={cssObj.formField}>
              <label css={cssObj.panelLabel}>HADA 프로필 식별자</label>
              <input
                css={cssObj.input}
                type="number"
                value={hadaProfileSikbyeolja}
                onChange={(e) => setHadaProfileSikbyeolja(e.target.value)}
                placeholder="프로필 식별자를 입력하세요 (숫자)"
              />
            </div>
          </>
        )}

        {type === 'template' ? (
          <>
            <div css={cssObj.formField}>
              <label css={cssObj.panelLabel}>알림 템플릿</label>
              <Dropdown
                value={allimTemplateNanoId}
                options={allimTemplates.map((template) => ({
                  value: template.nanoId,
                  label: template.name,
                }))}
                placeholder="템플릿을 선택하세요"
                onChange={setAllimTemplateNanoId}
              />
            </div>

            <div css={cssObj.formField}>
              <label css={cssObj.panelLabel}>템플릿 파라미터</label>
              <textarea
                css={cssObj.textarea}
                value={allimTemplateParameterInput}
                onChange={(e) => setAllimTemplateParameterInput(e.target.value)}
                placeholder="템플릿 파라미터를 입력하세요"
              />
            </div>
          </>
        ) : (
          <>
            <div css={cssObj.formField}>
              <label css={cssObj.panelLabel}>알림명</label>
              <input
                css={cssObj.input}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="알림 제목을 입력하세요"
              />
            </div>

            <div css={cssObj.formField}>
              <label css={cssObj.panelLabel}>알림 내용</label>
              <textarea
                css={cssObj.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="알림 내용을 입력하세요"
              />
            </div>
          </>
        )}

        <div css={cssObj.formField}>
          <label css={cssObj.panelLabel}>알림 종류</label>
          <Dropdown
            value={allimTypeNanoId}
            options={allimTypes.map((type) => ({
              value: type.nanoId,
              label: type.name,
            }))}
            placeholder="알림 종류를 선택하세요"
            onChange={setAllimTypeNanoId}
          />
        </div>

        {branch === 'jaewonsaeng' && (
          <div css={cssObj.toggleSection}>
            <div css={cssObj.toggleRow}>
              <label css={cssObj.panelLabel}>HADA 알림</label>
              <input
                type="checkbox"
                checked={enableHada}
                onChange={(e) => setEnableHada(e.target.checked)}
              />
            </div>
            <div css={cssObj.channelConfig}>
              <div css={cssObj.formField}>
                <label css={cssObj.panelLabel}>HADA 알림 채널</label>
                <Dropdown
                  value={hadaAllimChannelNanoId}
                  options={hadaAllimChannels.map((channel) => ({
                    value: channel.nanoId,
                    label: channel.displayName,
                  }))}
                  placeholder="채널을 선택하세요"
                  onChange={setHadaAllimChannelNanoId}
                  disabled={!enableHada}
                />
              </div>
              <div css={cssObj.formField}>
                <label>
                  <input
                    type="checkbox"
                    checked={isPushNotification}
                    onChange={(e) => setIsPushNotification(e.target.checked)}
                    disabled={!enableHada}
                  />
                  푸시 알림 전송
                </label>
              </div>
            </div>
          </div>
        )}

        <div css={cssObj.toggleSection}>
          <div css={cssObj.toggleRow}>
            <label css={cssObj.panelLabel}>SMS 알림</label>
            <input
              type="checkbox"
              checked={enableSms}
              onChange={(e) => setEnableSms(e.target.checked)}
            />
          </div>
          <div css={cssObj.channelConfig}>
            <div css={cssObj.formField}>
              <label css={cssObj.panelLabel}>SMS 발신 번호</label>
              <Dropdown
                value={smsBalsinBunhoNanoId}
                options={smsBalsinBunhos.map((bunho) => ({
                  value: bunho.nanoId,
                  label: `${bunho.name} (${bunho.phoneNumber})`,
                }))}
                placeholder="발신 번호를 선택하세요"
                onChange={setSmsBalsinBunhoNanoId}
                disabled={!enableSms}
              />
            </div>
            {branch === 'bejaewonsaeng' && (
              <div css={cssObj.formField}>
                <label css={cssObj.panelLabel}>수신 전화번호</label>
                <input
                  css={cssObj.input}
                  type="text"
                  value={susinPhoneNumber}
                  onChange={(e) => setSusinPhoneNumber(e.target.value)}
                  placeholder="010-1234-5678"
                  disabled={!enableSms}
                />
              </div>
            )}
            <div css={cssObj.formField}>
              <label>
                <input
                  type="checkbox"
                  checked={smsIsSendIfFailed}
                  onChange={(e) => setSmsIsSendIfFailed(e.target.checked)}
                  disabled={!enableSms}
                />
                대체 발송 수단으로 설정
              </label>
            </div>
          </div>
        </div>

        <div css={cssObj.toggleSection}>
          <div css={cssObj.toggleRow}>
            <label css={cssObj.panelLabel}>카카오톡 알림</label>
            <input
              type="checkbox"
              checked={enableKakao}
              onChange={(e) => setEnableKakao(e.target.checked)}
            />
          </div>
          <div css={cssObj.channelConfig}>
            <div css={cssObj.formField}>
              <label css={cssObj.panelLabel}>카카오톡 채널</label>
              <Dropdown
                value={kakaoChannelNanoId}
                options={kakaoChannels.map((channel) => ({
                  value: channel.nanoId,
                  label: channel.name,
                }))}
                placeholder="채널을 선택하세요"
                onChange={setKakaoChannelNanoId}
                disabled={!enableKakao}
              />
            </div>
            {branch === 'bejaewonsaeng' && (
              <div css={cssObj.formField}>
                <label css={cssObj.panelLabel}>수신 전화번호</label>
                <input
                  css={cssObj.input}
                  type="text"
                  value={kakaoSusinPhoneNumber}
                  onChange={(e) => setKakaoSusinPhoneNumber(e.target.value)}
                  placeholder="010-1234-5678"
                  disabled={!enableKakao}
                />
              </div>
            )}
            <div css={cssObj.formField}>
              <label>
                <input
                  type="checkbox"
                  checked={kakaoIsSendIfFailed}
                  onChange={(e) => setKakaoIsSendIfFailed(e.target.checked)}
                  disabled={!enableKakao}
                />
                대체 발송 수단으로 설정
              </label>
            </div>
          </div>
        </div>

        <div css={cssObj.toggleSection}>
          <div css={cssObj.toggleRow}>
            <label css={cssObj.panelLabel}>이메일 알림</label>
            <input
              type="checkbox"
              checked={enableEmail}
              onChange={(e) => setEnableEmail(e.target.checked)}
            />
          </div>
          <div css={cssObj.channelConfig}>
            <div css={cssObj.formField}>
              <label css={cssObj.panelLabel}>이메일 도메인</label>
              <Dropdown
                value={emailDomainNanoId}
                options={emailDomains.map((domain) => ({
                  value: domain.nanoId,
                  label: `${domain.name} (${domain.domain})`,
                }))}
                placeholder="도메인을 선택하세요"
                onChange={setEmailDomainNanoId}
                disabled={!enableEmail}
              />
            </div>
            {branch === 'bejaewonsaeng' && (
              <div css={cssObj.formField}>
                <label css={cssObj.panelLabel}>수신 이메일 주소</label>
                <input
                  css={cssObj.input}
                  type="email"
                  value={susinEmailAddress}
                  onChange={(e) => setSusinEmailAddress(e.target.value)}
                  placeholder="example@domain.com"
                  disabled={!enableEmail}
                />
              </div>
            )}
            <div css={cssObj.formField}>
              <label>
                <input
                  type="checkbox"
                  checked={emailIsSendIfFailed}
                  onChange={(e) => setEmailIsSendIfFailed(e.target.checked)}
                  disabled={!enableEmail}
                />
                대체 발송 수단으로 설정
              </label>
            </div>
          </div>
        </div>
      </div>

      <div css={cssObj.panelFooter}>
        <Button variant="secondary" onClick={onExit} disabled={isLoading}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit || isLoading}>
          {isLoading ? '생성 중...' : '생성'}
        </Button>
      </div>
    </div>
  );
}
