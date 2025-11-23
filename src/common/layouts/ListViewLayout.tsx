'use client';

import React from 'react';

type Props<T> = {
  children: React.ReactNode;
  selectedItems: T[];
  NoneSelectedComponent: React.ReactNode;
  OneSelectedComponent: React.ReactNode;
  MultipleSelectedComponent: React.ReactNode;
};

export default function ListViewLayout<T>(props: Props<T>) {
  return (
    <div>
      <div className="left">{props.children}</div>
      <div className="right">
        {props.selectedItems.length === 0
          ? props.NoneSelectedComponent
          : props.selectedItems.length === 1
            ? props.OneSelectedComponent
            : props.MultipleSelectedComponent}
      </div>
    </div>
  );
}
