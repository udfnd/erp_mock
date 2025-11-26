import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  content: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,

  tabLayout: css`
    display: flex;
    gap: 16px;
  `,

  sectionCard: css`
    background: ${color.cgrey10};
    padding: 16px;
    border: 1px solid ${color.blue100};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    min-width: 415px;
  `,

  sectionHeader: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  sectionTitle: css`
    ${typography.bodySB};
    color: ${color.black};
    margin-bottom: 16px;
  `,

  sectionDescription: css`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,

  sectionBody: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  basicDataLabel: css`
    ${typography.bodySmallM};
    color: ${color.cgrey600};
  `,

  basicDataWrapper: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: 8px;
    background: ${color.white};
    padding: 8px 16px;

    span {
      ${typography.captionB};
      color: ${color.cgrey400};
    }

    p {
      ${typography.bodySmallR};
      color: ${color.black};
    }
  `,

  infoRow: css`
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    background: ${color.white};
    border-radius: 8px;
    border: 1px solid ${color.cgrey100};
  `,

  infoLabel: css`
    ${typography.bodySB};
    color: ${color.cgrey600};
    flex: 0 0 120px;
  `,

  infoValue: css`
    ${typography.bodyR};
    color: ${color.cgrey700};
    flex: 1;
    word-break: break-word;
    text-align: right;
  `,

  badgeRow: css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  `,

  badge: css`
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 12px;
    background: ${color.blue50};
    color: ${color.blue600};
    ${typography.captionB};
  `,

  mutedBadge: css`
    background: ${color.cgrey50};
    color: ${color.cgrey500};
  `,

  permissionList: css`
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    gap: 8px;
  `,

  permissionItem: css`
    height: 40px;
    padding: 0 12px;
    border-radius: 10px;
    background: ${color.cgrey100};
    border: 1px solid ${color.cgrey200};
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    svg {
      width: 24px;
      height: 24px;
      color: ${color.cgrey400};
    }
  `,

  permissionName: css`
    ${typography.bodySmallR};
    color: ${color.cgrey400};
  `,

  permissionRole: css`
    ${typography.captionR};
    color: ${color.cgrey400};
  `,

  emptyState: css`
    ${typography.bodyR};
    color: ${color.cgrey500};
  `,

  loadingText: css`
    ${typography.bodyR};
    color: ${color.cgrey600};
  `,

  profileImagePlaceholder: css`
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background: ${color.cgrey50};
    border: 1px dashed ${color.cgrey200};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${color.cgrey400};
    ${typography.bodySB};
    margin: 0 auto;
  `,

  centerAligned: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px 12px;
  `,
};
