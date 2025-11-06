'use client';

import { ChangeEventHandler, MutableRefObject, forwardRef, useEffect, useRef } from 'react';

import * as styles from './Checkbox.style';

export type CheckboxProps = {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  ariaLabel?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, indeterminate = false, disabled = false, onChange, ariaLabel }, ref) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      const element =
        (ref as MutableRefObject<HTMLInputElement | null>)?.current ?? internalRef.current;
      if (element) {
        element.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    return (
      <label css={styles.container}>
        <input
          ref={(node) => {
            internalRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as MutableRefObject<HTMLInputElement | null>).current = node;
            }
          }}
          type="checkbox"
          css={styles.input}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          aria-label={ariaLabel}
        />
        <span css={styles.box} />
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
