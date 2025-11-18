'use client';

import { type FormEvent, useState } from 'react';

import { Button, Checkbox, Textfield } from '@/common/components';
import {
  useGetPermissionDetailQuery,
  useGetPermissionSayongjasQuery,
  useBatchlinkPermissionSayongjaMutation,
  useUpdatePermissionMutation,
} from '@/domain/permission/api';
import { useGetSayongjasQuery } from '@/domain/sayongja/api';

import { permissionListViewCss } from './styles';
import type { PermissionSettingsSectionProps } from './usePermissionListViewSections';

export function PermissionSettingsSection({
  gigwanNanoId,
  selectedPermissions,
  isAuthenticated,
  onAfterMutation,
}: PermissionSettingsSectionProps) {
  if (!gigwanNanoId) {
    return (
      <aside css={permissionListViewCss.panel}>
        <div css={permissionListViewCss.panelHeader}>
          <h2 css={permissionListViewCss.panelTitle}>기관이 선택되지 않았습니다</h2>
          <p css={permissionListViewCss.panelSubtitle}>URL의 기관 식별자를 확인해 주세요.</p>
        </div>
        <p css={permissionListViewCss.helperText}>
          기관 ID가 없으면 권한 데이터를 불러올 수 없습니다.
        </p>
      </aside>
    );
  }

  if (selectedPermissions.length === 0) {
    return (
      <aside css={permissionListViewCss.panel}>
        <div css={permissionListViewCss.panelHeader}>
          <h2 css={permissionListViewCss.panelTitle}>권한을 선택해 주세요</h2>
          <p css={permissionListViewCss.panelSubtitle}>
            왼쪽 목록에서 권한을 선택하면 상세 정보와 연결된 사용자를 확인할 수 있습니다.
          </p>
        </div>
        <p css={permissionListViewCss.helperText}>선택된 권한이 없어서 정보를 표시할 수 없습니다.</p>
      </aside>
    );
  }

  if (selectedPermissions.length > 1) {
    return (
      <aside css={permissionListViewCss.panel}>
        <div css={permissionListViewCss.panelHeader}>
          <h2 css={permissionListViewCss.panelTitle}>기능 준비중</h2>
          <p css={permissionListViewCss.panelSubtitle}>
            하나의 권한을 선택하면 상세 정보와 연결된 객체를 확인할 수 있습니다.
          </p>
        </div>
        <p css={permissionListViewCss.helperText}>
          현재는 단일 선택에서만 편집 및 연결 관리가 가능합니다.
        </p>
      </aside>
    );
  }

  return (
    <aside css={permissionListViewCss.panel}>
      <SinglePermissionPanel
        key={selectedPermissions[0].nanoId}
        nanoId={selectedPermissions[0].nanoId}
        gigwanNanoId={gigwanNanoId}
        isAuthenticated={isAuthenticated}
        onAfterMutation={onAfterMutation}
      />
    </aside>
  );
}

type SinglePermissionPanelProps = {
  nanoId: string;
  gigwanNanoId: string;
  isAuthenticated: boolean;
  onAfterMutation: () => Promise<unknown> | void;
};

