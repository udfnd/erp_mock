'use client';

import { TableChart } from '@/common/icons';
import { cssObj as lvCss } from '@/common/lv/style';

import { ToolbarFilters } from '../component/ToolbarFilters';
import { ToolbarSearch } from '../component/ToolbarSearch';
import { ToolbarSort } from '../component/ToolbarSort';
import type { ListViewToolbarProps } from '../component/types';

type Props = ListViewToolbarProps & {
  viewChangeLabel?: string;
};

export function ToolbarLayout({
  search,
  filters,
  sort,
  totalCount,
  onSearchFocusChange,
  viewChangeLabel = '리스트뷰',
}: Props) {
  return (
    <div css={lvCss.toolbar}>
      <div css={lvCss.toolbarTopRow}>
        <ToolbarSearch search={search} onFocusChange={onSearchFocusChange} />
        <div css={lvCss.toolbarControls}>
          <ToolbarSort sort={sort} />
          <button type="button" css={lvCss.viewChangeButton}>
            <TableChart />
            {viewChangeLabel}
          </button>
        </div>
      </div>
      <ToolbarFilters filters={filters} />
      <div css={lvCss.searchResultSummary}>총 {totalCount}명</div>
    </div>
  );
}
