import { createPortal } from 'react-dom';
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  const [addUserSearch, setAddUserSearch] = useState('');
  const [hideLinkedUsers, setHideLinkedUsers] = useState(false);
  const [addUserSortDirection, setAddUserSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeLinkedTab, setActiveLinkedTab] = useState('users');
  const addUserAnchorRef = useRef<HTMLDivElement>(null);
  const [addUserPopupPosition, setAddUserPopupPosition] = useState<{ top: number; left: number } | null>(null);

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
  const availableSayongjas = useMemo(
    () => sayongjasData?.sayongjas ?? [],
    [sayongjasData?.sayongjas],
  );

  const linkedSayongjaIds = useMemo(
    () => new Set(sayongjaLinks?.sayongjas.map((item) => item.nanoId)),
    [sayongjaLinks?.sayongjas],
  );

  const filteredSayongjas = useMemo(() => {
    const search = addUserSearch.trim().toLowerCase();

    const list = availableSayongjas
      .filter((sayongja) => (hideLinkedUsers ? !linkedSayongjaIds.has(sayongja.nanoId) : true))
      .filter((sayongja) =>
        search
          ? `${sayongja.name}${sayongja.employedAt ?? ''}`.toLowerCase().includes(search)
          : true,
      )
      .sort((a, b) => {
        const compared = a.name.localeCompare(b.name, 'ko');
        return addUserSortDirection === 'asc' ? compared : -compared;
      });

    return list;
  }, [addUserSearch, addUserSortDirection, availableSayongjas, hideLinkedUsers, linkedSayongjaIds]);

  const selectedSayongjas = useMemo(
    () => availableSayongjas.filter((sayongja) => addUserSelection.has(sayongja.nanoId)),
    [addUserSelection, availableSayongjas],
  );

  useEffect(() => {
    if (!isAddUserPopupOpen) {
      return;
    }

    const updatePosition = () => {
      const anchor = addUserAnchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const left = rect.left + window.scrollX - 12 - 320;
      const top = rect.top + window.scrollY;

      setAddUserPopupPosition({ left, top });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isAddUserPopupOpen]);

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

  const toggleSayongjaSelection = useCallback((sayongjaNanoId: string) => {
    setAddUserSelection((prev) => {
      const next = new Set(prev);
      if (next.has(sayongjaNanoId)) {
        next.delete(sayongjaNanoId);
      } else {
        next.add(sayongjaNanoId);
      }
      return next;
    });
  }, []);

  const closeAddUserPopup = useCallback(() => {
    setIsAddUserPopupOpen(false);
    setAddUserPopupPosition(null);
  }, []);

  const clearAddUserPopup = useCallback(() => {
    closeAddUserPopup();
    setAddUserSelection(new Set());
  }, [closeAddUserPopup]);

  const toggleAddUserPopup = useCallback(() => {
    setIsAddUserPopupOpen((prev) => {
      const next = !prev;

      if (!next) {
        setAddUserPopupPosition(null);
      }

      return next;
    });
  }, []);

  const handleApplyAddUsers = useCallback(async () => {
    if (addUserSelection.size === 0) return;
    await batchlinkMutation.mutateAsync({
      sayongjas: Array.from(addUserSelection).map((nanoId) => ({ nanoId })),
    });
    await refetchPermissionSayongjas();
    clearAddUserPopup();
    await onAfterMutation();
  }, [addUserSelection, batchlinkMutation, clearAddUserPopup, onAfterMutation, refetchPermissionSayongjas]);

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
              <div css={cssObj.addUserContainer} ref={addUserAnchorRef}>
                <Button
                  styleType="outlined"
                  variant="secondary"
                  size="small"
                  onClick={toggleAddUserPopup}
                  aria-expanded={isAddUserPopupOpen}
                >
                  사용자 추가
                </Button>
                {isAddUserPopupOpen && addUserPopupPosition
                  ? createPortal(
                      <div css={cssObj.addUserPopup} style={addUserPopupPosition}>
                        <div css={cssObj.addUserPopupHeader}>
                          <Textfield
                            singleLine
                            placeholder="사용자 검색"
                            value={addUserSearch}
                            onValueChange={setAddUserSearch}
                          />
                        </div>

                        <div css={cssObj.addUserPopupToolbar}>
                          <Button
                            styleType="outlined"
                            variant="assistive"
                            size="small"
                            onClick={() => setHideLinkedUsers((prev) => !prev)}
                          >
                            {hideLinkedUsers ? '연결 안 된 사용자만 보기' : '모든 사용자 보기'}
                          </Button>
                          <Button
                            styleType="ghost"
                            variant="secondary"
                            size="small"
                            onClick={() =>
                              setAddUserSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                            }
                          >
                            정렬: {addUserSortDirection === 'asc' ? '이름 오름차순' : '이름 내림차순'}
                          </Button>
                        </div>

                        <div css={cssObj.addUserPopupContent}>
                          <div css={cssObj.addUserListSection}>
                            <label css={cssObj.panelLabel}>검색 결과</label>
                            <div css={cssObj.listBox}>
                              {filteredSayongjas.map((sayongja) => {
                                const isChecked = addUserSelection.has(sayongja.nanoId);
                                const toggle = () => toggleSayongjaSelection(sayongja.nanoId);
                                const isLinked = linkedSayongjaIds.has(sayongja.nanoId);

                                return (
                                  <div
                                    key={sayongja.nanoId}
                                    css={[
                                      cssObj.listRow,
                                      isChecked ? cssObj.addUserRowSelected : null,
                                    ]}
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
                                    <div css={cssObj.addUserRowContent}>
                                      <span>{sayongja.name}</span>
                                      <span css={cssObj.addUserRowMeta}>
                                        {sayongja.employedAt ? `입사일 ${sayongja.employedAt}` : '입사일 없음'}
                                      </span>
                                    </div>
                                    {isLinked ? <span css={cssObj.permissionLinkedBadge}>연결됨</span> : null}
                                  </div>
                                );
                              })}
                              {filteredSayongjas.length === 0 ? (
                                <p css={cssObj.helperText}>조건에 맞는 사용자를 찾지 못했습니다.</p>
                              ) : null}
                            </div>
                          </div>

                          <div css={cssObj.addUserSelectedSection}>
                            <label css={cssObj.panelLabel}>선택된 사용자들</label>
                            <div css={cssObj.permissionSelectedList}>
                              {selectedSayongjas.length ? (
                                selectedSayongjas.map((sayongja) => (
                                  <span key={sayongja.nanoId} css={cssObj.permissionSelectedItem}>
                                    {sayongja.name}
                                  </span>
                                ))
                              ) : (
                                <p css={cssObj.helperText}>선택된 사용자가 없습니다.</p>
                              )}
                            </div>
                          </div>
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
                      </div>,
                      document.body,
                    )
                  : null}
            </div>
          </>
        ),
      },
    ],
      [
        addUserSelection,
        addUserSearch,
        addUserSortDirection,
        availableSayongjas,
        batchlinkMutation.isPending,
        addUserPopupPosition,
        clearAddUserPopup,
        filteredSayongjas,
        handleApplyAddUsers,
        hideLinkedUsers,
        isAddUserPopupOpen,
        linkedSayongjaIds,
        selectedSayongjas,
        toggleAddUserPopup,
        toggleSayongjaSelection,
        sayongjaLinks?.sayongjas,
    ],
  );

  const resolvedActiveLinkedTab = useMemo(() => {
    const hasActiveTab = linkedObjectTabs.some((tab) => tab.key === activeLinkedTab);

    return hasActiveTab ? activeLinkedTab : (linkedObjectTabs[0]?.key ?? '');
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
                  tab.key === resolvedActiveLinkedTab ? cssObj.linkedNavButtonActive : null,
                ]}
                onClick={() => setActiveLinkedTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div css={cssObj.linkedContent}>
            {linkedObjectTabs.find((tab) => tab.key === resolvedActiveLinkedTab)?.content ?? (
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
