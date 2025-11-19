import { type FormEvent, useMemo, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useCreateJojikMutation,
  useDeleteJojikMutation,
  useJojikQuery,
  useUpdateJojikMutation,
} from '@/domain/jojik/api';
import type { JojikListItem, UpdateJojikRequest } from '@/domain/jojik/api/jojik.schema';
import { Magic, Plus } from '@/common/icons';

import { cssObj } from './styles';
import type { JojikSettingsSectionProps } from './useJojikListViewSections';

export function JojikSettingsSection({
  gigwanNanoId,
  selectedJojiks,
  setIsCreating,
  isCreating,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
}: JojikSettingsSectionProps) {
  if (!gigwanNanoId) {
    return (
      <aside css={cssObj.settingsPanel}>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>기관이 선택되지 않았습니다</h2>
          <p css={cssObj.panelSubtitle}>URL의 기관 식별자를 확인해 주세요.</p>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.helperText}>기관 ID가 없으면 조직 데이터를 불러올 수 없습니다.</p>
        </div>
      </aside>
    );
  }

  if (isCreating) {
    return (
      <aside css={cssObj.settingsPanel}>
        <CreateJojikPanel
          gigwanNanoId={gigwanNanoId}
          onExit={isCreating ? onExitCreate : undefined}
          onAfterMutation={onAfterMutation}
        />
      </aside>
    );
  }

  if (selectedJojiks.length === 0) {
    return (
      <aside css={cssObj.settingsPanel}>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>조직들 설정</h2>
        </div>
        <div css={cssObj.panelBody}>
          <span css={cssObj.panelSubtitle}>빠른 액션</span>
          <div>
            <Button
              variant="secondary"
              size="medium"
              iconLeft={<Magic />}
              onClick={() => {
                setIsCreating(true);
              }}
            >
              조직 생성 마법사
            </Button>
          </div>
        </div>
      </aside>
    );
  }

  if (selectedJojiks.length === 1) {
    return (
      <aside css={cssObj.settingsPanel}>
        <SingleSelectionPanel
          jojikNanoId={selectedJojiks[0].nanoId}
          jojikName={selectedJojiks[0].name}
          onAfterMutation={onAfterMutation}
          isAuthenticated={isAuthenticated}
        />
      </aside>
    );
  }

  return (
    <aside css={cssObj.settingsPanel}>
      <MultiSelectionPanel jojiks={selectedJojiks} />
    </aside>
  );
}

