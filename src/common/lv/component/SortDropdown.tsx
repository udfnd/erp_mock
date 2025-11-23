'use client';

import { useEffect, useRef, useState } from 'react';

import { ArrowLgDown, RadioCheckedActive, RadioCheckedDisabled, RadioUncheckedActive, RadioUncheckedDisabled } from '@/common/icons';
import { cssObj as lvCss } from '@/common/lv/style';

import type { ListViewSortProps } from './types';

export function SortDropdown({ sort }: { sort: ListViewSortProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = sort.options.find((option) => option.value === sort.value);
  const displayLabel = selectedOption?.label ?? sort.placeholder ?? '정렬 기준';
  const hasSelection = Boolean(selectedOption);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getSortOptionIcon = (optionValue: string) => {
    const isActive = optionValue === sort.value;
    if (!sort.options.some((option) => option.value === optionValue)) {
      return isActive ? <RadioCheckedDisabled /> : <RadioUncheckedDisabled />;
    }
    return isActive ? <RadioCheckedActive /> : <RadioUncheckedActive />;
  };

  return (
    <div css={lvCss.filterDropdown} ref={dropdownRef}>
      <button
        type="button"
        css={[lvCss.filterTrigger(isOpen, hasSelection), !hasSelection && !isOpen && lvCss.filterTriggerPlaceholder]}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{displayLabel}</span>
        <ArrowLgDown css={lvCss.filterTriggerCaret} />
      </button>
      {isOpen && (
        <div css={lvCss.filterMenu}>
          <div css={lvCss.filterGroup(false)}>
            <button
              type="button"
              css={[lvCss.filterOption, !hasSelection && lvCss.filterOptionActive]}
              onClick={() => {
                sort.onChange('');
                setIsOpen(false);
              }}
            >
              <span css={lvCss.filterOptionContent}>
                {getSortOptionIcon('')}
                <span>{sort.placeholder ?? '정렬 기준'}</span>
              </span>
            </button>
            {sort.options.map((option) => (
              <button
                key={option.value}
                type="button"
                css={[lvCss.filterOption, option.value === sort.value && lvCss.filterOptionActive]}
                onClick={() => {
                  sort.onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span css={lvCss.filterOptionContent}>
                  {getSortOptionIcon(option.value)}
                  <span>{option.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
