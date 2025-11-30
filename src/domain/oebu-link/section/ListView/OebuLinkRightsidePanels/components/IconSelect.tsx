'use client';

import { useMemo } from 'react';

import type { LinkIconOption } from '../../linkIconOptions';
import { cssObj } from '../../styles';

type IconSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: LinkIconOption[];
};

export function IconSelect({ value, onChange, options }: IconSelectProps) {
  const normalizedOptions = useMemo(() => [...options], [options]);

  return (
    <div css={cssObj.iconSelectGrid}>
      {normalizedOptions.map((option) => {
        const Icon = option.Icon;
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            css={[cssObj.iconSelectButton, isSelected && cssObj.iconSelectButtonSelected]}
            onClick={() => onChange(option.value)}
          >
            <span css={cssObj.iconSelectIcon}>
              {Icon ? <Icon width={24} height={24} /> : <span css={cssObj.iconPlaceholder}>-</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
