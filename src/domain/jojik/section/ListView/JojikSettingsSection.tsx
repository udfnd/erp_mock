import type { ReactNode, FormEvent } from 'react';
import { useState } from 'react';

import { Button, Textfield } from '@/common/components';
import {
  useCreateJojikMutation,
  useDeleteJojikMutation,
  useJojikQuery,
  useUpdateJojikMutation,
  useJojikPermissionsQuery,
} from '@/domain/jojik/api';
import type {
  JojikListItem,
  UpdateJojikRequest,
  JojikPermission,
  HomepageLink,
} from '@/domain/jojik/api/jojik.schema';
import { License, Magic, Plus } from '@/common/icons'; // TODO: [하] 뒤에 LicenseIcon 붙이는 것을 추천

import { cssObj } from './styles';
import type { JojikSettingsPanels, JojikSettingsSectionProps } from './useJojikListViewSections';

export function createJojikSettingsPanels({
  gigwanNanoId,
  selectedJojiks,
  isCreating,
  onStartCreate,
  onExitCreate,
  onAfterMutation,
  isAuthenticated,
}: JojikSettingsSectionProps): JojikSettingsPanels {
  if (!gigwanNanoId) {
    const panel = (
      <SettingsPanelContainer>
        <MissingGigwanPanel />
      </SettingsPanelContainer>
    );

    return { noneSelected: panel, oneSelected: panel, multipleSelected: panel };
  }

  if (isCreating) {
    const creatingPanel = (
      <SettingsPanelContainer>
        <CreateJojikPanel
          gigwanNanoId={gigwanNanoId}
          onExit={onExitCreate}
          onAfterMutation={onAfterMutation}
        />
      </SettingsPanelContainer>
    );

    return {
      noneSelected: creatingPanel,
      oneSelected: creatingPanel,
      multipleSelected: creatingPanel,
    };
  }

  const noneSelectedPanel = (
    <SettingsPanelContainer>
      <QuickActionsPanel onStartCreate={onStartCreate} />
    </SettingsPanelContainer>
  );

  const [primarySelectedJojik] = selectedJojiks;

  const singleSelectedPanel = primarySelectedJojik ? (
    <SettingsPanelContainer>
      <SingleSelectionPanel
        jojikNanoId={primarySelectedJojik.nanoId}
        jojikName={primarySelectedJojik.name}
        onAfterMutation={onAfterMutation}
        isAuthenticated={isAuthenticated}
      />
    </SettingsPanelContainer>
  ) : (
    noneSelectedPanel
  );

  const multipleSelectedPanel = (
    <SettingsPanelContainer>
      <MultiSelectionPanel jojiks={selectedJojiks} />
    </SettingsPanelContainer>
  );

  return {
    noneSelected: noneSelectedPanel,
    oneSelected: singleSelectedPanel,
    multipleSelected: multipleSelectedPanel,
  };
}

function SettingsPanelContainer({ children }: { children: ReactNode }) {
  return <aside css={cssObj.settingsPanel}>{children}</aside>;
}

function MissingGigwanPanel() {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>기관이 선택되지 않았습니다</h2>
        <p css={cssObj.panelSubtitle}>URL의 기관 식별자를 확인해 주세요.</p>
      </div>
      <div css={cssObj.panelBody}>
        <p css={cssObj.helperText}>기관 ID가 없으면 조직 데이터를 불러올 수 없습니다.</p>
      </div>
    </>
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

type QuickActionsPanelProps = {
  onStartCreate: () => void;
};

function QuickActionsPanel({ onStartCreate }: QuickActionsPanelProps) {
  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>조직들 설정</h2>
      </div>
      <div css={cssObj.panelBody}>
        <span css={cssObj.panelSubtitle}>빠른 액션</span>
        <div>
          <Button variant="secondary" size="medium" iconLeft={<Magic />} onClick={onStartCreate}>
            조직 생성 마법사
          </Button>
        </div>
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
  homepageUrl?: HomepageLink | null;
  permissions?: JojikPermission[];
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

  const { data: jojikPermissionsDetail } = useJojikPermissionsQuery(jojikNanoId, {
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

  return (
    <SingleSelectionPanelContent
      key={`${jojikNanoId}:${effectiveName}`}
      jojikNanoId={jojikNanoId}
      jojikName={effectiveName}
      jojikDetailNanoId={jojikDetail?.nanoId ?? jojikNanoId}
      jaewonsaengLinkRequestUrl={jojikDetail?.jaewonsaengLinkRequestUrl}
      openSangtae={jojikDetail?.openSangtae}
      openFiles={jojikDetail?.openFiles}
      homepageUrl={jojikDetail?.homepageUrl}
      permissions={jojikPermissionsDetail?.permissions}
      onAfterMutation={onAfterMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}

function SingleSelectionPanelContent({
  jojikName,
  homepageUrl,
  permissions,
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
        <form css={cssObj.panelSection} onSubmit={handleSubmitName}>
          <h3 css={cssObj.panelSubtitle}>조직 속성</h3>
          <Textfield
            singleLine
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
          <h3 css={cssObj.panelSubtitle}>조직 홈페이지</h3>
          {homepageUrl ? (
            <div css={cssObj.homepageInfo}>
              <span css={cssObj.panelText}>{homepageUrl.titleName}</span>
              <a
                css={cssObj.homepageLink}
                href={homepageUrl.linkUrl}
                target="_blank"
                rel="noreferrer"
              >
                {homepageUrl.linkUrl}
              </a>
            </div>
          ) : (
            <span css={cssObj.panelText}>등록된 홈페이지 정보가 없습니다.</span>
          )}
        </div>

        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>조직 권한</h3>
          {permissions === undefined ? (
            <span css={cssObj.panelText}>조직 권한 정보를 불러오는 중입니다...</span>
          ) : permissions.length === 0 ? (
            <span css={cssObj.panelText}>설정된 권한이 없습니다.</span>
          ) : (
            permissions.map((permission) => (
              <div key={permission.nanoId} css={cssObj.permissionItem}>
                <div>
                  <License />
                  {permission.name}
                </div>
                <span>{permission.sysPermissionType}</span>
              </div>
            ))
          )}
        </div>

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
          조직 삭제
        </Button>
      </div>
    </>
  );
}

type MultiSelectionPanelProps = {
  jojiks: JojikListItem[];
};

function MultiSelectionPanel({ jojiks }: MultiSelectionPanelProps) {
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
