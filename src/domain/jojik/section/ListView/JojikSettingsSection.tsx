'use client';

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

export function JojikSettingsSection({
  gigwanNanoId,
  selectedJojiks,
  isCreating,
  onStartCreate,
  onExitCreate,
  onAfterMutation,
  onClearSelection,
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
          <p css={jojikListViewCss.helperText}>기관 ID가 없으면 조직 데이터를 불러올 수 없습니다.</p>
        </div>
      </aside>
    );
  }

  if (isCreating) {
    return (
      <aside css={jojikListViewCss.settingsPanel}>
        <CreateJojikPanel gigwanNanoId={gigwanNanoId} onExit={onExitCreate} onAfterMutation={onAfterMutation} />
      </aside>
    );
  }

  if (selectedJojiks.length === 0) {
    return (
      <aside css={jojikListViewCss.settingsPanel}>
        <EmptyStatePanel onStartCreate={onStartCreate} />
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
          onClearSelection={onClearSelection}
          isAuthenticated={isAuthenticated}
        />
      </aside>
    );
  }

  return (
    <aside css={jojikListViewCss.settingsPanel}>
      <MultiSelectionPanel
        jojiks={selectedJojiks}
        onStartCreate={onStartCreate}
        onClearSelection={onClearSelection}
      />
    </aside>
  );
}

type EmptyStatePanelProps = {
  onStartCreate: () => void;
};

function EmptyStatePanel({ onStartCreate }: EmptyStatePanelProps) {
  return (
    <>
      <div css={jojikListViewCss.panelHeader}>
        <h2 css={jojikListViewCss.panelTitle}>조직을 선택하거나 생성해 보세요</h2>
        <p css={jojikListViewCss.panelSubtitle}>
          좌측 목록에서 조직을 선택하거나 새로운 조직을 생성할 수 있습니다.
        </p>
      </div>
      <div css={jojikListViewCss.panelBody}>
        <div css={jojikListViewCss.panelSection}>
          <span css={jojikListViewCss.panelLabel}>빠른 시작</span>
          <p css={jojikListViewCss.panelText}>
            목록에서 행을 클릭하면 해당 조직이 선택되고, 상세 설정 패널이 자동으로 열립니다.
          </p>
        </div>
        <div css={jojikListViewCss.panelSection}>
          <span css={jojikListViewCss.panelLabel}>조직 관리 팁</span>
          <p css={jojikListViewCss.panelText}>
            검색과 필터 기능을 함께 사용하면 수백 개의 조직 중에서도 원하는 데이터를 빠르게 찾을 수 있습니다.
          </p>
        </div>
      </div>
      <div css={jojikListViewCss.panelFooter}>
        <Button variant="primary" onClick={onStartCreate}>
          새 조직 추가
        </Button>
      </div>
    </>
  );
}

type CreateJojikPanelProps = {
  gigwanNanoId: string;
  onExit: () => void;
  onAfterMutation: () => Promise<unknown> | void;
};

