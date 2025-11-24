'use client';

import { CloseIcon, SearchIcon } from '@/common/icons';
import { cssObj as lvCss } from '@/common/lv/style';

import type { ListViewSearchProps } from './types';

type Props = {
  search: ListViewSearchProps;
  onFocusChange?: (focused: boolean) => void;
};

export function ToolbarSearch({ search, onFocusChange }: Props) {
  const handleFocusChange = (focused: boolean) => {
    search.onFocusChange?.(focused);
    onFocusChange?.(focused);
  };

  return (
    <div css={lvCss.searchBox(true, false)}>
      {search.value && (
        <button
          type="button"
          css={lvCss.searchClearButton}
          aria-label="검색어 지우기"
          onClick={() => search.onChange('')}
        >
          <CloseIcon width={16} height={16} />
        </button>
      )}
      <SearchIcon css={lvCss.searchIcon} />
      <input
        css={lvCss.searchInput(true)}
        value={search.value}
        placeholder={search.placeholder}
        onChange={(event) => search.onChange(event.target.value)}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
      />
    </div>
  );
}
