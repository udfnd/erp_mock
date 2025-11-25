'use client';

import React from 'react';

import { cssObj } from './styles';

type ComponentProps<P> = React.ComponentType<P>;

type Props<T, P = Record<string, never>> = {
  children: React.ReactNode;
  selectedItems: T[];
  isCreating?: boolean;
  isParentMissing?: boolean;
  isAuthenticated?: boolean;
  rightPanelProps?: P;
  RightPanelWrapperComponent?: React.ComponentType<{ children: React.ReactNode }>;
  CreatingComponent?: ComponentProps<P>;
  NoneSelectedComponent?: ComponentProps<P>;
  SingleSelectedComponent?: ComponentProps<P>;
  MultipleSelectedComponent?: ComponentProps<P>;
  MissingParentComponent?: ComponentProps<P>;
  AuthenticationRequiredComponent?: ComponentProps<P>;
  getSingleSelectedProps?: (selectedItem: T) => Partial<P>;
  getMultipleSelectedProps?: (selectedItems: T[]) => Partial<P>;
};

export function ListViewLayout<T, P = Record<string, never>>({
  children,
  selectedItems,
  isCreating = false,
  isParentMissing = false,
  isAuthenticated = true,
  rightPanelProps,
  RightPanelWrapperComponent = React.Fragment,
  CreatingComponent,
  NoneSelectedComponent,
  SingleSelectedComponent,
  MultipleSelectedComponent,
  MissingParentComponent,
  AuthenticationRequiredComponent,
  getSingleSelectedProps,
  getMultipleSelectedProps,
}: Props<T, P>) {
  const baseProps = (rightPanelProps ?? {}) as P;

  const renderSingleSelected = () => {
    if (!SingleSelectedComponent) return null;

    const [selectedItem] = selectedItems;
    const singleProps = getSingleSelectedProps?.(selectedItem) ?? {};

    return <SingleSelectedComponent {...baseProps} {...singleProps} />;
  };

  const renderMultipleSelected = () => {
    if (!MultipleSelectedComponent) return null;

    const multipleProps = getMultipleSelectedProps?.(selectedItems) ?? {};

    return <MultipleSelectedComponent {...baseProps} {...multipleProps} />;
  };

  const renderRightPanel = () => {
    if (isParentMissing && MissingParentComponent) {
      return <MissingParentComponent {...baseProps} />;
    }

    if (!isAuthenticated && AuthenticationRequiredComponent) {
      return <AuthenticationRequiredComponent {...baseProps} />;
    }

    if (isCreating && CreatingComponent) {
      return <CreatingComponent {...baseProps} />;
    }

    if (selectedItems.length === 0 && NoneSelectedComponent) {
      return <NoneSelectedComponent {...baseProps} />;
    }

    if (selectedItems.length === 1) {
      return renderSingleSelected();
    }

    if (selectedItems.length > 1) {
      return renderMultipleSelected();
    }

    return null;
  };

  const Wrapper = RightPanelWrapperComponent;

  return (
    <div css={cssObj.page}>
      <div css={cssObj.leftPane}>{children}</div>
      <div css={cssObj.rightPane}>
        <Wrapper>{renderRightPanel()}</Wrapper>
      </div>
    </div>
  );
}
