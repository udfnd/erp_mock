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
          <h2 css={cssObj.panelTitle}>{jusoName}</h2>
          <p css={cssObj.panelSubtitle}>선택한 주소 정보를 불러오는 중입니다...</p>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.helperText}>선택한 주소 정보를 불러오는 중입니다...</p>
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
    <div>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{jusoName}</h2>
        <p css={cssObj.panelSubtitle}>선택한 주소의 정보를 확인하고 수정할 수 있습니다.</p>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="주소 이름"
            placeholder="주소 이름을 입력하세요"
            value={formState.jusoName}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, jusoName: value }))}
            maxLength={80}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="주소"
            placeholder="주소를 입력해 주세요"
            value={formState.juso}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, juso: value }))}
            onClick={openAddressSearch}
            readOnly
          />
          <Textfield
            singleLine
            label="상세 주소"
            placeholder="상세 주소를 입력하세요"
            value={formState.jusoDetail}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, jusoDetail: value }))}
          />
          <p css={cssObj.helperText}>
            주소 입력창을 클릭하면 카카오 주소 검색을 사용할 수 있습니다.
          </p>
        </div>
        {updateMutation.isError ? (
          <p css={cssObj.helperText}>
            주소 업데이트 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : null}
        {deleteMutation.isError ? (
          <p css={cssObj.helperText}>주소 삭제 중 문제가 발생했습니다. 다시 시도해 주세요.</p>
        ) : null}
      </form>
      <div css={cssObj.panelFooter}>
        <Button
          styleType="text"
          variant="secondary"
          onClick={handleDelete}
          disabled={isSaving || isDeleting}
        >
          주소 삭제
        </Button>
        <Button
          type="submit"
          form={formId}
          disabled={(!hasChanges && !updateMutation.isError) || isSaving || isDeleting}
        >
          변경 사항 저장
        </Button>
      </div>
    </div>
  );
}
