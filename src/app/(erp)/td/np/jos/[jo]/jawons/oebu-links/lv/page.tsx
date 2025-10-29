'use client';

import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import {
  type CreateOebuLinkRequest,
  type OebuLinkListItem,
  type UpdateOebuLinkRequest,
  useCreateOebuLinkMutation,
  useDeleteOebuLinkMutation,
  useGetOebuLinkDetailQuery,
  useGetOebuLinksQuery,
  useUpdateOebuLinkMutation,
} from '@/api/oebu-link';
import {
  ListViewLayout,
  ListViewPagination,
  ListViewTable,
  type ListViewColumn,
} from '@/app/(erp)/_components/list-view';
import LabeledInput from '@/app/(erp)/td/g/_components/LabeledInput';
import { Search as SearchIcon } from '@/components/icons';
import { Button, Textfield } from '@/design';

import * as styles from './page.style.css';

const PAGE_SIZE = 10;

type PageProps = {
  params: {
    jo: string;
  };
};

type PanelMode = 'idle' | 'detail' | 'edit' | 'create';

type OebuLinkFormState = Pick<
  CreateOebuLinkRequest,
  'name' | 'asName' | 'linkUrl' | 'linkIconNanoId'
>;

type OebuLinkRequestPayload = Omit<CreateOebuLinkRequest, 'gigwanNanoId'>;

const initialFormState: OebuLinkFormState = {
  name: '',
  asName: '',
  linkUrl: '',
  linkIconNanoId: '',
};

