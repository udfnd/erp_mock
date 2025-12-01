'use client';

import { useEffect, useRef, useState } from 'react';

import { ArrowLgDownIcon } from '@/common/icons';

import { cssObj } from './Dropdown.style';

export type DropdownOption = { value: string; label: string; disabled?: boolean };

export type DropdownProps = {
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function Dropdown({
  value,
  options,
  placeholder = '선택하세요',
  disabled,
  onChange,
}: DropdownProps) {
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

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;
  const hasSelection = Boolean(selectedOption);

  return (
    <div css={cssObj.container} ref={dropdownRef}>
      <button
        type="button"
        css={cssObj.button(isOpen, disabled)}
        onClick={() => {
          if (disabled) return;
          setIsOpen((prev) => !prev);
        }}
        disabled={disabled}
      >
        <span css={[cssObj.label, !hasSelection && cssObj.placeholder]}>{displayLabel}</span>
        <ArrowLgDownIcon css={[cssObj.caret, isOpen && { transform: 'rotate(180deg)' }]} />
      </button>
      {isOpen && (
        <div css={cssObj.menu}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              css={[
                cssObj.option,
                option.value === value && cssObj.optionSelected,
                option.disabled && { cursor: 'not-allowed' },
              ]}
              onClick={() => {
                if (option.disabled) return;
                onChange(option.value);
                setIsOpen(false);
              }}
              disabled={option.disabled}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
