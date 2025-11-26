import React, { FormEvent, useMemo, useState } from 'react';

import { Button, Textfield } from '@/common/components';
import { LicenseIcon } from '@/common/icons';
import type {
  HomepageLink,
  JojikPermission,
  UpdateJojikRequest,
} from '@/domain/jojik/api/jojik.schema';
import type { UpdateJojikMutationResult, DeleteJojikMutationResult } from '../types';

import { cssObj } from '../../styles';

type SingleSelectionPanelContentProps = {
  jojikNanoId: string;
  jojikDetailNanoId?: string;
  jaewonsaengLinkRequestUrl?: string;
  openSangtae?: boolean;
  openFiles?: { nanoId: string; name: string }[];
  jojikName: string;
  homepageUrl?: HomepageLink | null;
  permissions?: JojikPermission[];
  onAfterMutation: () => Promise<unknown> | void;
  updateMutation: UpdateJojikMutationResult;
  deleteMutation: DeleteJojikMutationResult;
};

export function SingleSelectionPanelContent({
  jojikName,
  homepageUrl,
  permissions,
  onAfterMutation,
  updateMutation,
  deleteMutation,
}: SingleSelectionPanelContentProps) {
  const [name, setName] = useState(jojikName);
  const [homepage, setHomepage] = useState(homepageUrl?.linkUrl ?? '');
  const isUpdating = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const initialHomepageUrl = useMemo(() => homepageUrl?.linkUrl ?? '', [homepageUrl?.linkUrl]);

  const handleSubmitName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedHomepage = homepage.trim();
    const hasNameChange = trimmedName && trimmedName !== (jojikName ?? '').trim();
    const hasHomepageChange = trimmedHomepage !== initialHomepageUrl.trim();

    if (!hasNameChange && !hasHomepageChange) {
      return;
    }

    const payload: UpdateJojikRequest = {};

    if (hasNameChange) {
      payload.name = trimmedName;
    }

    if (hasHomepageChange) {
      payload.homepageUrl = trimmedHomepage || null;
    }

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
        <form onSubmit={handleSubmitName}>
          <div css={cssObj.panelSection}>
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
          </div>

          <div css={cssObj.panelSection}>
            <h3 css={cssObj.panelSubtitle}>조직 홈페이지</h3>
            <Textfield singleLine value={homepage} onValueChange={setHomepage} placeholder="-" />
            <div css={cssObj.sectionActions}>
              <Button
                type="submit"
                size="small"
                disabled={isUpdating || homepage.trim() === initialHomepageUrl.trim()}
              >
                저장
              </Button>
            </div>
          </div>
        </form>

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
                  <LicenseIcon />
                  <span css={cssObj.permissionName}>{permission.name}</span>
                </div>
                <span css={cssObj.permissionRole}>{permission.sysPermissionType}</span>
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