function SinglePermissionPanel({
  nanoId,
  gigwanNanoId,
  isAuthenticated,
  onAfterMutation,
}: SinglePermissionPanelProps) {
  const { data: permissionDetail } = useGetPermissionDetailQuery(nanoId, {
    enabled: isAuthenticated && Boolean(nanoId),
  });
  const { data: sayongjaLinks, refetch: refetchPermissionSayongjas } =
    useGetPermissionSayongjasQuery(nanoId, {
      enabled: isAuthenticated && Boolean(nanoId),
    });
  const updateMutation = useUpdatePermissionMutation(nanoId);
  const batchlinkMutation = useBatchlinkPermissionSayongjaMutation(nanoId);

  const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
  const [addUserSelection, setAddUserSelection] = useState<Set<string>>(new Set());

  const { data: sayongjasData } = useGetSayongjasQuery(
    {
      gigwanNanoId,
      pageNumber: 1,
      pageSize: 50,
    },
    {
      enabled: isAuthenticated && Boolean(gigwanNanoId) && isAddUserPopupOpen,
    },
  );
  const availableSayongjas = sayongjasData?.sayongjas ?? [];

  const [nameInput, setNameInput] = useState<string | null>(null);

  const originalName = permissionDetail?.name ?? '';
  const currentName = nameInput ?? originalName;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = currentName.trim();
    if (!trimmed) return;

    await updateMutation.mutateAsync({ name: trimmed });

    setNameInput(null);
    await onAfterMutation();
  };

  const isSaving = updateMutation.isPending;
  const hasChanged = currentName.trim() !== originalName.trim();

  const toggleSayongjaSelection = (sayongjaNanoId: string) => {
    setAddUserSelection((prev) => {
      const next = new Set(prev);
      if (next.has(sayongjaNanoId)) {
        next.delete(sayongjaNanoId);
      } else {
        next.add(sayongjaNanoId);
      }
      return next;
    });
  };

  const clearAddUserPopup = () => {
    setIsAddUserPopupOpen(false);
    setAddUserSelection(new Set());
  };

  const handleApplyAddUsers = async () => {
    if (addUserSelection.size === 0) return;
    await batchlinkMutation.mutateAsync({
      sayongjas: Array.from(addUserSelection).map((nanoId) => ({ nanoId })),
    });
    await refetchPermissionSayongjas();
    clearAddUserPopup();
    await onAfterMutation();
  };

  return (
    <>
      <div css={permissionListViewCss.panelHeader}>
        <h2 css={permissionListViewCss.panelTitle}>권한 상세</h2>
        <p css={permissionListViewCss.panelSubtitle}>{permissionDetail?.type.name}</p>
      </div>
      <form css={permissionListViewCss.panelBody} onSubmit={handleSubmit}>
        <div css={permissionListViewCss.panelSection}>
          <Textfield
            label="권한 이름"
            value={currentName}
            onValueChange={setNameInput}
            singleLine
            required
          />
          <p css={permissionListViewCss.helperText}>
            조직: {permissionDetail?.linkJojik?.name ?? '미지정'}
          </p>
        </div>
        <div css={permissionListViewCss.panelSection}>
          <h3 css={permissionListViewCss.panelTitle}>연결 객체들</h3>
          <div>
            <span css={permissionListViewCss.tag}>사용자들</span>
          </div>
          <div css={permissionListViewCss.listBox}>
            {sayongjaLinks?.sayongjas.map((item) => (
              <div key={item.nanoId} css={permissionListViewCss.listRow}>
                {item.name} {item.employmentSangtae ? `(${item.employmentSangtae.name})` : ''}
              </div>
            ))}
            {sayongjaLinks?.sayongjas.length === 0 ? (
              <p css={permissionListViewCss.helperText}>아직 연결된 사용자가 없습니다.</p>
            ) : null}
          </div>
          <div css={permissionListViewCss.addUserContainer}>
            <Button
              styleType="outlined"
              variant="secondary"
              size="small"
              onClick={() => setIsAddUserPopupOpen((prev) => !prev)}
              aria-expanded={isAddUserPopupOpen}
            >
              사용자 추가
            </Button>
            {isAddUserPopupOpen ? (
              <div css={permissionListViewCss.addUserPopup}>
                <div css={permissionListViewCss.listBox}>
                  {availableSayongjas.map((sayongja) => {
                    const isChecked = addUserSelection.has(sayongja.nanoId);
                    const toggle = () => toggleSayongjaSelection(sayongja.nanoId);

                    return (
                      <div
                        key={sayongja.nanoId}
                        css={permissionListViewCss.listRow}
                        role="button"
                        tabIndex={0}
                        onClick={toggle}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            toggle();
                          }
                        }}
                      >
                        <Checkbox
                          checked={isChecked}
                          onChange={(event) => {
                            event.stopPropagation();
                            toggle();
                          }}
                          onClick={(event) => event.stopPropagation()}
                          ariaLabel={`${sayongja.name} 선택`}
                        />
                        <span>
                          {sayongja.name}
                          {sayongja.employedAt ? ` · ${sayongja.employedAt}` : ''}
                        </span>
                      </div>
                    );
                  })}
                  {availableSayongjas.length === 0 ? (
                    <p css={permissionListViewCss.helperText}>추가할 사용자를 찾지 못했습니다.</p>
                  ) : null}
                </div>
                <div css={permissionListViewCss.popupActions}>
                  <Button
                    styleType="solid"
                    variant="secondary"
                    size="small"
                    onClick={clearAddUserPopup}
                  >
                    취소
                  </Button>
                  <Button
                    size="small"
                    onClick={handleApplyAddUsers}
                    disabled={addUserSelection.size === 0 || batchlinkMutation.isPending}
                  >
                    추가
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div css={permissionListViewCss.panelFooter}>
          <Button type="submit" disabled={isSaving || !hasChanged}>
            저장
          </Button>
        </div>
      </form>
    </>
  );
}
