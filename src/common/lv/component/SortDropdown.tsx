'use client';

import { useEffect, useRef, useState } from 'react';

import {
  ArrowLgDownIcon,
  RadioCheckedActiveIcon,
  RadioCheckedDisabledIcon,
  RadioUncheckedActiveIcon,
  RadioUncheckedDisabledIcon,
} from '@/common/icons';
import { cssObj } from '@/common/lv/style';

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
      return isActive ? <RadioCheckedDisabledIcon /> : <RadioUncheckedDisabledIcon />;
    }
    return isActive ? <RadioCheckedActiveIcon /> : <RadioUncheckedActiveIcon />;
  };

  return (
    <div css={cssObj.filterDropdown} ref={dropdownRef}>
      <button
        type="button"
        css={[
          cssObj.filterTrigger(isOpen, hasSelection),
          !hasSelection && !isOpen && cssObj.filterTriggerPlaceholder,
        ]}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{displayLabel}</span>
        <ArrowLgDownIcon css={cssObj.filterTriggerCaret} />
      </button>
      {isOpen && (
        <div css={cssObj.filterMenu}>
          <div css={cssObj.filterGroup(false)}>
            {sort.options.map((option) => (
              <button
                key={option.value}
                type="button"
                css={[
                  cssObj.filterOption,
                  option.value === sort.value && cssObj.filterOptionActive,
                ]}
                onClick={() => {
                  sort.onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span css={cssObj.filterOptionContent}>
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
