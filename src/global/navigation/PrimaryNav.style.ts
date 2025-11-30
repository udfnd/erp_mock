'use client';

import { css, type Interpolation, type Theme } from '@emotion/react';

import { color } from '@/style/color';
import { spacing, radius } from '@/style/primitive';
import { typography } from '@/style/typo';

type IT = Interpolation<Theme>;

const collapsedRange = '(min-width: 960px) and (max-width: 1279px)';

const navContainerBase = css`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 200px;
  max-width: 200px;
  min-width: 40px;
  padding: 10px 12px 24px;
  background: ${color.cgrey10};
  border-right: 1px solid ${color.cgrey100};
  color: ${color.black};
  gap: 8px;
  height: 100vh;
  box-sizing: border-box;
  flex-shrink: 0;
  transition:
    max-width 0.2s ease-in-out,
    padding 0.2s ease-in-out;
  overflow: visible;
  z-index: 10;

  @media (max-width: 959px) {
    display: none;
  }
`;

const navListBase = css`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow-y: auto;
`;

const navLinkBase = css`
  ${typography.captionR};
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: 6px 4px;
  border-radius: ${radius.md};
  text-decoration: none;
  color: ${color.black};
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:focus-visible {
    outline: 2px solid ${color.blue400};
    outline-offset: 4px;
  }
`;

const navFooterBase = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;

  width: 100%;
`;

export const cssObj = {
  navContainerOpen: [
    navContainerBase,
    css`
      max-width: 200px;
      padding: 10px 12px 24px;
      align-items: initial;

      @media ${collapsedRange} {
        max-width: 200px;
        padding: 10px 12px 24px;
        align-items: initial;
      }
    `,
  ] as IT[],

  navContainerClosed: [
    navContainerBase,
    css`
      max-width: 40px;
      padding: 10px 8px;
      align-items: center;
      overflow-x: hidden;

      @media ${collapsedRange} {
        max-width: 40px;
        padding: 10px 8px;
        align-items: center;
        overflow-x: hidden;
      }
    `,
  ] as IT[],

  toggleBar: css`
    display: flex;
    gap: 4px;
    justify-content: space-between;
    width: 100%;
  `,

  searchInputWrapper: css`
    position: relative;
  `,

  searchInputWrapperHidden: css`
    display: none;
    pointer-events: none;
  `,

  searchInput: css`
    height: 26px;
    border-radius: 6px;
    border: 1px solid ${color.cgrey200};
    background-color: ${color.white};
    padding: 4px 6px;
    ${typography.captionR};
  `,

  searchInputIcon: css`
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${color.black};
  `,

  toggleButton: css`
    appearance: none;
    background: transparent;
    border: none;
    line-height: 0;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid ${color.blue400};
      outline-offset: 2px;
    }
  `,

  icon: css`
    width: 24px;
    height: 24px;
  `,

  navList: {
    show: [navListBase] as IT[],
    hide: [navListBase, css({ display: 'none' })] as IT[],
  } as Record<'show' | 'hide', IT[]>,

  navChildList: css`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs};
    width: 100%;
  `,

  navListItem: css`
    width: 100%;
  `,

  navLinkDepth: {
    1: css``,
    2: css`
      padding-left: 20px;
    `,
    3: css`
      padding-left: 32px;
    `,
    4: css`
      padding-left: 44px;
    `,
  } as const,

  navLink: {
    active: [
      navLinkBase,
      css`
        color: ${color.blue600};
        border-radius: 8px;
      `,
    ] as IT[],
    inactive: [
      navLinkBase,
      css`
        &:hover {
          background: ${color.cgrey50};
        }
      `,
    ] as IT[],
  } as Record<'active' | 'inactive', IT[]>,

  navLinkJojikOffset: css`
    padding-left: 16px;
  `,

  navBackButton: css`
    ${typography.bodySmallSB};
    padding-left: 0;

    > svg {
      width: 16px;
      height: 16px;
    }
  `,

  navIcon: css`
    width: 16px;
    height: 16px;
    border-radius: 100px;
    background: ${color.cgrey200};
    flex-shrink: 0;
  `,

  navIconActive: css`
    border: 2px solid ${color.blue};
  `,

  navLabel: css`
    white-space: nowrap;
    transition: opacity 0.2s ease;

    @media ${collapsedRange} {
      aside[data-open='false'] & {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
    }
  `,

  navLabelWeight: {
    active: css`
      ${typography.bodySmallSB};
    `,
    inactive: css`
      ${typography.bodySmallM};
    `,
  },

  selectedGigwanName: css`
    ${typography.captionB};
    color: ${color.cgrey600};
    padding: 0;
  `,

  selectedJojikContainer: css`
    border-bottom: 1px solid ${color.cgrey100};
    padding-bottom: ${spacing.sm};
    margin-bottom: ${spacing.sm};
  `,

  selectedJojikLabel: css`
    ${typography.bodySmallSB};
    padding: ${spacing.sm} ${spacing.base};
    display: inline-block;
  `,

  selectedJojikButton: css`
    cursor: default;
    pointer-events: none;
    background: ${color.cgrey50};
  `,

  navFooter: {
    show: [navFooterBase] as IT[],
    hide: [navFooterBase, css({ display: 'none' })] as IT[],
  } as Record<'show' | 'hide', IT[]>,

  navFooterLink: css`
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 4px;
  `,

  navFooterLabel: css`
    ${typography.captionM};
    color: ${color.cgrey500};
  `,

  footerVersion: css`
    margin-top: ${spacing.md};
    display: flex;
    align-items: center;
    gap: 2px;
  `,

  footerBrand: css`
    ${typography.bodySmallSB};
    color: ${color.blue};
  `,

  footerVerText: css`
    ${typography.captionR};
    color: ${color.cgrey300};
  `,

  footerProfileSection: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing.sm};
    position: relative;
    border-top: 1px solid ${color.cgrey100};
    padding: 8px 0;
  `,

  footerVersionGroup: css`
    display: flex;
    align-items: center;
    gap: 2px;
  `,

  profileTriggerButton: css`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid ${color.cgrey200};
    padding: 0;
    overflow: hidden;
    background-color: ${color.white};
    cursor: pointer;
    flex-shrink: 0;

    &:focus-visible {
      outline: 2px solid ${color.blue400};
      outline-offset: 2px;
    }
  `,

  profileTriggerImage: css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  `,
};