function CreateJojikPanel({ gigwanNanoId, onExit, onAfterMutation }: CreateJojikPanelProps) {
  const createMutation = useCreateJojikMutation();
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');

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
    setIntro('');
    onAfterMutation();
    onExit();
  };

  return (
    <>
      <div css={jojikListViewCss.panelHeader}>
        <h2 css={jojikListViewCss.panelTitle}>새 조직 추가</h2>
        <p css={jojikListViewCss.panelSubtitle}>기관에 속한 새로운 조직을 생성합니다.</p>
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
        <div css={jojikListViewCss.panelSection}>
          <Textfield
            label="조직 소개"
            placeholder="간단한 소개를 작성하세요 (선택)"
            value={intro}
            onValueChange={setIntro}
            maxLength={500}
          />
        </div>
        {createMutation.isError && (
          <p css={jojikListViewCss.helperText}>
            조직 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
      </form>
      <div css={jojikListViewCss.panelFooter}>
        <Button styleType="text" variant="secondary" onClick={onExit} disabled={isSaving}>
          취소
        </Button>
        <Button type="submit" form={formId} disabled={!name.trim() || isSaving}>
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
  onClearSelection: () => void;
  isAuthenticated: boolean;
};

type UpdateJojikMutationResult = ReturnType<typeof useUpdateJojikMutation>;
type DeleteJojikMutationResult = ReturnType<typeof useDeleteJojikMutation>;

type SingleSelectionPanelContentProps = {
  jojikNanoId: string;
  jojikName: string;
  jojikIntro: string;
  jojikDetailNanoId?: string;
  openFiles?: { nanoId: string; name: string }[];
  onAfterMutation: () => Promise<unknown> | void;
  onClearSelection: () => void;
  updateMutation: UpdateJojikMutationResult;
  deleteMutation: DeleteJojikMutationResult;
};

function SingleSelectionPanel({
  jojikNanoId,
  jojikName,
  onAfterMutation,
  onClearSelection,
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
      openFiles={jojikDetail?.openFiles}
      onAfterMutation={onAfterMutation}
      onClearSelection={onClearSelection}
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
  openFiles,
  onAfterMutation,
  onClearSelection,
  updateMutation,
  deleteMutation,
}: SingleSelectionPanelContentProps) {
  const [name, setName] = useState(jojikName);
  const [intro, setIntro] = useState(jojikIntro);
  const isUpdating = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const formId = `jojik-update-form-${jojikNanoId}`;

  const hasChanges =
    name.trim() !== (jojikName ?? '')?.trim() || intro.trim() !== (jojikIntro ?? '')?.trim();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    const payload: UpdateJojikRequest = {
      name: trimmedName,
      intro: intro.trim(),
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
        <h2 css={jojikListViewCss.panelTitle}>{jojikName}</h2>
        <p css={jojikListViewCss.panelSubtitle}>조직 정보를 수정하거나 삭제할 수 있습니다.</p>
      </div>
      <form id={formId} css={jojikListViewCss.panelBody} onSubmit={handleSubmit}>
        <div css={jojikListViewCss.panelSection}>
          <Textfield
            singleLine
            required
            label="조직 이름"
            value={name}
            onValueChange={setName}
            maxLength={60}
          />
        </div>
        <div css={jojikListViewCss.panelSection}>
          <Textfield label="조직 소개" value={intro} onValueChange={setIntro} maxLength={500} />
        </div>
        <div css={jojikListViewCss.panelSection}>
          <span css={jojikListViewCss.panelLabel}>조직 식별자</span>
          <span css={jojikListViewCss.panelText}>{jojikDetailNanoId ?? jojikNanoId}</span>
        </div>
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
          <p css={jojikListViewCss.helperText}>조직 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}
        {deleteMutation.isError && (
          <p css={jojikListViewCss.helperText}>조직 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}
      </form>
      <div css={jojikListViewCss.panelFooter}>
        <Button
          styleType="text"
          variant="secondary"
          onClick={onClearSelection}
          disabled={isUpdating || isDeleting}
        >
          선택 해제
        </Button>
        <Button
          styleType="outlined"
          variant="secondary"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          삭제
        </Button>
        <Button type="submit" form={formId} disabled={isUpdating || !hasChanges}>
          변경 사항 저장
        </Button>
      </div>
    </>
  );
}

type MultiSelectionPanelProps = {
  jojiks: JojikListItem[];
  onStartCreate: () => void;
  onClearSelection: () => void;
};

function MultiSelectionPanel({ jojiks, onStartCreate, onClearSelection }: MultiSelectionPanelProps) {
  const displayList = useMemo(() => jojiks.slice(0, 6), [jojiks]);
  const overflowCount = Math.max(jojiks.length - displayList.length, 0);

  return (
    <>
      <div css={jojikListViewCss.panelHeader}>
        <h2 css={jojikListViewCss.panelTitle}>{jojiks.length}개의 조직이 선택되었습니다</h2>
        <p css={jojikListViewCss.panelSubtitle}>선택된 조직에 일괄 작업을 적용할 준비가 되었습니다.</p>
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
            <p css={jojikListViewCss.helperText}>외 {overflowCount}개의 조직이 더 선택되어 있습니다.</p>
          )}
        </div>
        <div css={jojikListViewCss.panelSection}>
          <span css={jojikListViewCss.panelLabel}>일괄 작업 아이디어</span>
          <p css={jojikListViewCss.panelText}>
            일괄 태그 지정, 접근 권한 조정, 일괄 삭제 등 다양한 작업을 이 패널에서 구현할 수 있습니다.
          </p>
        </div>
      </div>
      <div css={jojikListViewCss.panelFooter}>
        <Button styleType="text" variant="secondary" onClick={onStartCreate}>
          새 조직 추가
        </Button>
        <Button styleType="outlined" variant="secondary" onClick={onClearSelection}>
          선택 해제
        </Button>
      </div>
    </>
  );
}