type CreateJojikPanelProps = {
  gigwanNanoId: string;
  onExit?: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

function CreateJojikPanel({ gigwanNanoId, onExit, onAfterMutation }: CreateJojikPanelProps) {
  const createMutation = useCreateJojikMutation();
  const [name, setName] = useState('');

  const isSaving = createMutation.isPending;
  const formId = 'jojik-create-form';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    await createMutation.mutateAsync({ name: trimmedName, gigwanNanoId });
    setName('');
    onAfterMutation();
    onExit?.();
  };

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>조직 생성</h2>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="조직명"
            placeholder="조직명을 입력하세요"
            value={name}
            onValueChange={setName}
            helperText="30자 이내의 이름을 입력해 주세요."
            maxLength={30}
          />
        </div>
        {createMutation.isError && (
          <p css={cssObj.helperText}>
            조직 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
      </form>
      <div css={cssObj.panelFooter}>
        <Button
          type="submit"
          size="small"
          isFull
          form={formId}
          disabled={!name.trim() || isSaving}
          iconRight={<Plus />}
        >
          조직 생성하기
        </Button>
      </div>
    </>
  );
}

type SingleSelectionPanelProps = {
  jojikNanoId: string;
  jojikName: string;
  onAfterMutation: () => Promise<unknown> | void;
  isAuthenticated: boolean;
};

type UpdateJojikMutationResult = ReturnType<typeof useUpdateJojikMutation>;
type DeleteJojikMutationResult = ReturnType<typeof useDeleteJojikMutation>;

type SingleSelectionPanelContentProps = {
  jojikNanoId: string;
  jojikName: string;
  jojikDetailNanoId?: string;
  jaewonsaengLinkRequestUrl?: string;
  openSangtae?: boolean;
  openFiles?: { nanoId: string; name: string }[];
  onAfterMutation: () => Promise<unknown> | void;
  updateMutation: UpdateJojikMutationResult;
  deleteMutation: DeleteJojikMutationResult;
};

function SingleSelectionPanel({
  jojikNanoId,
  jojikName,
  onAfterMutation,
  isAuthenticated,
}: SingleSelectionPanelProps) {
  const { data: jojikDetail, isLoading } = useJojikQuery(jojikNanoId, {
    enabled: isAuthenticated && Boolean(jojikNanoId),
  });
  const updateMutation = useUpdateJojikMutation(jojikNanoId);
  const deleteMutation = useDeleteJojikMutation(jojikNanoId);

  if (isLoading && !jojikDetail) {
    return (
      <>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>{jojikName}</h2>
          <p css={cssObj.panelSubtitle}>선택한 조직 정보를 불러오는 중입니다...</p>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.helperText}>선택한 조직 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  const effectiveName = jojikDetail?.name ?? jojikName ?? '';
  const effectiveIntro = jojikDetail?.intro ?? '';

  return (
    <SingleSelectionPanelContent
      key={`${jojikNanoId}:${effectiveName}:${effectiveIntro}`}
      jojikNanoId={jojikNanoId}
      jojikName={effectiveName}
      jojikDetailNanoId={jojikDetail?.nanoId ?? jojikNanoId}
      jaewonsaengLinkRequestUrl={jojikDetail?.jaewonsaengLinkRequestUrl}
      openSangtae={jojikDetail?.openSangtae}
      openFiles={jojikDetail?.openFiles}
      onAfterMutation={onAfterMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}

function SingleSelectionPanelContent({
  jojikNanoId,
  jojikName,
  jojikDetailNanoId,
  jaewonsaengLinkRequestUrl,
  openSangtae,
  openFiles,
  onAfterMutation,
  updateMutation,
  deleteMutation,
}: SingleSelectionPanelContentProps) {
  const [name, setName] = useState(jojikName);
  const isUpdating = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const handleSubmitName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    const payload: UpdateJojikRequest = {
      name: trimmedName,
    };

    await updateMutation.mutateAsync(payload);
    await onAfterMutation();
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 조직을 삭제하시겠습니까?')) {
      return;
    }

    await deleteMutation.mutateAsync();
    await onAfterMutation();
  };

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{jojikName} 설정</h2>
      </div>
      <div css={cssObj.panelBody}>
        <h3 css={cssObj.panelSubtitle}>조직 위젯</h3>
        <div css={cssObj.salesDiv}>
          <span>매출 관련 텍스트</span>
        </div>
        <h3 css={cssObj.panelSubtitle}>조직 속성</h3>
        <form css={cssObj.panelSection} onSubmit={handleSubmitName}>
          <Textfield
            singleLine
            required
            label="조직명"
            value={name}
            onValueChange={setName}
            helperText="30자 이내의 이름을 입력해 주세요."
            maxLength={30}
          />
          <div css={cssObj.sectionActions}>
            <Button
              type="submit"
              size="small"
              disabled={isUpdating || name.trim() === (jojikName ?? '').trim()}
            >
              저장
            </Button>
          </div>
        </form>
        <div css={cssObj.panelSection}>
          <span css={cssObj.panelLabel}>조직 식별자</span>
          <span css={cssObj.panelText}>{jojikDetailNanoId ?? jojikNanoId}</span>
        </div>
        {typeof openSangtae === 'boolean' && (
          <div css={cssObj.panelSection}>
            <span css={cssObj.panelLabel}>공개 여부</span>
            <span css={cssObj.panelText}>{openSangtae ? '공개' : '비공개'}</span>
          </div>
        )}
        {jaewonsaengLinkRequestUrl ? (
          <div css={cssObj.panelSection}>
            <span css={cssObj.panelLabel}>재원생 신청 링크</span>
            <span css={cssObj.panelText}>{jaewonsaengLinkRequestUrl}</span>
          </div>
        ) : null}
        {openFiles?.length ? (
          <div css={cssObj.panelSection}>
            <span css={cssObj.panelLabel}>공유 파일</span>
            <div css={cssObj.chipList}>
              {openFiles.map((file) => (
                <span key={file.nanoId} css={cssObj.chip}>
                  {file.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {updateMutation.isError && (
          <p css={cssObj.helperText}>조직 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}
        {deleteMutation.isError && (
          <p css={cssObj.helperText}>조직 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}
      </div>
      <div css={cssObj.panelFooter}>
        <Button
          styleType="solid"
          variant="red"
          size="small"
          isFull
          onClick={handleDelete}
          disabled={isDeleting}
        >
          삭제
        </Button>
      </div>
    </>
  );
}

type MultiSelectionPanelProps = {
  jojiks: JojikListItem[];
};

function MultiSelectionPanel({ jojiks }: MultiSelectionPanelProps) {
  const displayList = useMemo(() => jojiks.slice(0, 6), [jojiks]);

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>
          {jojiks[0].name} 외 {jojiks.length}개 설정
        </h2>
      </div>
      <div css={cssObj.panelBody}>
        <div css={cssObj.salesDiv}>
          <span>준비중입니다.</span>
        </div>
      </div>
    </>
  );
}
