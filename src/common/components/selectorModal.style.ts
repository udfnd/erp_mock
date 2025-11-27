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
    width: calc(100vw - 160px);
    height: calc(100vh - 140px);
    border-radius: 10px;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
    background-color: ${color.white};
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  header: css`
    background-color: ${color.cgrey50};
    padding: 12px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  `,
  titleArea: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  title: css`
    ${typography.bodyB};
    color: ${color.black};
  `,
  selectionBadge: css`
    ${typography.captionB};
    color: ${color.blue600};
    background: ${color.blue50};
    border-radius: 999px;
    padding: 6px 10px;
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
    grid-template-columns: 220px 1fr 360px;
    min-height: 0;
    flex: 1;
    background: ${color.white};
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
    border-radius: 10px;
    ${typography.captionR};
    color: ${color.cgrey500};
    padding: 10px 12px;
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
    height: 100%;
  `,
  summaryWrapper: css`
    border-left: 1px solid ${color.cgrey100};
    background: ${color.cgrey25};
    padding: 18px 16px;
    overflow-y: auto;
  `,
  footer: css`
    padding: 14px 18px;
    border-top: 1px solid ${color.cgrey100};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: ${color.white};
  `,
  footerText: css`
    ${typography.captionR};
    color: ${color.cgrey600};
  `,
  footerActions: css`
    display: flex;
    gap: 8px;
  `,
};
