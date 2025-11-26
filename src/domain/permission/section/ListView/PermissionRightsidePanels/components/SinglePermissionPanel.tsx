import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { Button, Checkbox, Textfield } from '@/common/components';
import {
  useBatchlinkPermissionSayongjaMutation,
  useGetPermissionDetailQuery,
  useGetPermissionSayongjasQuery,
  useUpdatePermissionMutation,
} from '@/domain/permission/api';
import { useGetSayongjasQuery } from '@/domain/sayongja/api';

import { cssObj } from '../../styles';

export type SinglePermissionPanelProps = {
  nanoId: string;
  gigwanNanoId: string;
  isAuthenticated: boolean;
  onAfterMutation: () => Promise<unknown> | void;
};

export function SinglePermissionPanel({
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
  const [activeLinkedTab, setActiveLinkedTab] = useState('users');

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

  const linkedObjectTabs = useMemo(
    () => [
      {
        key: 'users',
        label: '사용자들',
        content: (
          <>
            <div>
              <span css={cssObj.tag}>사용자들</span>
            </div>
            <div css={cssObj.listBox}>
              {sayongjaLinks?.sayongjas.map((item) => (
                <div key={item.nanoId} css={cssObj.listRow}>
                  {item.name} {item.employmentSangtae ? `(${item.employmentSangtae.name})` : ''}
                </div>
              ))}
              {sayongjaLinks?.sayongjas.length === 0 ? (
                <p css={cssObj.helperText}>아직 연결된 사용자가 없습니다.</p>
              ) : null}
            </div>
            <div css={cssObj.addUserContainer}>
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
                <div css={cssObj.addUserPopup}>
                  <div css={cssObj.listBox}>
                    {availableSayongjas.map((sayongja) => {
                      const isChecked = addUserSelection.has(sayongja.nanoId);
                      const toggle = () => toggleSayongjaSelection(sayongja.nanoId);

                      return (
                        <div
                          key={sayongja.nanoId}
                          css={cssObj.listRow}
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
                      <p css={cssObj.helperText}>추가할 사용자를 찾지 못했습니다.</p>
                    ) : null}
                  </div>
                  <div css={cssObj.popupActions}>
                    <Button
                      styleType="solid"
                      variant="secondary"
                      size="small"
                      onClick={handleApplyAddUsers}
                      disabled={addUserSelection.size === 0 || batchlinkMutation.isPending}
                    >
                      적용
                    </Button>
                    <Button
                      styleType="outlined"
                      variant="assistive"
                      size="small"
                      onClick={clearAddUserPopup}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ),
      },
    ],
    [
      addUserSelection,
      availableSayongjas,
      batchlinkMutation.isPending,
      clearAddUserPopup,
      handleApplyAddUsers,
      isAddUserPopupOpen,
      toggleSayongjaSelection,
      sayongjaLinks?.sayongjas,
    ],
  );

  useEffect(() => {
    if (!linkedObjectTabs.find((tab) => tab.key === activeLinkedTab)) {
      setActiveLinkedTab(linkedObjectTabs[0]?.key ?? '');
    }
  }, [activeLinkedTab, linkedObjectTabs]);

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{currentName} 설정</h2>
      </div>
      <form css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelSubtitle}>사용자 속성</h3>
          <Textfield
            label="권한 이름"
            value={currentName}
            onValueChange={setNameInput}
            singleLine
            helperText="30자 이내의 권한 이름을 입력해 주세요."
          />
        </div>
        <div css={cssObj.panelSection}>
          <h3 css={cssObj.panelTitle}>연결 객체들</h3>
          <div css={cssObj.linkedNav}>
            {linkedObjectTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                css={[
                  cssObj.linkedNavButton,
                  tab.key === activeLinkedTab ? cssObj.linkedNavButtonActive : null,
                ]}
                onClick={() => setActiveLinkedTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div css={cssObj.linkedContent}>
            {linkedObjectTabs.find((tab) => tab.key === activeLinkedTab)?.content ?? (
              <p css={cssObj.helperText}>연결된 객체가 없습니다.</p>
            )}
          </div>
        </div>
        <div css={cssObj.panelFooter}>
          <Button type="submit" disabled={isSaving || !hasChanged}>
            저장
          </Button>
        </div>
      </form>
    </>
  );
}
