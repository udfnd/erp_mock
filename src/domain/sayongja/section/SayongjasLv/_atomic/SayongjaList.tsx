import { SayongjaListItem, useGetSayongjasQuery } from '@/domain/sayongja/api';
import React from 'react';

export function SayongjasList(props: {
  gigwanNanoId: string;
  selectedItems: SayongjaListItem[];
  setSelectedItems: (items: SayongjaListItem[]) => void;
}) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sorting, setSorting] = React.useState<
    ('nameAsc' | 'nameDesc' | 'createdAtAsc' | 'createdAtDesc')[]
  >([]);
  const [filter, setFilter] = React.useState<{
    jojikFilters: string[];
    isHwalseongFilter: boolean;
    workTypeCustomSangtaeFilters: string[];
    employmentCategorySangtaeFilters: string[];
  }>({
    jojikFilters: [],
    isHwalseongFilter: false,
    workTypeCustomSangtaeFilters: [],
    employmentCategorySangtaeFilters: [],
  });
  const [pageNumber, setPageNumber] = React.useState(1);

  const { data, isLoading } = useGetSayongjasQuery({
    gigwanNanoId: props.gigwanNanoId,
    sayongjaNameSearch: searchTerm,
    sortByOption: sorting.length > 0 ? sorting.join(',') : undefined,
    jojikFilters: filter.jojikFilters,
    isHwalseongFilter: filter.isHwalseongFilter,
    workTypeCustomSangtaeFilters: filter.workTypeCustomSangtaeFilters,
    employmentCategorySangtaeFilters: filter.employmentCategorySangtaeFilters,
    pageNumber: pageNumber,
    pageSize: 10,
  });

  const {} = useLvState({
    gigwanNanoId: props.gigwanNanoId,
    lvQuery: useGetSayongjasQuery,
    sortOptions: ['nameAsc' | 'nameDesc' | 'createdAtAsc' | 'createdAtDesc'],
  });
  return (
    <div>
      <SearchSection
        left={<SearchBar term={searchTerm} onChange={setSearchTerm} />}
        right={<SortSection sorting={sorting} onChange={setSorting} />}
      />
      <FilterSection left={<FilterBar filters={filter} onChange={setFilter} />} />
      <div className="table-section">
        <SayongjaTable
          data={data?.sayongjas ?? []}
          selectedItems={props.selectedItems}
          onSelectedItemsChange={props.setSelectedItems}
        />
      </div>
      <div className="bottom-section">
        <PaginationComponent pageNumber={pageNumber} totalPages={data?.pagination.totalPages} />
      </div>
    </div>
  );
}
