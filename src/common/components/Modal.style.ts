'use client';

import { css } from '@emotion/react';
import { color, typography } from '@/style';

export const cssObj = {
  overlay: css`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1300;
    padding: 24px;
  `,

  modalContainer: css`
    width: min(840px, calc(100% - 220px));
    height: calc(100vh - 160px);
    border-radius: 8px;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
    background-color: ${color.white};
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,

  header: css`
    background-color: ${color.cgrey50};
    padding: 8px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  `,

  title: css`
    ${typography.bodyB};
    color: ${color.black};
  `,

  headerButtonWrapper: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,

  closeButton: css`
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: ${color.cgrey500};
    cursor: pointer;
    border-radius: 8px;
    transition:
      background 0.2s ease,
      color 0.2s ease;

    > svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background: ${color.cgrey100};
      color: ${color.cgrey600};
    }

    &:focus-visible {
      outline: 2px solid ${color.blue};
      outline-offset: 2px;
    }
  `,

  bodyLayout: css`
    display: grid;
    grid-template-columns: 220px 1fr;
    min-height: 0;
    flex: 1;
  `,

  menuList: css`
    list-style: none;
    margin: 0;
    padding: 12px;
    background-color: ${color.cgrey50};
    display: flex;
    height: 100%;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
  `,

  menuItem: css`
    width: 100%;
    border-radius: 8px;
    ${typography.captionR};
    color: ${color.cgrey500};
    padding: 6px 8px;
    cursor: pointer;
    border: none;
    text-align: left;
    background-color: transparent;
    transition:
      background 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: ${color.cgrey100};
      color: ${color.cgrey600};
      outline: none;
    }
  `,

  activeMenuItem: css`
    background-color: ${color.blue200};
    color: ${color.blue};
    ${typography.captionB};

    &:hover,
    &:focus-visible {
      background-color: ${color.blue200};
      color: ${color.blue};
    }
  `,

  contentWrapper: css`
    background-color: ${color.white};
    padding: 16px;
    overflow: auto;
  `,

  contentInner: css`
    min-height: 0;
  `,
};
