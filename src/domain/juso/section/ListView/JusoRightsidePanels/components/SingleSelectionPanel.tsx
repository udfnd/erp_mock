'use client';

import { type FormEvent, useMemo, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useDeleteJusoMutation,
  useGetJusoDetailQuery,
  useUpdateJusoMutation,
} from '@/domain/juso/api';
import type { UpdateJusoRequest } from '@/domain/juso/api/juso.schema';

import { cssObj } from '../../styles';
import { useDaumPostcode } from './useDaumPostcode';

export type SingleSelectionPanelProps = {
  jusoNanoId: string;
  jusoName: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

type SingleSelectionPanelContentProps = {
  jusoNanoId: string;
  jusoName: string;
  jusoDetail: string;
  juso: string;
  onAfterMutation: () => Promise<unknown> | void;
  updateMutation: ReturnType<typeof useUpdateJusoMutation>;
  deleteMutation: ReturnType<typeof useDeleteJusoMutation>;
};

export function SingleSelectionPanel({
  jusoNanoId,
  jusoName,
  onAfterMutation,
  isAuthenticated,
}: SingleSelectionPanelProps) {
  const { data: jusoDetail, isLoading } = useGetJusoDetailQuery(jusoNanoId, {
    enabled: isAuthenticated && Boolean(jusoNanoId),
  });
  const updateMutation = useUpdateJusoMutation(jusoNanoId);
  const deleteMutation = useDeleteJusoMutation(jusoNanoId);

  if (isLoading && !jusoDetail) {
    return (
      <div>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>{jusoName} 설정</h2>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.panelSubtitle}>선택한 주소 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  const effectiveName = jusoDetail?.jusoName ?? jusoName ?? '';
  const effectiveJuso = jusoDetail?.juso ?? '';
  const effectiveDetail = jusoDetail?.jusoDetail ?? '';

  return (
    <SingleSelectionPanelContent
      key={`${jusoNanoId}:${effectiveName}:${effectiveJuso}:${effectiveDetail}`}
      jusoNanoId={jusoNanoId}
      jusoName={effectiveName}
      juso={effectiveJuso}
      jusoDetail={effectiveDetail}
      onAfterMutation={onAfterMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}

function SingleSelectionPanelContent({
  jusoNanoId,
  jusoName,
  jusoDetail,
  juso,
  onAfterMutation,
  updateMutation,
  deleteMutation,
}: SingleSelectionPanelContentProps) {
  const { openPostcode } = useDaumPostcode();
  const [formState, setFormState] = useState<UpdateJusoRequest>({
    jusoName,
    jusoDetail,
    juso,
  });

  const isSaving = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const formId = `juso-update-form-${jusoNanoId}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.jusoName.trim() || !formState.juso.trim()) {
      return;
    }

    await updateMutation.mutateAsync({
      jusoName: formState.jusoName.trim(),
      jusoDetail: formState.jusoDetail.trim(),
      juso: formState.juso.trim(),
    });

    onAfterMutation();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
    onAfterMutation();
  };

  const openAddressSearch = () => {
    openPostcode((data) => {
      const detail = [data.bname, data.buildingName].filter(Boolean).join(' ');
      setFormState((prev) => ({ ...prev, juso: data.address, jusoDetail: detail }));
    });
  };

  const hasChanges = useMemo(
    () =>
      formState.jusoName !== jusoName ||
      formState.jusoDetail !== jusoDetail ||
      formState.juso !== juso,
    [formState, juso, jusoDetail, jusoName],
  );

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{jusoName} 설정</h2>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <p css={cssObj.panelSubtitle}>주소 기본 속성</p>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            label="주소 이름(별명)"
            placeholder="주소 이름(별명)을 입력해 주세요"
            helperText="이름은 최대 30자까지 입력 가능합니다."
            value={formState.jusoName}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, jusoName: value }))}
            maxLength={30}
          />
        </div>
        <div css={cssObj.panelJusoInputSection}>
          <Textfield
            singleLine
            label="주소 입력"
            placeholder="주소를 검색해 주세요."
            value={formState.juso}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, juso: value }))}
            onClick={openAddressSearch}
            readOnly
          />
          <Textfield
            singleLine
            placeholder="상세 주소를 입력해 주세요. (선택)"
            value={formState.jusoDetail}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, jusoDetail: value }))}
          />
        </div>
        <div css={cssObj.saveButtonContainer}>
          <Button
            type="submit"
            variant="secondary"
            size="small"
            form={formId}
            disabled={(!hasChanges && !updateMutation.isError) || isSaving || isDeleting}
          >
            저장
          </Button>
        </div>
      </form>
      <div>
        <div>
          <p>생성일</p>asdf
        </div>
      </div>
      <div css={cssObj.panelFooter}>
        <Button
          styleType="solid"
          variant="red"
          size="small"
          onClick={handleDelete}
          disabled={isSaving || isDeleting}
          isFull
        >
          주소 삭제
        </Button>
      </div>
    </>
  );
}
