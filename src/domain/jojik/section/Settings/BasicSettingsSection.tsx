'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { Button, JusoSelector, OebuLinkSelector, Textfield } from '@/common/components';
import { label, labelWrapper } from '@/common/components/Textfield.style';
import {
  useJojikQuery,
  useUpdateJojikMutation,
  useUpsertJojikAddressMutation,
  useUpsertJojikHomepageMutation,
  type JojikDetailResponse,
} from '@/domain/jojik/api';
import type { JusoListItem } from '@/domain/juso/api';
import type { OebuLinkListItem } from '@/domain/oebu-link/api';
import { useAuth } from '@/global/auth';

import { cssObj } from './styles';

type BasicSettingsSectionProps = {
  jojikNanoId: string;
};

export function BasicSettingsSection({ jojikNanoId }: BasicSettingsSectionProps) {
  const queryClient = useQueryClient();
  const updateJojikMutation = useUpdateJojikMutation(jojikNanoId);
  const upsertJojikAddressMutation = useUpsertJojikAddressMutation(jojikNanoId);
  const upsertHomepageMutation = useUpsertJojikHomepageMutation(jojikNanoId);
  const { isAuthenticated } = useAuth();

  const jojikQuery = useJojikQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
  });

  const [nameInput, setNameInput] = useState<string | undefined>(undefined);
  const [introInput, setIntroInput] = useState<string | undefined>(undefined);
  const [addressInput, setAddressInput] = useState<string | undefined>(undefined);
  const [homepageInput, setHomepageInput] = useState<string | undefined>(undefined);
  const [selectedHomepage, setSelectedHomepage] = useState<OebuLinkListItem | undefined>(undefined);

  const { data: jojik, isError } = jojikQuery;

  const currentName = nameInput ?? jojik?.name ?? '';
  const currentIntro = introInput ?? jojik?.intro ?? '';
  const currentAddress = addressInput ?? formatJojikAddress(jojik);
  const currentHomepage = homepageInput ?? formatJojikHomepage(jojik);

  const trimmedName = currentName.trim();
  const trimmedIntro = currentIntro.trim();
  const trimmedAddress = currentAddress.trim();
  const trimmedHomepage = currentHomepage.trim();

  const isDirty = useMemo(() => {
    if (!jojik) return false;
    return trimmedName !== (jojik.name ?? '') || trimmedIntro !== (jojik.intro ?? '');
  }, [jojik, trimmedIntro, trimmedName]);

  const isAddressDirty = useMemo(() => {
    if (!jojik) return false;
    return trimmedAddress !== formatJojikAddress(jojik);
  }, [jojik, trimmedAddress]);

  const isHomepageDirty = useMemo(() => {
    if (!jojik) return false;
    return trimmedHomepage !== formatJojikHomepage(jojik);
  }, [jojik, trimmedHomepage]);

  const isValid = trimmedName.length > 0;
  const isAddressValid = trimmedAddress.length > 0;
  const isHomepageValid = trimmedHomepage.length > 0;

  const handleSave = () => {
    if (!isDirty || !isValid) return;
    updateJojikMutation.mutate(
      { name: trimmedName, intro: trimmedIntro },
      {
        onSuccess: async (data) => {
          setNameInput(data.name ?? trimmedName);
          setIntroInput(data.intro ?? trimmedIntro);
          await queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
      },
    );
  };

  const handleAddressSave = () => {
    if (!isAddressDirty || !isAddressValid) return;

    upsertJojikAddressMutation.mutate(
      { address: trimmedAddress },
      {
        onSuccess: async () => {
          setAddressInput(trimmedAddress);
          await queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
      },
    );
  };

  const isSaving = updateJojikMutation.isPending;
  const isAddressSaving = upsertJojikAddressMutation.isPending;
  const isHomepageSaving = upsertHomepageMutation.isPending;

  const handleJusoSelectComplete = (selected: JusoListItem[]) => {
    const formatted = formatSelectedJuso(selected[0]);
    if (!formatted) return;
    setAddressInput(formatted);
  };

  const handleHomepageSelectComplete = (selected: OebuLinkListItem[]) => {
    const [homepage] = selected;
    if (!homepage) return;
    setSelectedHomepage(homepage);
    setHomepageInput(homepage.linkUrl);
  };

  const handleHomepageSave = () => {
    if (!isHomepageDirty || !isHomepageValid || !selectedHomepage) return;

    upsertHomepageMutation.mutate(
      { url: trimmedHomepage },
      {
        onSuccess: async () => {
          setHomepageInput(trimmedHomepage);
          await queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
      },
    );
  };

  const homepageButtonLabel =
    formatOebuLinkLabel(selectedHomepage) || formatJojikHomepageLabel(jojik) || '조직 홈페이지를 선택하세요';

  return (
    <section css={cssObj.card}>
      <div css={cssObj.cardHeader}>
        <div css={cssObj.cardTitleGroup}>
          <h2 css={cssObj.cardTitle}>조직 기본 설정</h2>
        </div>
      </div>

      <div css={cssObj.cardBody}>
        {isError && !jojik ? <p css={cssObj.errorText}>조직 정보를 불러오지 못했습니다.</p> : null}
        <Textfield
          label="조직 이름"
          helperText="30자 내의 조직 이름을 입력해주세요"
          maxLength={30}
          value={currentName}
          onValueChange={(value) => {
            setNameInput(value);
          }}
          singleLine
        />
        <Textfield
          label="조직 소개"
          placeholder="조직 소개를 입력하세요"
          maxLength={100}
          value={currentIntro}
          onValueChange={(value) => {
            setIntroInput(value);
          }}
        />
        <div css={cssObj.cardFooter}>
          <Button
            size="small"
            variant="secondary"
            styleType="solid"
            disabled={!isDirty || !isValid || isSaving}
            onClick={handleSave}
            isLoading={isSaving}
          >
            저장
          </Button>
        </div>
        <div css={cssObj.addressField}>
          <div css={labelWrapper}>
            <span css={label}>조직 주소</span>
          </div>
          <JusoSelector
            jojikNanoId={jojikNanoId}
            isAuthenticated={isAuthenticated}
            maxSelectable={1}
            buttonLabel={currentAddress || '조직 주소를 입력하세요'}
            onComplete={handleJusoSelectComplete}
          />
        </div>
        <div css={cssObj.cardFooter}>
          <Button
            size="small"
            variant="secondary"
            styleType="solid"
            disabled={!isAddressDirty || !isAddressValid || isAddressSaving}
            onClick={handleAddressSave}
            isLoading={isAddressSaving}
          >
            저장
          </Button>
        </div>
        <div css={cssObj.addressField}>
          <div css={labelWrapper}>
            <span css={label}>조직 홈페이지</span>
          </div>
          <OebuLinkSelector
            jojikNanoId={jojikNanoId}
            isAuthenticated={isAuthenticated}
            maxSelectable={1}
            buttonLabel={homepageButtonLabel}
            onComplete={handleHomepageSelectComplete}
          />
        </div>
        <div css={cssObj.cardFooter}>
          <Button
            size="small"
            variant="secondary"
            styleType="solid"
            disabled={!isHomepageDirty || !isHomepageValid || isHomepageSaving || !selectedHomepage}
            onClick={handleHomepageSave}
            isLoading={isHomepageSaving}
          >
            저장
          </Button>
        </div>
      </div>
    </section>
  );
}

const formatJojikAddress = (jojik?: JojikDetailResponse) => {
  const base = jojik?.juso?.juso ?? '';
  const detail = jojik?.juso?.jusoDetail ?? '';
  return [base, detail].filter(Boolean).join(' ').trim();
};

const formatSelectedJuso = (juso?: JusoListItem) => {
  if (!juso) return '';
  return [juso.juso, juso.jusoDetail].filter(Boolean).join(' ').trim();
};

const formatJojikHomepage = (jojik?: JojikDetailResponse) => jojik?.homepageUrl?.linkUrl?.trim() ?? '';

const formatJojikHomepageLabel = (jojik?: JojikDetailResponse) => {
  const homepage = jojik?.homepageUrl;
  if (!homepage) return '';
  return homepage.titleName?.trim() || homepage.name?.trim() || homepage.linkUrl?.trim() || '';
};

const formatOebuLinkLabel = (link?: OebuLinkListItem) => {
  if (!link) return '';
  return link.titleName?.trim() || link.name?.trim() || link.linkUrl?.trim() || '';
};
