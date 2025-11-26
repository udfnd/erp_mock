'use client';

import { css } from '@emotion/react';

import { color } from '@/style/color';
import { radius, shadow, spacing } from '@/style/primitive';
import { typography } from '@/style/typo';

export const cssObj = {
  container: css`
    position: absolute;
    left: calc(100% + 14px);
    bottom: 0;
    width: 280px;
    display: flex;
    flex-direction: column;
    gap: ${spacing.sm};
    padding: ${spacing.base};
    background: ${color.white};
    border: 1px solid ${color.cgrey100};
    border-radius: ${radius.md};
    box-shadow: ${shadow.sm};
    z-index: 20;
  `,

  header: css`
    margin-bottom: 8px;
  `,

  headerTitle: css`
    ${typography.bodySB};
    margin-bottom: 8px;
  `,

  userProfile: css`
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    justify-content: space-between;
  `,

  profileImage: css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  `,

  userInfo: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  `,

  userName: css`
    ${typography.bodySmallR};
    color: ${color.black};
  `,

  gigwanName: css`
    ${typography.bodyLargeB};
    color: ${color.black};
  `,

  historySection: css`
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs};
  `,

  historyTitle: css`
    ${typography.bodySB};
    color: ${color.black};
  `,

  historyList: css`
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs};
    max-height: 220px;
    overflow-y: auto;
  `,

  historyButton: css`
    width: 100%;
    text-align: left;
    border: 1px solid ${color.cgrey100};
    border-radius: ${radius.md};
    background: ${color.cgrey10};
    padding: ${spacing.sm} ${spacing.base};
    cursor: pointer;
    ${typography.bodySmallR};
    color: ${color.cgrey600};
    transition: background 0.2s ease;

    &:hover {
      background: ${color.cgrey50};
    }

    &:focus-visible {
      outline: 2px solid ${color.blue200};
      outline-offset: 2px;
    }
  `,

  historyButtonName: css`
    display: block;
    ${typography.bodySmallSB};
    color: ${color.cgrey700};
  `,

  historyButtonGigwan: css`
    display: block;
    margin-top: 2px;
    color: ${color.cgrey500};
  `,

  historyEmpty: css`
    ${typography.bodySmallR};
    color: ${color.cgrey400};
    padding: ${spacing.sm} ${spacing.base};
    border-radius: ${radius.md};
    background: ${color.cgrey10};
  `,
};
