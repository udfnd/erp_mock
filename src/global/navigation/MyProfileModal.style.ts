import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const modalStyles = {
  content: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  tabLayout: css`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: stretch;
  `,
  sectionCard: css`
    background: ${color.cgrey10};
    padding: 16px;
    border-radius: 8px;
    flex: 1 1 360px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  `,
  sectionHeader: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  sectionTitle: css`
    ${typography.bodySB};
    color: ${color.black};
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
    color: ${color.cgrey800};
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
    gap: 8px;
  `,
  permissionItem: css`
    padding: 10px 12px;
    border-radius: 10px;
    background: ${color.white};
    border: 1px solid ${color.cgrey100};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  `,
  permissionName: css`
    ${typography.bodySB};
    color: ${color.cgrey800};
  `,
  permissionRole: css`
    ${typography.captionB};
    color: ${color.cgrey600};
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
