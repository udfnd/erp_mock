'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { Button, JusoSelector, OebuLinkSelector, Textfield } from '@/common/components';
import { cssObj as textfieldCss } from '@/common/components/Textfield.style';
import {
  useJojikQuery,
  useUpdateJojikMutation,
  type JojikDetailResponse,
} from '@/domain/jojik/api';
import type { JusoListItem } from '@/domain/juso/api';
import type { OebuLinkListItem } from '@/domain/oebu-link/api';

import { cssObj } from './styles';

type BasicSettingsSectionProps = {
  jojikNanoId: string;
};

export function BasicSettingsSection({ jojikNanoId }: BasicSettingsSectionProps) {
  const queryClient = useQueryClient();
  const updateJojikMutation = useUpdateJojikMutation(jojikNanoId);

  const jojikQuery = useJojikQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
  });

  const [nameInput, setNameInput] = useState<string | undefined>(undefined);
  const [introInput, setIntroInput] = useState<string | undefined>(undefined);
  const [addressInput, setAddressInput] = useState<string | undefined>(undefined);
  const [homepageInput, setHomepageInput] = useState<string | undefined>(undefined);
  const [selectedJusoNanoId, setSelectedJusoNanoId] = useState<string | null | undefined>(
    undefined,
  );
  const [selectedHomepageNanoId, setSelectedHomepageNanoId] = useState<string | null | undefined>(
    undefined,
  );
  const [selectedJuso, setSelectedJuso] = useState<JusoListItem | undefined>(undefined);
  const [selectedHomepage, setSelectedHomepage] = useState<OebuLinkListItem | undefined>(undefined);

  const { data: jojik, isError } = jojikQuery;

  const currentName = nameInput ?? jojik?.name ?? '';
  const currentIntro = introInput ?? jojik?.intro ?? '';
  const currentAddress = addressInput ?? formatJojikAddress(jojik);
  const currentHomepage = homepageInput ?? formatJojikHomepage(jojik);
  const initialAddressNanoId = jojik?.juso?.nanoId ?? null;
  const initialHomepageNanoId = jojik?.homepageUrl?.nanoId ?? null;
  const currentAddressNanoId = selectedJusoNanoId ?? initialAddressNanoId;
  const currentHomepageNanoId = selectedHomepageNanoId ?? initialHomepageNanoId;

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
    return (
      trimmedAddress !== formatJojikAddress(jojik) || currentAddressNanoId !== initialAddressNanoId
    );
  }, [currentAddressNanoId, initialAddressNanoId, jojik, trimmedAddress]);

  const isHomepageDirty = useMemo(() => {
    if (!jojik) return false;
    return (
      trimmedHomepage !== formatJojikHomepage(jojik) ||
      currentHomepageNanoId !== initialHomepageNanoId
    );
  }, [currentHomepageNanoId, initialHomepageNanoId, jojik, trimmedHomepage]);

  const isValid = trimmedName.length > 0;
  const isAddressValid = trimmedAddress.length > 0 || currentAddressNanoId === null;
  const isHomepageValid = trimmedHomepage.length > 0 || currentHomepageNanoId === null;

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

    updateJojikMutation.mutate(
      { jusoNanoId: currentAddressNanoId },
      {
        onSuccess: async (data) => {
          setAddressInput(formatJojikAddress(data));
          setSelectedJusoNanoId(data.juso?.nanoId ?? null);
          setSelectedJuso(mapJojikJusoToListItem(data.juso));
          await queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
      },
    );
  };

  const isSaving = updateJojikMutation.isPending;
  const isAddressSaving = updateJojikMutation.isPending;
  const isHomepageSaving = updateJojikMutation.isPending;

  const handleJusoSelectComplete = (selected: JusoListItem[]) => {
    const [juso] = selected;
    const formatted = formatSelectedJuso(juso);
    if (!formatted) return;
    setSelectedJuso(juso);
    setSelectedJusoNanoId(juso?.nanoId ?? null);
    setAddressInput(formatted);
  };

  const handleAddressClear = () => {
    setSelectedJusoNanoId(null);
    setSelectedJuso(undefined);
    setAddressInput('');
  };

  const handleHomepageSelectComplete = (selected: OebuLinkListItem[]) => {
    const [homepage] = selected;
    if (!homepage) return;
    setSelectedHomepage(homepage);
    setSelectedHomepageNanoId(homepage.nanoId);
    setHomepageInput(homepage.linkUrl);
  };

  const handleHomepageClear = () => {
    setSelectedHomepage(undefined);
    setSelectedHomepageNanoId(null);
    setHomepageInput('');
  };

  const handleHomepageSave = () => {
    if (!isHomepageDirty || !isHomepageValid) return;

    updateJojikMutation.mutate(
      { homepageUrl: trimmedHomepage || null, homepageUrlNanoId: currentHomepageNanoId },
      {
        onSuccess: async (data) => {
          setHomepageInput(formatJojikHomepage(data));
          setSelectedHomepageNanoId(data.homepageUrl?.nanoId ?? null);
          setSelectedHomepage(mapHomepageToOebuLinkListItem(data.homepageUrl));
          await queryClient.invalidateQueries({ queryKey: ['jojik', jojikNanoId] });
        },
      },
    );
  };

  const selectedJusoValue =
    selectedJuso ??
    (selectedJusoNanoId === undefined ? mapJojikJusoToListItem(jojik?.juso) : undefined);
  const selectedHomepageValue =
    selectedHomepage ??
    (selectedHomepageNanoId === undefined
      ? mapHomepageToOebuLinkListItem(jojik?.homepageUrl)
      : undefined);

  const homepageButtonLabel =
    formatOebuLinkLabel(selectedHomepageValue) ||
    (homepageInput !== undefined ? homepageInput : formatJojikHomepageLabel(jojik)) ||
    '조직 홈페이지를 선택하세요';

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
          <div css={textfieldCss.labelWrapper}>
            <span css={textfieldCss.label}>조직 주소</span>
          </div>
          <JusoSelector
            jojikNanoId={jojikNanoId}
            maxSelectable={1}
            buttonLabel={currentAddress || '조직 주소를 입력하세요'}
            onComplete={handleJusoSelectComplete}
            onClear={handleAddressClear}
            value={selectedJusoValue ? [selectedJusoValue] : undefined}
            onValueChange={(jusos) => {
              const [juso] = jusos;
              setSelectedJuso(juso);
              setSelectedJusoNanoId(juso?.nanoId ?? null);
            }}
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
          <div css={textfieldCss.labelWrapper}>
            <span css={textfieldCss.label}>조직 홈페이지</span>
          </div>
          <OebuLinkSelector
            jojikNanoId={jojikNanoId}
            maxSelectable={1}
            buttonLabel={homepageButtonLabel}
            onComplete={handleHomepageSelectComplete}
            onClear={handleHomepageClear}
            value={selectedHomepageValue ? [selectedHomepageValue] : undefined}
            onValueChange={(links) => {
              const [link] = links;
              setSelectedHomepage(link);
              setSelectedHomepageNanoId(link?.nanoId ?? null);
            }}
          />
        </div>
        <div css={cssObj.cardFooter}>
          <Button
            size="small"
            variant="secondary"
            styleType="solid"
            disabled={!isHomepageDirty || !isHomepageValid || isHomepageSaving}
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

