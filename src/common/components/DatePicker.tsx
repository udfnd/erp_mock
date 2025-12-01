'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { ArrowMdLeftSingleIcon, ArrowMdRightSingleIcon, CalendarIcon } from '@/common/icons';

import { cssObj } from './DatePicker.style';

export type DatePickerProps = {
  label?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  allowFutureDates?: boolean;
  onChange: (value: string) => void;
};

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function formatDate(date: Date | null) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function displayDate(date: Date | null) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function parseDate(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthDays(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const start = new Date(year, month, 1);
  const startDay = start.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { date: Date; inCurrentMonth: boolean }[] = [];

  for (let index = 0; index < 42; index += 1) {
    const dayNumber = index - startDay + 1;
    let date: Date;
    let inCurrentMonth = true;

    if (dayNumber <= 0) {
      date = new Date(year, month - 1, daysInPrevMonth + dayNumber);
      inCurrentMonth = false;
    } else if (dayNumber > daysInMonth) {
      date = new Date(year, month + 1, dayNumber - daysInMonth);
      inCurrentMonth = false;
    } else {
      date = new Date(year, month, dayNumber);
    }

    days.push({ date, inCurrentMonth });
  }

  return days;
}

export function DatePicker({
  label,
  value,
  placeholder = '날짜 선택',
  required,
  disabled,
  allowFutureDates = true,
  onChange,
}: DatePickerProps) {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const today = useMemo(() => startOfDay(new Date()), []);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'month' | 'year'>('month');
  const parsedValue = useMemo(() => parseDate(value), [value]);
  const [draftDate, setDraftDate] = useState<Date | null>(parsedValue);
  const [viewDate, setViewDate] = useState<Date>(() => parsedValue ?? today);

  useEffect(() => {
    setDraftDate(parsedValue);
    if (parsedValue) {
      setViewDate(parsedValue);
    }
  }, [parsedValue]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && pickerRef.current && !pickerRef.current.contains(target)) {
        setIsOpen(false);
        setMode('month');
        setDraftDate(parsedValue);
        setViewDate(parsedValue ?? today);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, parsedValue, today]);

  const days = useMemo(() => buildMonthDays(viewDate), [viewDate]);

  const headerLabel = `${viewDate.getFullYear()}년 ${String(viewDate.getMonth() + 1).padStart(2, '0')}월`;

  const displayValue = displayDate(parsedValue);

  const isFutureDate = (date: Date) => !allowFutureDates && startOfDay(date).getTime() > today.getTime();

  const yearGrid = useMemo(() => {
    const startYear = viewDate.getFullYear() - (viewDate.getFullYear() % 12);
    return Array.from({ length: 12 }, (_, index) => startYear + index);
  }, [viewDate]);

  const handleApply = () => {
    onChange(formatDate(draftDate));
    setIsOpen(false);
    setMode('month');
  };

  const handleCancel = () => {
    setIsOpen(false);
    setMode('month');
    setDraftDate(parsedValue);
    setViewDate(parsedValue ?? today);
  };

  const isFutureYearDisabled = (year: number) => isFutureDate(new Date(year, 0, 1));

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setMode('month');
    setViewDate(parsedValue ?? today);
    setDraftDate(parsedValue);
  };

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
    setMode('month');
    setViewDate(parsedValue ?? today);
    setDraftDate(parsedValue);
  };

  return (
    <div css={cssObj.container} ref={pickerRef}>
      {label ? (
        <label css={cssObj.label}>
          {label}
          {required ? <span css={cssObj.required}>*</span> : null}
        </label>
      ) : null}
      <div css={cssObj.trigger(disabled)}>
        <button
          type="button"
          css={cssObj.iconButton(disabled)}
          onClick={handleToggle}
          disabled={disabled}
          aria-label="날짜 선택"
        >
          <CalendarIcon />
        </button>
        <input
          css={cssObj.input(disabled)}
          placeholder={placeholder}
          value={displayValue}
          readOnly
          onFocus={handleOpen}
          onClick={handleOpen}
          disabled={disabled}
        />
      </div>
      {isOpen ? (
        <div css={cssObj.pickerPanel}>
          <div css={cssObj.header}>
            <button
              type="button"
              css={cssObj.navButton(disabled)}
              onClick={() => {
                if (disabled) return;
                setViewDate((prev) =>
                  mode === 'year'
                    ? new Date(prev.getFullYear() - 12, prev.getMonth(), 1)
                    : new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                );
              }}
              disabled={disabled}
            >
              <ArrowMdLeftSingleIcon />
            </button>
            <button
              type="button"
              css={cssObj.headerLabel}
              onClick={() => setMode((prev) => (prev === 'month' ? 'year' : 'month'))}
            >
              {headerLabel}
            </button>
            <button
              type="button"
              css={cssObj.navButton(disabled)}
              onClick={() => {
                if (disabled) return;
                setViewDate((prev) =>
                  mode === 'year'
                    ? new Date(prev.getFullYear() + 12, prev.getMonth(), 1)
                    : new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                );
              }}
              disabled={disabled}
            >
              <ArrowMdRightSingleIcon />
            </button>
          </div>

          {mode === 'year' ? (
            <div css={cssObj.yearGrid}>
              {yearGrid.map((year) => {
                const isSelected = draftDate ? draftDate.getFullYear() === year : false;
                const futureDisabled = isFutureYearDisabled(year);
                return (
                  <button
                    key={year}
                    type="button"
                    css={cssObj.yearCell(isSelected, futureDisabled)}
                    onClick={() => {
                      const targetDate = new Date(year, 0, 1);
                      if (futureDisabled) return;
                      setDraftDate(targetDate);
                      setViewDate(targetDate);
                      setMode('month');
                    }}
                    disabled={futureDisabled}
                  >
                    {year}년
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <div css={cssObj.dayLabels}>
                {DAY_LABELS.map((label) => (
                  <span key={label} css={cssObj.dayLabel}>
                    {label}
                  </span>
                ))}
              </div>
              <div css={cssObj.calendarGrid}>
                {days.map(({ date, inCurrentMonth }) => {
                  const selected = isSameDay(date, draftDate);
                  const futureDisabled = isFutureDate(date);
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      css={cssObj.dayCell({
                        selected,
                        inCurrentMonth,
                        disabled: futureDisabled,
                      })}
                      onClick={() => {
                        if (futureDisabled) return;
                        setDraftDate(date);
                        setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
                      }}
                      disabled={futureDisabled}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div css={cssObj.footer}>
            <button type="button" css={cssObj.cancelButton} onClick={handleCancel}>
              취소
            </button>
            <button type="button" css={cssObj.applyButton} onClick={handleApply}>
              적용
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
