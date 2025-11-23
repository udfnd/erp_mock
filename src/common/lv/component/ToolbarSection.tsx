'use client';

import { Button } from '@/common/components';
import { Close, Search, Plus } from '@/common/icons';
import { cssObj as lvCss } from '@/common/lv/style';

import { FiltersDropdown } from './FiltersDropdown';
import { SortDropdown } from './SortDropdown';
import type { ListViewToolbarProps } from './types';

export function ToolbarSection({
  search,
  filters,
  sort,
  pageSizeOptions,
  pageSize,
  onPageSizeChange,
  totalCount,
  primaryAction,
  onSearchFocusChange,
}: ListViewToolbarProps) {
  return (
    <div css={lvCss.toolbar}>
      <div css={lvCss.toolbarTopRow}>
        <div css={lvCss.searchBox(true, false)}>
          {search.value && (
            <button
              type="button"
              css={lvCss.searchClearButton}
              aria-label="검색어 지우기"
              onClick={() => search.onChange('')}
            >
              <Close width={16} height={16} />
            </button>
          )}
          <Search css={lvCss.searchIcon} />
          <input
            css={lvCss.searchInput(true)}
            value={search.value}
            placeholder={search.placeholder}
            onChange={(event) => search.onChange(event.target.value)}
            onFocus={() => {
              search.onFocusChange?.(true);
              onSearchFocusChange?.(true);
            }}
            onBlur={() => {
              search.onFocusChange?.(false);
              onSearchFocusChange?.(false);
            }}
          />
        </div>
        <div css={lvCss.toolbarControls}>
          {primaryAction ? (
            <Button size="small" iconLeft={<Plus />} disabled={primaryAction.disabled} onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          ) : null}
          <SortDropdown sort={sort} />
          <FiltersDropdown filters={filters} />
          <label css={lvCss.selectLabel}>
            페이지 크기
            <select css={lvCss.select} value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}개씩 보기
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div css={lvCss.searchResultSummary}>총 {totalCount}명</div>
    </div>
  );
}
