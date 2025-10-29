'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import {
  type CreateJusoRequest,
  type JusoListItem,
  type UpdateJusoRequest,
  useCreateJusoMutation,
  useDeleteJusoMutation,
  useGetJusoDetailQuery,
  useGetJusosQuery,
  useUpdateJusoMutation,
} from '@/api/juso';
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

type JusoFormState = Pick<CreateJusoRequest, 'jusoName' | 'juso' | 'jusoDetail'>;

const initialFormState: JusoFormState = {
  jusoName: '',
  juso: '',
  jusoDetail: '',
};

export default function JoResourceAddressesPage({ params }: PageProps) {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('idle');
  const [formState, setFormState] = useState<JusoFormState>(initialFormState);

  const { data: jusoListData, isLoading: isListLoading } = useGetJusosQuery();
  const { data: jusoDetailData, isFetching: isDetailLoading } = useGetJusoDetailQuery(
    selectedRowId ?? '',
    {
      enabled: panelMode !== 'create' && Boolean(selectedRowId),
    },
  );

  const createMutation = useCreateJusoMutation();
  const updateMutation = useUpdateJusoMutation(selectedRowId ?? '');
  const deleteMutation = useDeleteJusoMutation(selectedRowId ?? '');

  const jusos = useMemo<JusoListItem[]>(() => jusoListData?.jusos ?? [], [jusoListData]);

  const filteredJusos = useMemo(() => {
    if (!searchTerm.trim()) return jusos;
    const lowered = searchTerm.trim().toLowerCase();
    return jusos.filter((item) =>
      [item.jusoName, item.jusoDetail, item.juso]
        .join(' ')
        .toLowerCase()
        .includes(lowered),
    );
  }, [jusos, searchTerm]);

  const totalItems = filteredJusos.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(
    () =>
      filteredJusos.slice((safeCurrentPage - 1) * PAGE_SIZE, (safeCurrentPage - 1) * PAGE_SIZE + PAGE_SIZE),
    [filteredJusos, safeCurrentPage],
  );

  const columns = useMemo<ListViewColumn<JusoListItem>[]>(
    () => [
      {
        id: 'jusoName',
        header: '주소명',
        render: (row) => <span className={styles.nameCell}>{row.jusoName}</span>,
      },
      {
        id: 'jusoDetail',
        header: '상세 주소',
        render: (row) => row.jusoDetail || <span className={styles.cellMuted}>상세 정보 없음</span>,
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
    if (!jusoDetailData) return;
    setFormState({
      jusoName: jusoDetailData.jusoName,
      juso: jusoDetailData.juso,
      jusoDetail: jusoDetailData.jusoDetail,
    });
    setPanelMode('edit');
  };

  const handleSubmitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildRequestPayload(formState);
    if (!payload) return;
    try {
      const result = await createMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: ['jusos'] });
      setSelectedRowId(result.nanoId);
      setPanelMode('detail');
    } catch (error) {
      console.error(error);
      window.alert('주소 등록에 실패했습니다. 입력값을 확인해주세요.');
    }
  };

  const handleSubmitUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRowId) return;
    const payload = buildRequestPayload(formState);
    if (!payload) return;
    try {
      await updateMutation.mutateAsync(payload as UpdateJusoRequest);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['jusos'] }),
        queryClient.invalidateQueries({ queryKey: ['juso', selectedRowId] }),
      ]);
      setPanelMode('detail');
    } catch (error) {
      console.error(error);
      window.alert('주소 정보를 수정하지 못했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async () => {
    if (!selectedRowId) return;
    const confirmed = window.confirm('선택한 주소를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.');
    if (!confirmed) return;
    try {
      await deleteMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: ['jusos'] });
      setSelectedRowId(null);
      setPanelMode('idle');
    } catch (error) {
      console.error(error);
      window.alert('주소 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const sidePanelContent = (() => {
    if (panelMode === 'create') {
      return (
        <form className={styles.sidePanel.form} onSubmit={handleSubmitCreate}>
          <div className={styles.sidePanel.section}>
            <div className={styles.sidePanel.sectionHeader}>
              <span className={styles.sidePanel.sectionTitle}>주소 정보 입력</span>
              <span className={styles.sidePanel.sectionDescription}>
                조직이 관리하는 시설이나 캠퍼스의 주소를 등록합니다.
              </span>
            </div>
            <div className={styles.sidePanel.formGroup}>
              <LabeledInput
                label="주소명"
                placeholder="예: 본관"
                required
                value={formState.jusoName}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, jusoName: value }))}
              />
              <LabeledInput
                label="기본 주소"
                placeholder="도로명 주소를 입력하세요"
                required
                value={formState.juso}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, juso: value }))}
              />
              <Textfield
                label="상세 주소"
                placeholder="동/호수 등 상세 주소를 입력하세요"
                rows={3}
                resize="limit"
                value={formState.jusoDetail}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    jusoDetail: value,
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
              {createMutation.isPending ? '등록 중...' : '주소 등록'}
            </Button>
          </div>
        </form>
      );
    }

    if (!selectedRowId || !jusoDetailData) {
      return <div className={styles.sidePanel.empty}>좌측 목록에서 주소를 선택하거나 새 주소를 등록하세요.</div>;
    }

    if (panelMode === 'edit') {
      return (
        <form className={styles.sidePanel.form} onSubmit={handleSubmitUpdate}>
          <div className={styles.sidePanel.section}>
            <div className={styles.sidePanel.sectionHeader}>
              <span className={styles.sidePanel.sectionTitle}>주소 정보 수정</span>
              <span className={styles.sidePanel.sectionDescription}>
                주소명과 주소 정보를 변경하면 조직 구성원들이 최신 정보를 확인할 수 있습니다.
              </span>
            </div>
            <div className={styles.sidePanel.formGroup}>
              <LabeledInput
                label="주소명"
                required
                value={formState.jusoName}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, jusoName: value }))}
              />
              <LabeledInput
                label="기본 주소"
                required
                value={formState.juso}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, juso: value }))}
              />
              <Textfield
                label="상세 주소"
                rows={3}
                resize="limit"
                value={formState.jusoDetail}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    jusoDetail: value,
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
            주소 정보를 확인하고 필요한 설정을 수정할 수 있습니다.
          </span>
        </div>
        <div className={styles.sidePanel.infoList}>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>주소명</span>
            <span className={styles.sidePanel.infoValue}>{jusoDetailData.jusoName}</span>
          </div>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>기본 주소</span>
            <span className={styles.sidePanel.infoValue}>{jusoDetailData.juso}</span>
          </div>
          <div className={styles.sidePanel.infoItem}>
            <span className={styles.sidePanel.infoLabel}>상세 주소</span>
            <span className={styles.sidePanel.infoValue}>
              {jusoDetailData.jusoDetail || <span className={styles.sidePanel.muted}>등록된 상세 주소가 없습니다.</span>}
            </span>
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
              <span className={styles.sidePanel.infoValue}>{jusoDetailData.createdBy}</span>
            </div>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>등록일</span>
              <span className={styles.sidePanel.infoValue}>{formatDateTime(jusoDetailData.createdAt)}</span>
            </div>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>수정자</span>
              <span className={styles.sidePanel.infoValue}>{jusoDetailData.updatedBy}</span>
            </div>
            <div className={styles.sidePanel.infoItem}>
              <span className={styles.sidePanel.infoLabel}>수정일</span>
              <span className={styles.sidePanel.infoValue}>{formatDateTime(jusoDetailData.updatedAt)}</span>
            </div>
          </div>
        </div>
        <div className={styles.sidePanel.formActions}>
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
    );
  })();

  return (
    <ListViewLayout
      title="주소 관리"
      description="조직이 관리하는 시설과 캠퍼스 주소를 조회하고 설정합니다."
      meta={<span>{`조직 코드: ${params.jo}`}</span>}
      headerActions={
        <>
          <span className={styles.headerCounter}>{`전체 주소 (${totalItems}개)`}</span>
          <Button styleType="solid" variant="primary" onClick={handleOpenCreate}>
            주소 추가
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
                placeholder="주소명, 설명, 주소를 입력해주세요."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <span className={styles.tableSummary}>
            {`검색 결과 ${filteredJusos.length}건이 표시됩니다.`}
          </span>
        </div>
      }
      list={
        isListLoading ? (
          <div className={styles.listPlaceholder}>주소 목록을 불러오는 중입니다.</div>
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
                ? '주소 등록'
                : panelMode === 'edit'
                  ? '주소 설정 편집'
                  : selectedRowId
                    ? jusoDetailData?.jusoName ?? '주소 상세'
                    : '주소 설정'}
            </span>
            <span className={styles.sidePanel.subtitle}>
              {panelMode === 'create'
                ? '새로운 주소를 등록하세요.'
                : selectedRowId
                  ? '주소의 상세 정보와 설정을 확인할 수 있습니다.'
                  : '좌측에서 주소를 선택하면 상세 정보가 표시됩니다.'}
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

function buildRequestPayload(state: JusoFormState): CreateJusoRequest | null {
  const jusoName = state.jusoName.trim();
  const juso = state.juso.trim();
  const jusoDetail = state.jusoDetail.trim();

  if (!jusoName || !juso) {
    window.alert('주소명과 기본 주소는 필수 입력 항목입니다.');
    return null;
  }

  return {
    jusoName,
    juso,
    jusoDetail,
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
