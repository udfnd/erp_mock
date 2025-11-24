'use client';

import { type FormEvent, useMemo, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useCreateJusoMutation,
  useDeleteJusoMutation,
  useGetJusoDetailQuery,
  useUpdateJusoMutation,
} from '@/domain/juso/api';
import type { UpdateJusoRequest } from '@/domain/juso/api/juso.schema';

import { jusoListViewCss } from './styles';
import type { JusoSettingsSectionProps } from './useJusoListViewSections';

type DaumPostcodeConstructor = new (config: { oncomplete: (data: DaumPostcodeResult) => void }) => {
  open: () => void;
};

type DaumPostcodeResult = {
  address: string;
  buildingName: string;
  apartment: 'Y' | 'N';
  bname: string;
};

declare global {
  interface Window {
    daum?: { Postcode?: DaumPostcodeConstructor };
  }
}

type CreateJusoPanelProps = {
  jojikNanoId: string;
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

type SingleSelectionPanelProps = {
  jusoNanoId: string;
  jusoName: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

type UpdateJusoMutationResult = ReturnType<typeof useUpdateJusoMutation>;
type DeleteJusoMutationResult = ReturnType<typeof useDeleteJusoMutation>;

type SingleSelectionPanelContentProps = {
  jusoNanoId: string;
  jusoName: string;
  jusoDetail: string;
  juso: string;
  onAfterMutation: () => Promise<unknown> | void;
  updateMutation: UpdateJusoMutationResult;
  deleteMutation: DeleteJusoMutationResult;
};

function useDaumPostcode() {
  const openPostcode = (onComplete: (result: DaumPostcodeResult) => void) => {
    const existing = document.getElementById('daum_postcode_script');
    const ensureScript = () => {
      if (typeof window === 'undefined') return;
      if (window.daum?.Postcode) {
        const Postcode = window.daum.Postcode as DaumPostcodeConstructor;
        const postcode = new Postcode({ oncomplete: onComplete });
        postcode.open();
        return;
      }
    };

    if (existing) {
      ensureScript();
      return;
    }

    const script = document.createElement('script');
    script.id = 'daum_postcode_script';
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => ensureScript();
    document.body.appendChild(script);
  };

  return { openPostcode };
}

export function JusoSettingsSection({
  jojikNanoId,
  selectedJusos,
  isCreating,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
}: JusoSettingsSectionProps) {
  if (!jojikNanoId) {
    return (
      <aside css={jusoListViewCss.settingsPanel}>
        <div css={jusoListViewCss.panelHeader}>
          <h2 css={jusoListViewCss.panelTitle}>조직이 선택되지 않았습니다</h2>
          <p css={jusoListViewCss.panelSubtitle}>URL의 조직 식별자를 확인해 주세요.</p>
        </div>
        <div css={jusoListViewCss.panelBody}>
          <p css={jusoListViewCss.helperText}>조직 ID가 없으면 주소 데이터를 불러올 수 없습니다.</p>
        </div>
      </aside>
    );
  }

  if (isCreating) {
    return (
      <aside css={jusoListViewCss.settingsPanel}>
        <CreateJusoPanel
          jojikNanoId={jojikNanoId}
          onExit={isCreating ? onExitCreate : undefined}
          onAfterMutation={onAfterMutation}
        />
      </aside>
    );
  }

  if (selectedJusos.length === 0) {
    return (
      <aside css={jusoListViewCss.settingsPanel}>
        <div css={jusoListViewCss.panelHeader}>
          <h2 css={jusoListViewCss.panelTitle}>주소를 선택해 주세요</h2>
          <p css={jusoListViewCss.panelSubtitle}>
            왼쪽 목록에서 주소를 선택하거나 상단의 추가 버튼을 눌러 새 주소를 만드세요.
          </p>
        </div>
        <div css={jusoListViewCss.panelBody}>
          <p css={jusoListViewCss.helperText}>선택된 항목이 없으면 상세 정보를 표시할 수 없습니다.</p>
        </div>
      </aside>
    );
  }

  if (selectedJusos.length === 1) {
    return (
      <aside css={jusoListViewCss.settingsPanel}>
        <SingleSelectionPanel
          jusoNanoId={selectedJusos[0].nanoId}
          jusoName={selectedJusos[0].jusoName}
          onAfterMutation={onAfterMutation}
          isAuthenticated={isAuthenticated}
        />
      </aside>
    );
  }

  return (
    <aside css={jusoListViewCss.settingsPanel}>
      <div css={jusoListViewCss.panelHeader}>
        <h2 css={jusoListViewCss.panelTitle}>여러 주소가 선택되었습니다</h2>
        <p css={jusoListViewCss.panelSubtitle}>
          한 번에 하나의 주소만 수정하거나 삭제할 수 있습니다.
        </p>
      </div>
      <div css={jusoListViewCss.panelBody}>
        <p css={jusoListViewCss.helperText}>하나의 주소만 선택하거나 새 주소를 추가해 보세요.</p>
      </div>
    </aside>
  );
}

function CreateJusoPanel({ jojikNanoId, onExit, onAfterMutation }: CreateJusoPanelProps) {
  const createMutation = useCreateJusoMutation();
  const { openPostcode } = useDaumPostcode();
  const [jusoName, setJusoName] = useState('');
  const [jusoDetail, setJusoDetail] = useState('');
  const [juso, setJuso] = useState('');

  const isSaving = createMutation.isPending;
  const formId = 'juso-create-form';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!jusoName.trim() || !juso.trim()) {
      return;
    }

    await createMutation.mutateAsync({
      jusoName: jusoName.trim(),
      jusoDetail: jusoDetail.trim(),
      juso: juso.trim(),
      jojikNanoId,
    });

    setJusoName('');
    setJusoDetail('');
    setJuso('');
    onAfterMutation();
    onExit?.();
  };

  const handleOpenAddressSearch = () => {
    openPostcode((data) => {
      const detail = [data.bname, data.buildingName].filter(Boolean).join(' ');
      setJuso(data.address);
      setJusoDetail(detail);
    });
  };

  return (
    <>
      <div css={jusoListViewCss.panelHeader}>
        <h2 css={jusoListViewCss.panelTitle}>새 주소 추가</h2>
        <p css={jusoListViewCss.panelSubtitle}>선택된 조직에 새로운 주소를 생성합니다.</p>
      </div>
      <form id={formId} css={jusoListViewCss.panelBody} onSubmit={handleSubmit}>
        <div css={jusoListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="주소 이름"
            placeholder="주소 이름을 입력하세요"
            value={jusoName}
            onValueChange={setJusoName}
            maxLength={80}
          />
        </div>
        <div css={jusoListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="주소"
            placeholder="주소를 입력해 주세요"
            value={juso}
            onValueChange={setJuso}
            onClick={handleOpenAddressSearch}
            readOnly
          />
          <Textfield
            singleLine
            label="상세 주소"
            placeholder="상세 주소를 입력하세요"
            value={jusoDetail}
            onValueChange={setJusoDetail}
          />
          <p css={jusoListViewCss.helperText}>
            주소 입력창을 클릭하면 카카오 주소 검색을 사용할 수 있습니다.
          </p>
        </div>
        {createMutation.isError && (
          <p css={jusoListViewCss.helperText}>
            주소 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
      </form>
      <div css={jusoListViewCss.panelFooter}>
        {onExit ? (
          <Button styleType="text" variant="secondary" onClick={onExit} disabled={isSaving}>
            취소
          </Button>
        ) : null}
        <Button type="submit" form={formId} disabled={!jusoName.trim() || !juso.trim() || isSaving}>
          주소 생성
        </Button>
      </div>
    </>
  );
}

function SingleSelectionPanel({
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
      <>
        <div css={jusoListViewCss.panelHeader}>
          <h2 css={jusoListViewCss.panelTitle}>{jusoName}</h2>
          <p css={jusoListViewCss.panelSubtitle}>선택한 주소 정보를 불러오는 중입니다...</p>
        </div>
        <div css={jusoListViewCss.panelBody}>
          <p css={jusoListViewCss.helperText}>선택한 주소 정보를 불러오는 중입니다...</p>
        </div>
      </>
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
      <div css={jusoListViewCss.panelHeader}>
        <h2 css={jusoListViewCss.panelTitle}>{jusoName}</h2>
        <p css={jusoListViewCss.panelSubtitle}>선택한 주소의 정보를 확인하고 수정할 수 있습니다.</p>
      </div>
      <form id={formId} css={jusoListViewCss.panelBody} onSubmit={handleSubmit}>
        <div css={jusoListViewCss.panelSection}>
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
        <div css={jusoListViewCss.panelSection}>
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
          <p css={jusoListViewCss.helperText}>
            주소 입력창을 클릭하면 카카오 주소 검색을 사용할 수 있습니다.
          </p>
        </div>
        {updateMutation.isError && (
          <p css={jusoListViewCss.helperText}>
            주소 업데이트 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
        {deleteMutation.isError && (
          <p css={jusoListViewCss.helperText}>
            주소 삭제 중 문제가 발생했습니다. 다시 시도해 주세요.
          </p>
        )}
      </form>
      <div css={jusoListViewCss.panelFooter}>
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
    </>
  );
}