export default function JoResourceExternalLinksPage({ params }: PageProps) {
  const queryClient = useQueryClient();
  const gigwanNanoId = params.jo;

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('idle');
  const [formState, setFormState] = useState<OebuLinkFormState>(initialFormState);

  const { data: oebuLinkListData, isLoading: isListLoading } = useGetOebuLinksQuery();
  const { data: oebuLinkDetailData, isFetching: isDetailLoading } = useGetOebuLinkDetailQuery(
    selectedRowId ?? '',
    {
      enabled: panelMode !== 'create' && Boolean(selectedRowId),
    },
  );

  const createMutation = useCreateOebuLinkMutation();
  const updateMutation = useUpdateOebuLinkMutation(selectedRowId ?? '');
  const deleteMutation = useDeleteOebuLinkMutation(selectedRowId ?? '');

  const oebuLinks = useMemo<OebuLinkListItem[]>(
    () => oebuLinkListData?.oebuLinks ?? [],
    [oebuLinkListData],
  );

  const filteredLinks = useMemo(() => {
    if (!searchTerm.trim()) return oebuLinks;
    const lowered = searchTerm.trim().toLowerCase();
    return oebuLinks.filter((item) =>
      [item.name, item.asName, item.linkUrl]
        .join(' ')
        .toLowerCase()
        .includes(lowered),
    );
  }, [oebuLinks, searchTerm]);

  const totalItems = filteredLinks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(
    () =>
      filteredLinks.slice(
        (safeCurrentPage - 1) * PAGE_SIZE,
        (safeCurrentPage - 1) * PAGE_SIZE + PAGE_SIZE,
      ),
    [filteredLinks, safeCurrentPage],
  );

  const columns = useMemo<ListViewColumn<OebuLinkListItem>[]>(
    () => [
      {
        id: 'name',
        header: '외부 링크',
        render: (row) => (
          <div className={styles.linkCell}>
            <div className={styles.linkIconWrapper}>
              {row.linkIcon ? (
                <Image
                  src={row.linkIcon}
                  alt={`${row.name} 아이콘`}
                  fill
                  sizes="36px"
                  className={styles.linkIcon}
                  unoptimized
                />
              ) : (
                <span className={styles.linkIconPlaceholder}>
                  {row.name?.[0]?.toUpperCase() ?? '?'}
                </span>
              )}
            </div>
            <div className={styles.linkInfo}>
              <span className={styles.linkName}>{row.name}</span>
              <span className={styles.linkAlias}>{row.asName}</span>
            </div>
          </div>
        ),
      },
      {
        id: 'linkUrl',
        header: '링크 주소',
        render: (row) => (
          <a href={row.linkUrl} target="_blank" rel="noreferrer" className={styles.linkUrl}>
            {row.linkUrl}
          </a>
        ),
      },
      {
        id: 'createdBy',
        header: '등록자',
        render: (row) => row.createdBy || <span className={styles.cellMuted}>알 수 없음</span>,
      },
      {
        id: 'createdAt',
        header: '등록일',
        render: (row) => formatDateTime(row.createdAt),
      },
    ],
    [],
  );

  const handleSelectionChange = (ids: string[]) => {
    const lastId = ids.at(-1) ?? null;
    setSelectedRowId(lastId);
    if (lastId) {
      setPanelMode('detail');
    } else {
      setPanelMode('idle');
    }
  };

  const handleOpenCreate = () => {
    setPanelMode('create');
    setSelectedRowId(null);
    setFormState(initialFormState);
  };

  const handleStartEdit = () => {
    if (!oebuLinkDetailData) return;
    setFormState({
      name: oebuLinkDetailData.name,
      asName: oebuLinkDetailData.asName,
      linkUrl: oebuLinkDetailData.linkUrl,
      linkIconNanoId: oebuLinkDetailData.linkIcon,
    });
    setPanelMode('edit');
  };

  const handleSubmitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildCreatePayload(formState, gigwanNanoId);
    if (!payload) return;
    try {
      const result = await createMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: ['oebuLinks'] });
      setSelectedRowId(result.nanoId);
      setPanelMode('detail');
    } catch (error) {
      console.error(error);
      window.alert('외부 링크 등록에 실패했습니다. 입력값을 확인해주세요.');
    }
  };

  const handleSubmitUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRowId) return;
    const payload = buildUpdatePayload(formState);
    if (!payload) return;
    try {
      await updateMutation.mutateAsync(payload);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['oebuLinks'] }),
        queryClient.invalidateQueries({ queryKey: ['oebuLink', selectedRowId] }),
      ]);
      setPanelMode('detail');
    } catch (error) {
      console.error(error);
      window.alert('외부 링크 정보를 수정하지 못했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async () => {
    if (!selectedRowId) return;
    const confirmed = window.confirm(
      '선택한 외부 링크를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.',
    );
    if (!confirmed) return;
    try {
      await deleteMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: ['oebuLinks'] });
      setSelectedRowId(null);
      setPanelMode('idle');
      setFormState(initialFormState);
    } catch (error) {
      console.error(error);
      window.alert('외부 링크 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const sidePanelContent = (() => {
    if (panelMode === 'create') {
      return (
        <form className={styles.sidePanel.form} onSubmit={handleSubmitCreate}>
          <div className={styles.sidePanel.section}>
            <div className={styles.sidePanel.sectionHeader}>
              <span className={styles.sidePanel.sectionTitle}>외부 링크 정보 입력</span>
              <span className={styles.sidePanel.sectionDescription}>
                업무에 필요한 외부 서비스를 연결할 수 있도록 링크 정보를 등록하세요.
              </span>
            </div>
            <div className={styles.sidePanel.formGroup}>
              <LabeledInput
                label="링크 이름"
                placeholder="예: 구글 드라이브"
                required
                value={formState.name}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, name: value }))}
              />
              <LabeledInput
                label="표시 이름"
                placeholder="예: 자료실"
                required
                value={formState.asName}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, asName: value }))}
              />
              <LabeledInput
                label="링크 주소"
                type="url"
                placeholder="https://example.com"
                required
                value={formState.linkUrl}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, linkUrl: value }))}
              />
              <Textfield
                label="아이콘 ID"
                placeholder="아이콘 식별자를 입력하세요"
                rows={2}
                resize="none"
                value={formState.linkIconNanoId}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    linkIconNanoId: value,
                  }))
                }
              />
            </div>
          </div>
          <div className={styles.sidePanel.formActions}>
            <Button
              type="button"
              styleType="text"
              variant="secondary"
              onClick={() => {
                if (selectedRowId) {
                  setPanelMode('detail');
                } else {
                  setPanelMode('idle');
                }
              }}
            >
              취소
            </Button>
            <Button type="submit" styleType="solid" variant="primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? '등록 중...' : '외부 링크 등록'}
            </Button>
          </div>
        </form>
      );
    }

    if (!selectedRowId || !oebuLinkDetailData) {
      return (
        <div className={styles.sidePanel.empty}>
          좌측 목록에서 외부 링크를 선택하거나 새로운 링크를 등록하세요.
        </div>
      );
    }

    if (panelMode === 'edit') {
      return (
        <form className={styles.sidePanel.form} onSubmit={handleSubmitUpdate}>
          <div className={styles.sidePanel.section}>
            <div className={styles.sidePanel.sectionHeader}>
              <span className={styles.sidePanel.sectionTitle}>외부 링크 정보 수정</span>
              <span className={styles.sidePanel.sectionDescription}>
                구성원이 자주 사용하는 외부 서비스 정보를 최신 상태로 유지하세요.
              </span>
            </div>
            <div className={styles.sidePanel.formGroup}>
              <LabeledInput
                label="링크 이름"
                required
                value={formState.name}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, name: value }))}
              />
              <LabeledInput
                label="표시 이름"
                required
                value={formState.asName}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, asName: value }))}
              />
              <LabeledInput
                label="링크 주소"
                type="url"
                required
                value={formState.linkUrl}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, linkUrl: value }))}
              />
              <Textfield
                label="아이콘 ID"
                rows={2}
                resize="none"
                value={formState.linkIconNanoId}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    linkIconNanoId: value,
                  }))
                }
              />
            </div>
          </div>
          <div className={styles.sidePanel.formActions}>
            <Button
              type="button"
              styleType="text"
              variant="secondary"
              onClick={() => setPanelMode('detail')}
            >
              취소
            </Button>
            <Button type="submit" styleType="solid" variant="primary" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? '저장 중...' : '변경 사항 저장'}
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className={styles.sidePanel.section}>
        <div className={styles.sidePanel.sectionHeader}>
          <span className={styles.sidePanel.sectionTitle}>등록 정보</span>
          <span className={styles.sidePanel.sectionDescription}>
            외부 서비스와의 연결 정보를 확인하고 설정을 변경할 수 있습니다.
          </span>
        </div>
        <div className={styles.sidePanel.infoList}>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>링크 이름</span>
            <span className={styles.sidePanel.infoValue}>{oebuLinkDetailData.name}</span>
          </div>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>표시 이름</span>
            <span className={styles.sidePanel.infoValue}>{oebuLinkDetailData.asName}</span>
          </div>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>링크 주소</span>
            <span className={styles.sidePanel.infoValue}>
              <a href={oebuLinkDetailData.linkUrl} target="_blank" rel="noreferrer">
                {oebuLinkDetailData.linkUrl}
              </a>
            </span>
          </div>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>아이콘</span>
            <div className={styles.sidePanel.linkPreview}>
              <div className={styles.sidePanel.linkPreviewIcon}>
                {oebuLinkDetailData.linkIcon ? (
                  <Image
                    src={oebuLinkDetailData.linkIcon}
                    alt={`${oebuLinkDetailData.name} 아이콘`}
                    fill
                    sizes="40px"
                    className={styles.sidePanel.linkPreviewImage}
                    unoptimized
                  />
                ) : (
                  <span className={styles.sidePanel.linkPreviewFallback}>
                    {oebuLinkDetailData.name?.[0]?.toUpperCase() ?? '?'}
                  </span>
                )}
              </div>
              <span className={styles.sidePanel.infoValue}>{oebuLinkDetailData.linkIcon || '아이콘 정보 없음'}</span>
            </div>
          </div>
        </div>
        <div className={styles.sidePanel.section}>
          <div className={styles.sidePanel.sectionHeader}>
            <span className={styles.sidePanel.sectionTitle}>이력</span>
            <span className={styles.sidePanel.sectionDescription}>
              언제 등록되고 수정되었는지 확인하세요.
            </span>
          </div>
          <div className={styles.sidePanel.infoList}>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>등록자</span>
              <span className={styles.sidePanel.infoValue}>{oebuLinkDetailData.createdBy}</span>
            </div>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>등록일</span>
              <span className={styles.sidePanel.infoValue}>{formatDateTime(oebuLinkDetailData.createdAt)}</span>
            </div>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>수정자</span>
              <span className={styles.sidePanel.infoValue}>{oebuLinkDetailData.updatedBy}</span>
            </div>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>수정일</span>
              <span className={styles.sidePanel.infoValue}>{formatDateTime(oebuLinkDetailData.updatedAt)}</span>
            </div>
          </div>
        </div>
        <div className={styles.sidePanel.linkActions}>
          <Button
            type="button"
            styleType="solid"
            variant="primary"
            onClick={() => window.open(oebuLinkDetailData.linkUrl, '_blank', 'noopener,noreferrer')}
          >
            링크 열기
          </Button>
          <div className={styles.sidePanel.linkActionGroup}>
            <Button styleType="text" variant="secondary" onClick={handleStartEdit}>
              정보 수정
            </Button>
            <Button
              styleType="text"
              variant="secondary"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '삭제 중...' : '삭제하기'}
            </Button>
          </div>
        </div>
      </div>
    );
  })();

  return (
    <ListViewLayout
      title="외부 링크 관리"
      description="조직에서 자주 사용하는 외부 시스템과 자료 링크를 관리합니다."
      meta={<span>{`조직 코드: ${gigwanNanoId}`}</span>}
      headerActions={
        <>
          <span className={styles.headerCounter}>{`전체 외부 링크 (${totalItems}개)`}</span>
          <Button styleType="solid" variant="primary" onClick={handleOpenCreate}>
            외부 링크 추가
          </Button>
        </>
      }
      filterBar={
        <div className={styles.tableToolbar}>
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <SearchIcon className={styles.searchIcon} width={18} height={18} />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="링크 이름, 표시 이름, 주소를 검색해 주세요."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <span className={styles.tableSummary}>{`검색 결과 ${filteredLinks.length}건이 표시됩니다.`}</span>
        </div>
      }
      list={
        isListLoading ? (
          <div className={styles.listPlaceholder}>외부 링크 목록을 불러오는 중입니다.</div>
        ) : (
          <ListViewTable
            columns={columns}
            rows={paginatedRows}
            getRowId={(row) => row.nanoId}
            selectedRowIds={selectedRowId ? [selectedRowId] : []}
            onSelectionChange={handleSelectionChange}
          />
        )
      }
      pagination={
        <ListViewPagination
          currentPage={safeCurrentPage}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      }
      sidePanel={
        <>
          <div className={styles.sidePanel.header}>
            <span className={styles.sidePanel.title}>
              {panelMode === 'create'
                ? '외부 링크 등록'
                : panelMode === 'edit'
                  ? '외부 링크 설정 편집'
                  : selectedRowId
                    ? oebuLinkDetailData?.name ?? '외부 링크 상세'
                    : '외부 링크 설정'}
            </span>
            <span className={styles.sidePanel.subtitle}>
              {panelMode === 'create'
                ? '새로운 외부 링크를 등록하세요.'
                : selectedRowId
                  ? '외부 링크의 상세 정보와 설정을 확인할 수 있습니다.'
                  : '좌측에서 외부 링크를 선택하면 상세 정보가 표시됩니다.'}
            </span>
          </div>
          <div className={styles.sidePanel.body}>
            {isDetailLoading && panelMode !== 'create' ? '정보를 불러오는 중입니다...' : sidePanelContent}
          </div>
        </>
      }
    />
  );
}

function buildCreatePayload(
  state: OebuLinkFormState,
  gigwanNanoId: string,
): CreateOebuLinkRequest | null {
  const base = sanitizeFormState(state);
  if (!base) return null;

  return {
    gigwanNanoId,
    ...base,
  };
}

function buildUpdatePayload(state: OebuLinkFormState): UpdateOebuLinkRequest | null {
  const base = sanitizeFormState(state);
  if (!base) return null;

  return base;
}

function sanitizeFormState(state: OebuLinkFormState): OebuLinkRequestPayload | null {
  const name = state.name.trim();
  const asName = state.asName.trim();
  const linkUrl = state.linkUrl.trim();
  const linkIconNanoId = state.linkIconNanoId.trim();

  if (!name || !asName || !linkUrl || !linkIconNanoId) {
    window.alert('링크 이름, 표시 이름, 링크 주소, 아이콘 ID는 모두 필수 입력 항목입니다.');
    return null;
  }

  return {
    name,
    asName,
    linkUrl,
    linkIconNanoId,
  };
}

function formatDateTime(value: string): string {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return '날짜 정보 없음';
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

