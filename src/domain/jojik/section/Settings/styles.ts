import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  card: css`
    background: ${color.cgrey10};
    padding: 16px;
    min-width: 410px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,

  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
  `,

  cardTitleGroup: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  cardTitle: css`
    ${typography.bodySB};
    color: ${color.black};
  `,

  cardSubtitle: css`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,

  cardBody: css`
    display: flex;
    flex-direction: column;
    gap: 20px;
  `,

  cardFooter: css`
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  `,

  statusText: css`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,

  feedback: {
    success: css`
      ${typography.captionB};
      color: ${color.blue600};
    `,
    error: css`
      ${typography.captionB};
      color: ${color.red};
    `,
  } as const,

  errorText: css`
    ${typography.bodySmallR};
    color: ${color.red};
  `,

  selectGroupGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
  `,

  selectGroup: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,

  fieldLabel: css`
    ${typography.captionB};
    color: ${color.black};
  `,

  select: css`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    background: ${color.white};
    ${typography.bodyR};
    color: ${color.black};
    &:focus {
      outline: 2px solid ${color.blue100};
      border-color: ${color.blue600};
    }
  `,

  fieldDescription: css`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,

  openFileSection: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  sectionTitle: css`
    ${typography.captionB};
    color: ${color.black};
  `,

  sectionDescription: css`
    ${typography.captionR};
    color: ${color.cgrey500};
  `,

  openFileList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    background: ${color.white};
  `,

  openFileItem: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  openFileName: css`
    ${typography.bodyR};
    color: ${color.black};
  `,

  emptyText: css`
    ${typography.captionR};
    color: ${color.cgrey400};
  `,

  linkField: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  linkRow: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  linkInput: css`
    flex: 1;
  `,
} as const;
