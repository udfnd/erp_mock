'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { Button, JusoSelector, Textfield } from '@/common/components';
import { label, labelWrapper } from '@/common/components/Textfield.style';
import {
  useJojikQuery,
  useUpdateJojikMutation,
  useUpsertJojikAddressMutation,
  type JojikDetailResponse,
} from '@/domain/jojik/api';
import type { JusoListItem } from '@/domain/juso/api';
import { useAuth } from '@/global/auth';

import { cssObj } from './styles';

type BasicSettingsSectionProps = {
  jojikNanoId: string;
};

export function BasicSettingsSection({ jojikNanoId }: BasicSettingsSectionProps) {
  const queryClient = useQueryClient();
  const updateJojikMutation = useUpdateJojikMutation(jojikNanoId);
  const upsertJojikAddressMutation = useUpsertJojikAddressMutation(jojikNanoId);
  const { isAuthenticated } = useAuth();

  const jojikQuery = useJojikQuery(jojikNanoId, {
    enabled: Boolean(jojikNanoId),
  });

  const [nameInput, setNameInput] = useState<string | undefined>(undefined);
  const [introInput, setIntroInput] = useState<string | undefined>(undefined);
  const [addressInput, setAddressInput] = useState<string | undefined>(undefined);

  const { data: jojik, isError } = jojikQuery;

  const currentName = nameInput ?? jojik?.name ?? '';
  const currentIntro = introInput ?? jojik?.intro ?? '';
  const currentAddress = addressInput ?? formatJojikAddress(jojik);

  const trimmedName = currentName.trim();
  const trimmedIntro = currentIntro.trim();
  const trimmedAddress = currentAddress.trim();

  const isDirty = useMemo(() => {
    if (!jojik) return false;
    return trimmedName !== (jojik.name ?? '') || trimmedIntro !== (jojik.intro ?? '');
  }, [jojik, trimmedIntro, trimmedName]);

  const isAddressDirty = useMemo(() => {
    if (!jojik) return false;
    return trimmedAddress !== formatJojikAddress(jojik);
  }, [jojik, trimmedAddress]);

  const isValid = trimmedName.length > 0;
  const isAddressValid = trimmedAddress.length > 0;

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

  const handleJusoSelectComplete = (selected: JusoListItem[]) => {
    const formatted = formatSelectedJuso(selected[0]);
    if (!formatted) return;
    setAddressInput(formatted);
  };

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
