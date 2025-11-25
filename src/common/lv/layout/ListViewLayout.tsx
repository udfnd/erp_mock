'use client';

import React from 'react';

import { cssObj } from './styles';

type ComponentProps<P> = React.ComponentType<P>;

type Props<
  T,
  BaseProps extends object = Record<string, never>,
  SingleSelectedProps extends object = BaseProps,
  MultipleSelectedProps extends object = BaseProps,
> = {
  children: React.ReactNode;
  selectedItems: T[];
  isCreating?: boolean;
  isParentMissing?: boolean;
  isAuthenticated?: boolean;
  rightPanelProps?: BaseProps;
  RightPanelWrapperComponent?: React.ComponentType<{ children: React.ReactNode }>;
  CreatingComponent?: ComponentProps<BaseProps>;
  NoneSelectedComponent?: ComponentProps<BaseProps>;
  SingleSelectedComponent?: ComponentProps<SingleSelectedProps>;
  MultipleSelectedComponent?: ComponentProps<MultipleSelectedProps>;
  MissingParentComponent?: ComponentProps<BaseProps>;
  AuthenticationRequiredComponent?: ComponentProps<BaseProps>;
  getSingleSelectedProps?: (selectedItem: T, baseProps: BaseProps) => SingleSelectedProps;
  getMultipleSelectedProps?: (selectedItems: T[], baseProps: BaseProps) => MultipleSelectedProps;
};

export function ListViewLayout<
  T,
  BaseProps extends object = Record<string, never>,
  SingleSelectedProps extends object = BaseProps,
  MultipleSelectedProps extends object = BaseProps,
>({
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
}: Props<T, BaseProps, SingleSelectedProps, MultipleSelectedProps>) {
  const baseProps = (rightPanelProps ?? {}) as BaseProps;

  const renderSingleSelected = () => {
    if (!SingleSelectedComponent) return null;

    const [selectedItem] = selectedItems;
    const singleProps =
      getSingleSelectedProps?.(selectedItem, baseProps) ??
      ((baseProps as unknown) as SingleSelectedProps);

    return <SingleSelectedComponent {...singleProps} />;
  };

  const renderMultipleSelected = () => {
    if (!MultipleSelectedComponent) return null;

    const multipleProps =
      getMultipleSelectedProps?.(selectedItems, baseProps) ??
      ((baseProps as unknown) as MultipleSelectedProps);

    return <MultipleSelectedComponent {...multipleProps} />;
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
