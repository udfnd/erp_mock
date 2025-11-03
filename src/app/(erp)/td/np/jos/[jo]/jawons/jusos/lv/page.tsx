'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import {
  type CreateJusoRequest,
  type GetJusosRequest,
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
import { useDaumPostcode } from '@/hooks/useDaumPostcode';

import * as styles from './page.style.css';

const PAGE_SIZE = 10;

type PageProps = {
  params: {
    jo: string;
  };
};

type PanelMode = 'detail' | 'edit' | 'create';

type JusoFormState = Pick<CreateJusoRequest, 'jusoName' | 'juso' | 'jusoDetail'>;

type SortOptionId = 'nameAsc' | 'nameDesc' | 'createdAtAsc' | 'createdAtDesc';

const SORT_OPTIONS: Array<{ id: SortOptionId; label: string }> = [
  { id: 'createdAtDesc', label: '최신 등록순' },
  { id: 'createdAtAsc', label: '오래된 등록순' },
  { id: 'nameAsc', label: '주소명 오름차순' },
  { id: 'nameDesc', label: '주소명 내림차순' },
];

const initialFormState: JusoFormState = {
  jusoName: '',
  juso: '',
  jusoDetail: '',
};

export default function JoResourceAddressesPage({ params }: PageProps) {
  const queryClient = useQueryClient();
  const gigwanNanoId = params.jo;
  const openDaumPostcode = useDaumPostcode();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOptionId>('createdAtDesc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('create');
  const [formState, setFormState] = useState<JusoFormState>(initialFormState);

  const safeCurrentPage = Math.max(1, currentPage);

  const listQueryParams = useMemo<GetJusosRequest>(() => {
    const baseParams: GetJusosRequest = {
      gigwanNanoId,
      pageNumber: safeCurrentPage,
      pageSize: PAGE_SIZE,
      sortByOption: sortOption,
    };
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      baseParams.jusoNameSearch = trimmedSearch;
    }
    return baseParams;
  }, [gigwanNanoId, safeCurrentPage, sortOption, searchTerm]);

  const {
    data: jusoListData,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useGetJusosQuery(listQueryParams, {
    enabled: Boolean(gigwanNanoId),
  });

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
  const paginationData = jusoListData?.paginationData;
  const totalItems = paginationData?.totalItemCount ?? jusos.length;
  const pageSizeFromServer = paginationData?.pageSize ?? PAGE_SIZE;
  const currentPageFromServer = paginationData?.pageNumber ?? safeCurrentPage;

  const columns = useMemo<ListViewColumn<JusoListItem>[]>(
    () => [
      {
        id: 'jusoName',
        header: '주소명',
        render: (row) => <span className={styles.nameCell}>{row.jusoName}</span>,
      },
      {
        id: 'juso',
        header: '기본 주소',
        render: (row) => row.juso || <span className={styles.cellMuted}>주소 정보 없음</span>,
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
      setPanelMode('create');
      setFormState(initialFormState);
    }
  };

  const handleOpenCreate = () => {
    setPanelMode('create');
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

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOptionId);
    setCurrentPage(1);
  };

  const handleOpenAddressSearch = async () => {
    try {
      await openDaumPostcode({
        onComplete: (result) => {
          const resolvedAddress =
            result.roadAddress?.trim() ||
            result.address?.trim() ||
            result.jibunAddress?.trim() ||
            '';
          if (!resolvedAddress) return;
          setFormState((prev) => ({
            ...prev,
            juso: resolvedAddress,
          }));
        },
      });
    } catch (error) {
      console.error(error);
      window.alert('주소 검색 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleSubmitCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!gigwanNanoId) {
      window.alert('기관 정보가 없어 주소를 등록할 수 없습니다.');
      return;
    }
    const payload = buildCreatePayload(formState, gigwanNanoId);
    if (!payload) return;
    try {
      const result = await createMutation.mutateAsync(payload);
      setCurrentPage(1);
      await queryClient.invalidateQueries({ queryKey: ['jusos'] });
      setSelectedRowId(result.nanoId);
      setPanelMode('detail');
    } catch (error) {
      console.error(error);
      window.alert('주소 등록에 실패했습니다. 입력값을 확인해주세요.');
    }
  };

  const handleSubmitUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRowId) return;
    const payload = buildUpdatePayload(formState);
    if (!payload) return;
    try {
      await updateMutation.mutateAsync(payload);
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
    const confirmed = window.confirm(
      '선택한 주소를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.',
    );
    if (!confirmed) return;
    const shouldMoveToPrevPage =
      (paginationData?.pageItemCount ?? jusos.length) <= 1 &&
      (paginationData?.pageNumber ?? safeCurrentPage) > 1;
    try {
      await deleteMutation.mutateAsync();
      if (shouldMoveToPrevPage) {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
      await queryClient.invalidateQueries({ queryKey: ['jusos'] });
      setSelectedRowId(null);
      setPanelMode('create');
      setFormState(initialFormState);
    } catch (error) {
      console.error(error);
      window.alert('주소 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const isCreateMode = panelMode === 'create' || !selectedRowId;
  const isEditMode = panelMode === 'edit';
  const isDetailMode = panelMode === 'detail' && Boolean(selectedRowId);

  const sidePanelContent = (() => {
    if (isCreateMode) {
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
                placeholder="주소를 입력해 주세요"
                required
                value={formState.juso}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, juso: value }))}
                onClick={handleOpenAddressSearch}
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
            {selectedRowId ? (
              <Button
                type="button"
                styleType="text"
                variant="secondary"
                onClick={() => setPanelMode('detail')}
              >
                취소
              </Button>
            ) : null}
            <Button
              type="submit"
              styleType="solid"
              variant="primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? '등록 중...' : '주소 등록'}
            </Button>
          </div>
        </form>
      );
    }

    if (isEditMode && jusoDetailData) {
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
                placeholder="주소를 입력해 주세요"
                required
                value={formState.juso}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, juso: value }))}
                onClick={handleOpenAddressSearch}
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
            <Button
              type="submit"
              styleType="solid"
              variant="primary"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? '저장 중...' : '변경 사항 저장'}
            </Button>
          </div>
        </form>
      );
    }

    if (isDetailMode && jusoDetailData) {
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
                {jusoDetailData.jusoDetail || (
                  <span className={styles.sidePanel.muted}>등록된 상세 주소가 없습니다.</span>
                )}
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
                <span className={styles.sidePanel.infoValue}>
                  {jusoDetailData.createdBy ?? '알 수 없음'}
                </span>
              </div>
              <div className={styles.sidePanel.infoItem}>
                <span className={styles.sidePanel.infoLabel}>등록일</span>
                <span className={styles.sidePanel.infoValue}>
                  {formatDateTime(jusoDetailData.createdAt)}
                </span>
              </div>
              <div className={styles.sidePanel.infoItem}>
                <span className={styles.sidePanel.infoLabel}>수정자</span>
                <span className={styles.sidePanel.infoValue}>
                  {jusoDetailData.updatedBy ?? '알 수 없음'}
                </span>
              </div>
              <div className={styles.sidePanel.infoItem}>
                <span className={styles.sidePanel.infoLabel}>수정일</span>
                <span className={styles.sidePanel.infoValue}>
                  {formatDateTime(jusoDetailData.updatedAt)}
                </span>
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
    }

    return <div className={styles.sidePanel.empty}>주소 정보를 불러오는 중입니다.</div>;
  })();

  return (
    <ListViewLayout
      title="주소 관리"
      description="조직이 관리하는 시설과 캠퍼스 주소를 조회하고 설정합니다."
      meta={<span>{`조직 코드: ${gigwanNanoId || '-'}`}</span>}
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
                onChange={handleSearchChange}
              />
            </div>
            <div className={styles.sortWrapper}>
              <span className={styles.sortLabel}>정렬</span>
              <select className={styles.sortSelect} value={sortOption} onChange={handleSortChange}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <span className={styles.tableSummary}>
            {isListFetching
              ? '주소 목록을 새로고침하는 중입니다...'
              : `검색 결과 ${totalItems}건이 표시됩니다.`}
          </span>
        </div>
      }
      list={
        isListLoading ? (
          <div className={styles.listPlaceholder}>주소 목록을 불러오는 중입니다.</div>
        ) : (
          <ListViewTable
            columns={columns}
            rows={jusos}
            getRowId={(row) => row.nanoId}
            selectedRowIds={selectedRowId ? [selectedRowId] : []}
            onSelectionChange={handleSelectionChange}
          />
        )
      }
      pagination={
        <ListViewPagination
          currentPage={currentPageFromServer}
          totalItems={totalItems}
          pageSize={pageSizeFromServer}
          onPageChange={setCurrentPage}
        />
      }
      sidePanel={
        <>
          <div className={styles.sidePanel.header}>
            <span className={styles.sidePanel.title}>
              {isCreateMode
                ? '주소 등록'
                : isEditMode
                  ? '주소 설정 편집'
                  : selectedRowId
                    ? jusoDetailData?.jusoName ?? '주소 상세'
                    : '주소 설정'}
            </span>
            <span className={styles.sidePanel.subtitle}>
              {isCreateMode
                ? '새로운 주소를 등록하세요.'
                : selectedRowId
                  ? '주소의 상세 정보와 설정을 확인할 수 있습니다.'
                  : '좌측에서 주소를 선택하면 상세 정보가 표시됩니다.'}
            </span>
          </div>
          <div className={styles.sidePanel.body}>
            {isDetailLoading && !isCreateMode
              ? '정보를 불러오는 중입니다...'
              : sidePanelContent}
          </div>
        </>
      }
    />
  );
}

function buildCreatePayload(
  state: JusoFormState,
  gigwanNanoId: string,
): CreateJusoRequest | null {
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
    gigwanNanoId,
  };
}

function buildUpdatePayload(state: JusoFormState): UpdateJusoRequest | null {
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
