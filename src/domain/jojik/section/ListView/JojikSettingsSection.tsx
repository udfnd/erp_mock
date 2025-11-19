import { type FormEvent, useMemo, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useCreateJojikMutation,
  useDeleteJojikMutation,
  useJojikQuery,
  useUpdateJojikMutation,
} from '@/domain/jojik/api';
import type { JojikListItem, UpdateJojikRequest } from '@/domain/jojik/api/jojik.schema';

import { jojikListViewCss } from './styles';
import type { JojikSettingsSectionProps } from './useJojikListViewSections';
import { Plus } from '@/common/icons';

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
      <aside css={jojikListViewCss.settingsPanel}>
        <div css={jojikListViewCss.panelHeader}>
          <h2 css={jojikListViewCss.panelTitle}>기관이 선택되지 않았습니다</h2>
          <p css={jojikListViewCss.panelSubtitle}>URL의 기관 식별자를 확인해 주세요.</p>
        </div>
        <div css={jojikListViewCss.panelBody}>
          <p css={jojikListViewCss.helperText}>
            기관 ID가 없으면 조직 데이터를 불러올 수 없습니다.
          </p>
        </div>
      </aside>
    );
  }

  if (isCreating) {
    return (
      <aside css={jojikListViewCss.settingsPanel}>
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
      <aside css={jojikListViewCss.settingsPanel}>
        <div css={jojikListViewCss.panelHeader}>
          <h2 css={jojikListViewCss.panelTitle}>조직들 설정</h2>
        </div>
        <div css={jojikListViewCss.panelBody}>
          <span css={jojikListViewCss.panelSubtitle}>빠른 액션</span>
          <Button
            variant="secondary"
            size="medium"
            isFull={false}
            iconLeft={<Plus />}
            onClick={() => {
              setIsCreating(true);
            }}
          >
            조직 생성 마법사
          </Button>
        </div>
      </aside>
    );
  }

  if (selectedJojiks.length === 1) {
    return (
      <aside css={jojikListViewCss.settingsPanel}>
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
    <aside css={jojikListViewCss.settingsPanel}>
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
      <div css={jojikListViewCss.panelHeader}>
        <h2 css={jojikListViewCss.panelTitle}>새 조직 추가</h2>
        <p css={jojikListViewCss.panelSubtitle}>선택된 기관에 새로운 조직을 생성합니다.</p>
      </div>
      <form id={formId} css={jojikListViewCss.panelBody} onSubmit={handleSubmit}>
        <div css={jojikListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="조직 이름"
            placeholder="조직 이름을 입력하세요"
            value={name}
            onValueChange={setName}
            maxLength={60}
          />
        </div>
        {createMutation.isError && (
          <p css={jojikListViewCss.helperText}>
            조직 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
      </form>
      <div css={jojikListViewCss.panelFooter}>
        <Button
          type="submit"
          size="small"
          isFull
          form={formId}
          disabled={!name.trim() || isSaving}
          iconRight={<Plus />}
        >
          조직 생성
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
  jojikIntro: string;
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
        <div css={jojikListViewCss.panelHeader}>
          <h2 css={jojikListViewCss.panelTitle}>{jojikName}</h2>
          <p css={jojikListViewCss.panelSubtitle}>선택한 조직 정보를 불러오는 중입니다...</p>
        </div>
        <div css={jojikListViewCss.panelBody}>
          <p css={jojikListViewCss.helperText}>선택한 조직 정보를 불러오는 중입니다...</p>
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
      jojikIntro={effectiveIntro}
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
  jojikIntro,
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
      <div css={jojikListViewCss.panelHeader}>
        <h2 css={jojikListViewCss.panelTitle}>{jojikName} 설정</h2>
      </div>
      <div css={jojikListViewCss.panelBody}>
        <h3 css={jojikListViewCss.panelSubtitle}>조직 위젯</h3>
        <div css={jojikListViewCss.salesDiv}>
          <span>매출 관련 텍스트</span>
        </div>
        <h3 css={jojikListViewCss.panelSubtitle}>조직 속성</h3>
        <form css={jojikListViewCss.panelSection} onSubmit={handleSubmitName}>
          <Textfield
            singleLine
            required
            label="조직명"
            value={name}
            onValueChange={setName}
            helperText="30자 이내의 이름을 입력해 주세요."
            maxLength={30}
          />
          <div css={jojikListViewCss.sectionActions}>
            <Button
              type="submit"
              size="small"
              disabled={isUpdating || name.trim() === (jojikName ?? '').trim()}
            >
              저장
            </Button>
          </div>
        </form>
        <div css={jojikListViewCss.panelSection}>
          <span css={jojikListViewCss.panelLabel}>조직 식별자</span>
          <span css={jojikListViewCss.panelText}>{jojikDetailNanoId ?? jojikNanoId}</span>
        </div>
        {typeof openSangtae === 'boolean' && (
          <div css={jojikListViewCss.panelSection}>
            <span css={jojikListViewCss.panelLabel}>공개 여부</span>
            <span css={jojikListViewCss.panelText}>{openSangtae ? '공개' : '비공개'}</span>
          </div>
        )}
        {jaewonsaengLinkRequestUrl ? (
          <div css={jojikListViewCss.panelSection}>
            <span css={jojikListViewCss.panelLabel}>재원생 신청 링크</span>
            <span css={jojikListViewCss.panelText}>{jaewonsaengLinkRequestUrl}</span>
          </div>
        ) : null}
        {openFiles?.length ? (
          <div css={jojikListViewCss.panelSection}>
            <span css={jojikListViewCss.panelLabel}>공유 파일</span>
            <div css={jojikListViewCss.chipList}>
              {openFiles.map((file) => (
                <span key={file.nanoId} css={jojikListViewCss.chip}>
                  {file.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {updateMutation.isError && (
          <p css={jojikListViewCss.helperText}>
            조직 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.
          </p>
        )}
        {deleteMutation.isError && (
          <p css={jojikListViewCss.helperText}>
            조직 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.
          </p>
        )}
      </div>
      <div css={jojikListViewCss.panelFooter}>
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
  const overflowCount = Math.max(jojiks.length - displayList.length, 0);

  return (
    <>
      <div css={jojikListViewCss.panelHeader}>
        <h2 css={jojikListViewCss.panelTitle}>{jojiks.length}개의 조직이 선택되었습니다</h2>
        <p css={jojikListViewCss.panelSubtitle}>여러 조직 기능은 준비 중입니다.</p>
      </div>
      <div css={jojikListViewCss.panelBody}>
        <div css={jojikListViewCss.panelSection}>
          <span css={jojikListViewCss.panelLabel}>선택된 조직</span>
          <div css={jojikListViewCss.chipList}>
            {displayList.map((jojik) => (
              <span key={jojik.nanoId} css={jojikListViewCss.chip}>
                {jojik.name}
              </span>
            ))}
          </div>
          {overflowCount > 0 && (
            <p css={jojikListViewCss.helperText}>
              외 {overflowCount}개의 조직이 더 선택되어 있습니다.
            </p>
          )}
        </div>
        <div css={jojikListViewCss.panelSection}>
          <span css={jojikListViewCss.panelLabel}>다중 선택 기능</span>
          <p css={jojikListViewCss.panelText}>여러 조직 선택 시 기능을 준비 중입니다.</p>
        </div>
      </div>
    </>
  );
}
