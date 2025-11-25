'use client';

import { css, type Interpolation, type Theme } from '@emotion/react';

import { color } from '@/style/color';
import { radius, spacing } from '@/style/primitive';
import { typography } from '@/style/typo';

type IT = Interpolation<Theme>;

const navLinkBase = css`
  ${typography.bodyM};
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} 0;
  text-decoration: none;
  color: ${color.cgrey400};
  white-space: nowrap;
  transition: color 0.2s ease;

  &:hover {
    color: ${color.cgrey600};
  }

  &:focus-visible {
    outline: 2px solid ${color.blue200};
    outline-offset: 4px;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -12px;
    height: 2px;
    border-radius: ${radius.sm};
    background: transparent;
    transition: background 0.2s ease;
  }
`;

export const cssObj = {
  navContainer: css`
    display: flex;
    align-items: center;
    padding-left: 8px;
    padding-bottom: 4px;
    background: ${color.cgrey10};
    box-sizing: border-box;

    @media (max-width: 959px) {
      padding: 0 ${spacing.base};
    }
  `,

  navList: css`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    overflow-x: auto;
    width: 100%;
  `,

  navListItem: css`
    flex-shrink: 0;
  `,

  navLink: {
    active: [
      navLinkBase,
      css`
        ${typography.bodySB};
        color: ${color.cgrey700};

        &::after {
          background: ${color.blue};
        }
      `,
    ] as IT[],
    inactive: [navLinkBase] as IT[],
  } as Record<'active' | 'inactive', IT[]>,

  tertiaryNavButton: (isActive: boolean) => css`
    display: flex;
    padding: 2px 8px 3px 8px;
    justify-content: center;
    align-items: center;
    color: ${isActive ? color.blue : color.cgrey500};
    ${isActive ? typography.bodySmallSB : typography.bodySmallM};
    background-color: transparent;
    border: none;
    cursor: pointer;
  `,
};
