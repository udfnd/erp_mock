'use client';

import React from 'react';

import { cssObj } from './styles';

type Props<T> = {
  children: React.ReactNode;
  selectedItems: T[];
  NoneSelectedComponent: React.ReactNode;
  OneSelectedComponent: React.ReactNode;
  MultipleSelectedComponent: React.ReactNode;
};

export function ListViewLayout<T>({
  children,
  selectedItems,
  NoneSelectedComponent,
  OneSelectedComponent,
  MultipleSelectedComponent,
}: Props<T>) {
  const rightPanel =
    selectedItems.length === 0
      ? NoneSelectedComponent
      : selectedItems.length === 1
        ? OneSelectedComponent
        : MultipleSelectedComponent;

  return (
    <div css={cssObj.page}>
      <div css={cssObj.leftPane}>{children}</div>
      <div css={cssObj.rightPane}>{rightPanel}</div>
    </div>
  );
}
