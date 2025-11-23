'use client';

import { useEffect, useMemo, useState } from 'react';

import { Close, Search } from '@/common/icons';
import { cssObj as lvCss } from '@/common/lv/style';

import type { ListViewToolbarProps } from './types';

export function SearchSection({ search, totalCount }: Pick<ListViewToolbarProps, 'search' | 'totalCount'>) {
  const [isFocused, setIsFocused] = useState(false);
  const [lastSearch, setLastSearch] = useState('');
  const hasAppliedSearch = useMemo(() => Boolean(lastSearch), [lastSearch]);

  useEffect(() => {
    setLastSearch(search.value);
  }, [search.value]);

  const handleFocusChange = (focused: boolean) => {
    setIsFocused(focused);
    search.onFocusChange?.(focused);
  };

  return (
    <div css={lvCss.toolbar}>
      <div css={lvCss.toolbarTopRow}>
        <div css={lvCss.searchBox(isFocused, false)}>
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
            onFocus={() => handleFocusChange(true)}
            onBlur={() => handleFocusChange(false)}
          />
        </div>
      </div>
      {hasAppliedSearch && (
        <div css={lvCss.searchResultSummary}>‘{lastSearch}’ 검색 결과입니다 ({totalCount}개)</div>
      )}
    </div>
  );
}
