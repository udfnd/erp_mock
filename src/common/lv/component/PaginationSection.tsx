'use client';

import { useMemo } from 'react';

import { ArrowMdLeftDouble, ArrowMdLeftSingle, ArrowMdRightDouble, ArrowMdRightSingle } from '@/common/icons';
import { cssObj as lvCss } from '@/common/lv/style';

import type { ListViewPaginationProps } from './types';

export function PaginationSection<TData>({ table }: ListViewPaginationProps<TData>) {
  const MAX_PAGE_BUTTONS = 10;
  const pagination = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalPages = Math.max(pageCount, 1);
  const currentPage = Math.min(Math.max(1, pagination.pageIndex + 1), totalPages);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(
      1,
      Math.min(currentPage - Math.floor(MAX_PAGE_BUTTONS / 2), totalPages - (MAX_PAGE_BUTTONS - 1)),
    );
    const end = Math.min(totalPages, start + MAX_PAGE_BUTTONS - 1);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  const handleGoToPage = (page: number) => {
    const nextIndex = Math.min(Math.max(page - 1, 0), totalPages - 1);
    table.setPageIndex(nextIndex);
  };

  const hasRightMore = pageNumbers[pageNumbers.length - 1] < totalPages;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const canUseDoubleArrows = totalPages > MAX_PAGE_BUTTONS;

  return (
    <footer css={lvCss.footer}>
      <div css={lvCss.paginationControls}>
        <button
          type="button"
          css={lvCss.paginationArrowButton}
          disabled={!canUseDoubleArrows || !canGoPrev}
          onClick={() => handleGoToPage(1)}
        >
          <ArrowMdLeftDouble />
        </button>
        <button
          type="button"
          css={lvCss.paginationArrowButton}
          disabled={!canGoPrev}
          onClick={() => handleGoToPage(currentPage - 1)}
        >
          <ArrowMdLeftSingle />
        </button>

        <div css={lvCss.paginationPageList}>
          {pageNumbers.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                css={[lvCss.paginationPageButton, isActive && lvCss.paginationPageButtonActive]}
                onClick={() => handleGoToPage(page)}
              >
                {page}
              </button>
            );
          })}

          {hasRightMore && (
            <button
              type="button"
              css={lvCss.paginationMoreButton}
              onClick={() => handleGoToPage(pageNumbers[pageNumbers.length - 1] + 1)}
            >
              …
            </button>
          )}
        </div>
        <button
          type="button"
          css={lvCss.paginationArrowButton}
          disabled={!canGoNext}
          onClick={() => handleGoToPage(currentPage + 1)}
        >
          <ArrowMdRightSingle />
        </button>
        <button
          type="button"
          css={lvCss.paginationArrowButton}
          disabled={!canUseDoubleArrows || !canGoNext}
          onClick={() => handleGoToPage(totalPages)}
        >
          <ArrowMdRightDouble />
        </button>
      </div>
    </footer>
  );
}