const mapJojikJusoToListItem = (juso?: JojikDetailResponse['juso']) => {
  if (!juso) return undefined;
  return {
    nanoId: juso.nanoId,
    jusoName: juso.name,
    juso: juso.juso,
    jusoDetail: juso.jusoDetail,
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: '',
  } satisfies JusoListItem;
};

const formatSelectedJuso = (juso?: JusoListItem) => {
  if (!juso) return '';
  return [juso.juso, juso.jusoDetail].filter(Boolean).join(' ').trim();
};

const formatJojikHomepage = (jojik?: JojikDetailResponse) =>
  jojik?.homepageUrl?.linkUrl?.trim() ?? '';

const mapHomepageToOebuLinkListItem = (
  homepage?: JojikDetailResponse['homepageUrl'],
) => {
  if (!homepage) return undefined;
  return {
    nanoId: homepage.nanoId,
    name: homepage.name,
    titleName: homepage.titleName,
    linkUrl: homepage.linkUrl,
    linkIcon: homepage.icon?.nanoId ?? null,
    createdAt: '',
    createdBy: '',
  } satisfies OebuLinkListItem;
};

const formatJojikHomepageLabel = (jojik?: JojikDetailResponse) => {
  const homepage = jojik?.homepageUrl;
  if (!homepage) return '';
  return homepage.titleName?.trim() || homepage.name?.trim() || homepage.linkUrl?.trim() || '';
};

const formatOebuLinkLabel = (link?: OebuLinkListItem) => {
  if (!link) return '';
  return link.titleName?.trim() || link.name?.trim() || link.linkUrl?.trim() || '';
};
