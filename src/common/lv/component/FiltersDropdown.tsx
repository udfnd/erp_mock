'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';

import {
  ArrowLgDownIcon,
  CheckboxCheckedActiveIcon,
  CheckboxCheckedDisabledIcon,
  CheckboxUncheckedActiveIcon,
  CheckboxUncheckedDisabledIcon,
} from '@/common/icons';
import { cssObj as lvCss } from '@/common/lv/style';

import type { ListViewFilter } from './types';

type Props = {
  filters?: ListViewFilter[];
};

export function FiltersDropdown({ filters }: Props) {
  const filterList = filters ?? [];

  if (!filterList.length) return null;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  const hasActiveFilter = useMemo(
    () =>
      filterList.some((filter) => {
        const defaults = filter.defaultValue ?? [];
        return filter.value.some((value) => !defaults.includes(value));
      }),
    [filterList],
  );

  const getFilterSummary = (filter: ListViewFilter) => {
    if (!filter.value.length) return '';
    return filter.value
      .map((value) => filter.options.find((option) => option.value === value)?.label ?? value)
      .join(', ');
  };

  const handleToggleOption = (filter: ListViewFilter, value: string) => {
    const hasAllOption = filter.options.some((option) => option.value === 'all');
    const withoutAll = filter.value.filter((item) => item !== 'all');

    if (value === 'all') {
      filter.onChange(['all']);
      return;
    }

    const toggledValue = withoutAll.includes(value)
      ? withoutAll.filter((item) => item !== value)
      : [...withoutAll, value];

    if (!toggledValue.length) {
      filter.onChange(filter.defaultValue ?? (hasAllOption ? ['all'] : []));
      return;
    }

    filter.onChange(toggledValue);
  };

  return (
    <div css={lvCss.filterDropdown} ref={dropdownRef}>
      <button
        type="button"
        css={lvCss.filterTrigger(isOpen, hasActiveFilter)}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>필터</span>
        <ArrowLgDownIcon css={lvCss.filterTriggerCaret} />
      </button>
      {isOpen && (
        <div css={lvCss.filterMenu}>
          {filterList.map((filter, index) => {
            const isLast = index === filterList.length - 1;
            const summary = getFilterSummary(filter);
            return (
              <div key={filter.key} css={lvCss.filterGroup(!isLast)}>
                <div css={lvCss.filterGroupHeader}>
                  <span>{filter.label}</span>
                  <span css={lvCss.filterGroupValue}>{summary}</span>
                </div>
                {filter.options.map((option) => {
                  const isOptionActive = filter.value.includes(option.value);
                  const isDisabled = !filter.options.some((opt) => opt.value === option.value);
                  const icon = isDisabled
                    ? isOptionActive
                      ? <CheckboxCheckedDisabledIcon />
                      : <CheckboxUncheckedDisabledIcon />
                    : isOptionActive
                      ? <CheckboxCheckedActiveIcon />
                      : <CheckboxUncheckedActiveIcon />;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      css={[lvCss.filterOption, isOptionActive && lvCss.filterOptionActive]}
                      onClick={() => handleToggleOption(filter, option.value)}
                    >
                      <span css={lvCss.filterOptionContent}>
                        {icon}
                        <span>{option.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
