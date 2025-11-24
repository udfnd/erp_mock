'use client';

import { useMemo } from 'react';

import { cssObj } from '../../styles';

type IconSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};

export function IconSelect({ value, onChange, options }: IconSelectProps) {
  const normalizedOptions = useMemo(
    () => [
      { label: '아이콘 없음', value: 'none' },
      ...options.filter((option) => option.value !== 'all'),
    ],
    [options],
  );

  return (
    <select css={cssObj.toolbarSelect} value={value} onChange={(event) => onChange(event.target.value)}>
      {normalizedOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
