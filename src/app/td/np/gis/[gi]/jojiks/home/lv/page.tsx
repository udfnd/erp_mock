'use client';

import { type ChangeEvent, type FormEvent, type MouseEvent, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  type SortingState,
  type HeaderContext,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';

import { Button, Checkbox, Textfield } from '@/common/components';
import {
  useCreateJojikMutation,
  useDeleteJojikMutation,
  useJojikQuery,
  useJojiksQuery,
  useUpdateJojikMutation,
} from '@/domain/jojik/api';
import type { JojikListItem, UpdateJojikRequest } from '@/domain/jojik/api/jojik.schema';
import { useAuth } from '@/global/auth';

import { ListViewHeadlessTemplate, useListViewHeadlessState } from '@/common/list-view';
import { cssObj } from './style';

type PageParams = {
  gi?: string | string[];
};

type CreatedAtFilterValue = 'all' | '7' | '30';

const columnHelper = createColumnHelper<JojikListItem>();

const CREATED_AT_FILTER_OPTIONS: { label: string; value: CreatedAtFilterValue }[] = [
  { label: '전체 기간', value: 'all' },
  { label: '최근 7일', value: '7' },
  { label: '최근 30일', value: '30' },
];

const SORT_OPTIONS = [
  { label: '최근 생성 순', value: 'createdAt:desc' },
  { label: '오래된 순', value: 'createdAt:asc' },
  { label: '이름 오름차순', value: 'name:asc' },
  { label: '이름 내림차순', value: 'name:desc' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
};

const getSortStateFromOption = (option: string | undefined): SortingState => {
  if (!option) {
    return [];
  }

  const [id, direction] = option.split(':');
  if (!id) {
    return [];
  }

  return [
    {
      id,
      desc: direction === 'desc',
    },
  ];
};

const getSortOptionFromState = (sorting: SortingState): string | undefined => {
  const current = sorting[0];
  if (!current) {
    return undefined;
  }

  return `${current.id}:${current.desc ? 'desc' : 'asc'}`;
};

const CREATED_AT_FILTER_NOW = Date.now();

const createSortableHeader = (label: string) => {
  const SortableHeader = ({ column }: HeaderContext<JojikListItem, unknown>) => (
    <button type="button" css={cssObj.sortButton} onClick={column.getToggleSortingHandler()}>
      {label}
      <span css={cssObj.sortIcon}>
        {column.getIsSorted() === 'asc' && '▲'}
        {column.getIsSorted() === 'desc' && '▼'}
        {!column.getIsSorted() && '⇅'}
      </span>
    </button>
  );

  SortableHeader.displayName = `SortableHeader(${label})`;

  return SortableHeader;
};

export default function NpGigwanJojikListViewPage() {
  const params = useParams<PageParams>();
  const gigwanNanoId = Array.isArray(params?.gi) ? (params?.gi[0] ?? '') : (params?.gi ?? '');
  const { isAuthenticated } = useAuth();

  return (
    <JojikListView
      key={gigwanNanoId || 'no-gi'}
      gigwanNanoId={gigwanNanoId}
      isAuthenticated={isAuthenticated}
    />
  );
}

type JojikListViewProps = {
  gigwanNanoId: string;
  isAuthenticated: boolean;
};

function JojikListView({ gigwanNanoId, isAuthenticated }: JojikListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const baseState = useListViewHeadlessState<JojikListItem>({
    initialSorting: [{ id: 'createdAt', desc: true }],
    initialPagination: { pageIndex: 0, pageSize: 10 },
  });

  const setSortingWithReset: typeof baseState.setSorting = (updater) => {
    baseState.setSorting(updater);
    baseState.setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const listViewState = {
    ...baseState,
    setSorting: setSortingWithReset,
  };

  const {
    sorting,
    columnFilters,
    rowSelection,
    pagination,
    setSorting,
    setColumnFilters,
    setRowSelection,
    setPagination,
  } = listViewState;

  const [isCreating, setIsCreating] = useState(false);

  const sortByOption = getSortOptionFromState(sorting);

  const {
    data: jojiksData,
    isLoading: isListLoading,
    refetch,
  } = useJojiksQuery(
    {
      gigwanNanoId,
      jojikNameSearch: searchTerm ? searchTerm : undefined,
      sortByOption,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    },
    {
      enabled: isAuthenticated && Boolean(gigwanNanoId),
    },
  );

  const data = jojiksData?.jojiks ?? [];
  const totalCount = (jojiksData?.totalCount as number | undefined) ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pagination.pageSize, 1)));

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'selection',
        header: ({ table }) => (
          <div css={cssObj.checkboxCell}>
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onChange={(event) => {
                setIsCreating(false);
                table.getToggleAllPageRowsSelectedHandler()(event);
              }}
              ariaLabel="전체 조직 선택"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div css={cssObj.checkboxCell}>
            <Checkbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={(event) => {
                setIsCreating(false);
                row.getToggleSelectedHandler()(event);
              }}
              ariaLabel={`${row.original.name} 선택`}
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor('name', {
        header: createSortableHeader('조직 이름'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        header: createSortableHeader('생성일'),
        cell: (info) => formatDate(info.getValue()),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue === 'all') {
            return true;
          }

          const days = Number(filterValue);
          const rawValue = row.getValue<string>(columnId);
          const parsed = new Date(rawValue);
          if (Number.isNaN(parsed.getTime())) {
            return true;
          }

          const diff = CREATED_AT_FILTER_NOW - parsed.getTime();
          const threshold = days * 24 * 60 * 60 * 1000;

          return diff <= threshold;
        },
      }),
    ],
    [setIsCreating],
  );

  const currentCreatedFilter =
    (columnFilters.find((filter) => filter.id === 'createdAt')?.value as
      | CreatedAtFilterValue
      | undefined) ?? 'all';

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleCreatedFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as CreatedAtFilterValue;
    setColumnFilters((prev) => {
      const others = prev.filter((filter) => filter.id !== 'createdAt');
      if (value === 'all') {
        return others;
      }
      return [...others, { id: 'createdAt', value }];
    });
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSorting(getSortStateFromOption(value));
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(event.target.value);
    setPagination({ pageIndex: 0, pageSize: size });
  };

  const clearSelection = () => {
    setRowSelection({});
  };

  const startCreate = () => {
    setIsCreating(true);
    clearSelection();
  };

  const stopCreate = () => {
    setIsCreating(false);
  };

  const handleAddClick = () => {
    startCreate();
  };

  const handleClearSelection = () => {
    clearSelection();
  };

  return (
    <ListViewHeadlessTemplate
      data={data}
      columns={columns}
      state={listViewState}
      manualPagination
      manualSorting
      pageCount={totalPages}
      enableRowSelection
      autoResetPageIndex={false}
      autoResetExpanded={false}
    >
      {({ table, selectedFlatRows }) => {
        const selectedJojiks = selectedFlatRows.map((row) => row.original);
        const visibleColumnsLength = table.getVisibleFlatColumns().length;

        return (
          <div css={cssObj.page}>
            <section css={cssObj.listSection}>
              <Button variant="primary" onClick={handleAddClick}>
                새 조직 추가
              </Button>
              <div css={cssObj.tableContainer}>
                <div css={cssObj.toolbar}>
                  <div css={cssObj.toolbarTextfield}>
                    <Textfield
                      singleLine
                      label="검색"
                      placeholder="조직 이름으로 검색"
                      value={searchTerm}
                      onValueChange={handleSearchChange}
                    />
                  </div>
                  <div css={cssObj.toolbarGroup}>
                    <label>
                      <select
                        css={cssObj.toolbarSelect}
                        value={sortByOption ?? 'createdAt:desc'}
                        onChange={handleSortChange}
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <select
                        css={cssObj.toolbarSelect}
                        value={currentCreatedFilter}
                        onChange={handleCreatedFilterChange}
                      >
                        {CREATED_AT_FILTER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <select
                        css={cssObj.toolbarSelect}
                        value={pagination.pageSize}
                        onChange={handlePageSizeChange}
                      >
                        {PAGE_SIZE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            페이지 당 {option}개
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div css={cssObj.tableWrapper}>
                  <table css={cssObj.table}>
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} css={cssObj.tableHeadRow}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              css={cssObj.tableHeaderCell}
                              colSpan={header.colSpan}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {isListLoading ? (
                        <tr>
                          <td colSpan={visibleColumnsLength} css={cssObj.loadingState}>
                            조직 데이터를 불러오는 중입니다...
                          </td>
                        </tr>
                      ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                          <tr
                            key={row.id}
                            css={[cssObj.tableRow, row.getIsSelected() && cssObj.tableRowSelected]}
                            onClick={(event: MouseEvent<HTMLTableRowElement>) => {
                              const target = event.target as HTMLElement | null;
                              if (target?.closest('label')) {
                                return;
                              }
                              // 행 클릭으로 선택 시에도 생성 모드 종료
                              stopCreate();
                              row.toggleSelected();
                            }}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <td
                                key={cell.id}
                                css={[
                                  cssObj.tableCell,
                                  cell.column.id === 'selection' && cssObj.checkboxCell,
                                ]}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={visibleColumnsLength} css={cssObj.emptyState}>
                            조건에 맞는 조직이 없습니다. 검색어나 필터를 조정해 보세요.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div css={cssObj.tableFooter}>
                  <span css={cssObj.paginationInfo}>
                    총 {totalCount}개 조직 · {table.getState().pagination.pageIndex + 1} /{' '}
                    {totalPages} 페이지
                  </span>
                  <div css={cssObj.paginationButtons}>
                    <Button
                      styleType="text"
                      variant="secondary"
                      size="small"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      처음
                    </Button>
                    <Button
                      styleType="text"
                      variant="secondary"
                      size="small"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      이전
                    </Button>
                    <Button
                      styleType="text"
                      variant="secondary"
                      size="small"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      다음
                    </Button>
                    <Button
                      styleType="text"
                      variant="secondary"
                      size="small"
                      onClick={() => table.setPageIndex(totalPages - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      마지막
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <SettingsPanel
              gigwanNanoId={gigwanNanoId}
              selectedJojiks={selectedJojiks}
              isCreating={isCreating}
              onStartCreate={startCreate}
              onExitCreate={stopCreate}
              onAfterMutation={refetch}
              onClearSelection={handleClearSelection}
              isAuthenticated={isAuthenticated}
            />
          </div>
        );
      }}
    </ListViewHeadlessTemplate>
  );
}

type SettingsPanelProps = {
  gigwanNanoId: string;
  selectedJojiks: JojikListItem[];
  isCreating: boolean;
  onStartCreate: () => void;
  onExitCreate: () => void;
  onAfterMutation: () => Promise<unknown> | void;
  onClearSelection: () => void;
  isAuthenticated: boolean;
};

function SettingsPanel({
  gigwanNanoId,
  selectedJojiks,
  isCreating,
  onStartCreate,
  onExitCreate,
  onAfterMutation,
  onClearSelection,
  isAuthenticated,
}: SettingsPanelProps) {
  if (!gigwanNanoId) {
    return (
      <aside css={cssObj.settingsPanel}>
        <div css={cssObj.panelHeader}>
          <h2 css={cssObj.panelTitle}>기관이 선택되지 않았습니다</h2>
          <p css={cssObj.panelSubtitle}>URL의 기관 식별자를 확인해 주세요.</p>
        </div>
        <div css={cssObj.panelBody}>
          <p css={cssObj.helperText}>기관 ID가 없으면 조직 데이터를 불러올 수 없습니다.</p>
        </div>
      </aside>
    );
  }

  if (isCreating) {
    return (
      <aside css={cssObj.settingsPanel}>
        <CreateJojikPanel
          gigwanNanoId={gigwanNanoId}
          onExit={onExitCreate}
          onAfterMutation={onAfterMutation}
        />
      </aside>
    );
  }

  if (selectedJojiks.length === 0) {
    return (
      <aside css={cssObj.settingsPanel}>
        <EmptyStatePanel onStartCreate={onStartCreate} />
      </aside>
    );
  }

  if (selectedJojiks.length === 1) {
    return (
      <aside css={cssObj.settingsPanel}>
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
    <aside css={cssObj.settingsPanel}>
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
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>조직을 선택하거나 생성해 보세요</h2>
        <p css={cssObj.panelSubtitle}>
          좌측 목록에서 조직을 선택하거나 새로운 조직을 생성할 수 있습니다.
        </p>
      </div>
      <div css={cssObj.panelBody}>
        <div css={cssObj.panelSection}>
          <span css={cssObj.panelLabel}>빠른 시작</span>
          <p css={cssObj.panelText}>
            목록에서 행을 클릭하면 해당 조직이 선택되고, 상세 설정 패널이 자동으로 열립니다.
          </p>
        </div>
        <div css={cssObj.panelSection}>
          <span css={cssObj.panelLabel}>조직 관리 팁</span>
          <p css={cssObj.panelText}>
            검색과 필터 기능을 함께 사용하면 수백 개의 조직 중에서도 원하는 데이터를 빠르게 찾을 수
            있습니다.
          </p>
        </div>
      </div>
      <div css={cssObj.panelFooter}>
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
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>새 조직 추가</h2>
        <p css={cssObj.panelSubtitle}>기관에 속한 새로운 조직을 생성합니다.</p>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
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
        <div css={cssObj.panelSection}>
          <Textfield
            label="조직 소개"
            placeholder="간단한 소개를 작성하세요 (선택)"
            value={intro}
            onValueChange={setIntro}
            maxLength={500}
          />
        </div>
        {createMutation.isError && (
          <p css={cssObj.helperText}>
            조직 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
      </form>
      <div css={cssObj.panelFooter}>
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
  const [name, setName] = useState(() => jojikName);
  const [intro, setIntro] = useState(() => jojikIntro);

  const formId = 'jojik-update-form';
  const isUpdating = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const originalName = jojikName;
  const originalIntro = jojikIntro;
  const trimmedName = name.trim();
  const normalizedIntro = intro ?? '';
  const hasChanges = trimmedName !== originalName || normalizedIntro !== originalIntro;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: UpdateJojikRequest = {};
    if (trimmedName && trimmedName !== originalName) {
      payload.name = trimmedName;
    }

    if (normalizedIntro !== originalIntro) {
      payload.intro = normalizedIntro;
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    await updateMutation.mutateAsync(payload);
    await onAfterMutation();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
    onClearSelection();
    await onAfterMutation();
  };

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{jojikName}</h2>
        <p css={cssObj.panelSubtitle}>조직 정보를 수정하거나 삭제할 수 있습니다.</p>
      </div>
      <form id={formId} css={cssObj.panelBody} onSubmit={handleSubmit}>
        <div css={cssObj.panelSection}>
          <Textfield
            singleLine
            required
            label="조직 이름"
            value={name}
            onValueChange={setName}
            maxLength={60}
          />
        </div>
        <div css={cssObj.panelSection}>
          <Textfield label="조직 소개" value={intro} onValueChange={setIntro} maxLength={500} />
        </div>
        <div css={cssObj.panelSection}>
          <span css={cssObj.panelLabel}>조직 식별자</span>
          <span css={cssObj.panelText}>{jojikDetailNanoId ?? jojikNanoId}</span>
        </div>
        {openFiles?.length ? (
          <div css={cssObj.panelSection}>
            <span css={cssObj.panelLabel}>공유 파일</span>
            <div css={cssObj.chipList}>
              {openFiles.map((file) => (
                <span key={file.nanoId} css={cssObj.chip}>
                  {file.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {updateMutation.isError && (
          <p css={cssObj.helperText}>조직 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}
        {deleteMutation.isError && (
          <p css={cssObj.helperText}>조직 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}
      </form>
      <div css={cssObj.panelFooter}>
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

function MultiSelectionPanel({
  jojiks,
  onStartCreate,
  onClearSelection,
}: MultiSelectionPanelProps) {
  const displayList = useMemo(() => jojiks.slice(0, 6), [jojiks]);
  const overflowCount = Math.max(jojiks.length - displayList.length, 0);

  return (
    <>
      <div css={cssObj.panelHeader}>
        <h2 css={cssObj.panelTitle}>{jojiks.length}개의 조직이 선택되었습니다</h2>
        <p css={cssObj.panelSubtitle}>선택된 조직에 일괄 작업을 적용할 준비가 되었습니다.</p>
      </div>
      <div css={cssObj.panelBody}>
        <div css={cssObj.panelSection}>
          <span css={cssObj.panelLabel}>선택된 조직</span>
          <div css={cssObj.chipList}>
            {displayList.map((jojik) => (
              <span key={jojik.nanoId} css={cssObj.chip}>
                {jojik.name}
              </span>
            ))}
          </div>
          {overflowCount > 0 && (
            <p css={cssObj.helperText}>외 {overflowCount}개의 조직이 더 선택되어 있습니다.</p>
          )}
        </div>
        <div css={cssObj.panelSection}>
          <span css={cssObj.panelLabel}>일괄 작업 아이디어</span>
          <p css={cssObj.panelText}>
            일괄 태그 지정, 접근 권한 조정, 일괄 삭제 등 다양한 작업을 이 패널에서 구현할 수
            있습니다.
          </p>
        </div>
      </div>
      <div css={cssObj.panelFooter}>
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
