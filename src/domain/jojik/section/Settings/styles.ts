import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  card: css`
    background: ${color.cgrey10};
    padding: 16px;
    width: 410px;
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
    justify-content: flex-end;
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

  addressField: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,

  addressInputWrapper: css`
    gap: 8px;
    padding: 0 12px;

    > svg {
      color: ${color.cgrey500};
    }
  `,

  addressInput: css`
    flex: 1;
  `,

  addressEditButton: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: ${color.cgrey500};
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;

    &:hover {
      background: ${color.cgrey50};
      color: ${color.blue600};
    }

    &:disabled {
      cursor: not-allowed;
      color: ${color.cgrey300};
    }

    > svg {
      color: ${color.cgrey500};
    }
  `,

  fieldLabel: css`
    ${typography.bodySmallM};
    color: ${color.cgrey700};
  `,

  fieldLabelPoint: css`
    color: ${color.red};
  `,

  dropdown: css`
    position: relative;
  `,

  dropdownButton: (isOpen: boolean, disabled?: boolean) => css`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${isOpen ? color.blue600 : color.cgrey200};
    border-radius: 8px;
    background: ${disabled ? color.cgrey100 : color.white};
    ${typography.bodyR};
    color: ${disabled ? color.cgrey400 : color.black};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};

    &:focus-visible {
      outline: 2px solid ${color.blue100};
      border-color: ${color.blue600};
    }
  `,

  dropdownLabel: css`
    flex: 1;
    text-align: left;
  `,

  dropdownPlaceholder: css`
    color: ${color.cgrey400};
  `,

  dropdownCaret: css`
    transition: transform 0.2s ease;
  `,

  dropdownMenu: css`
    position: absolute;
    z-index: 10;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: ${color.white};
    border: 1px solid ${color.cgrey200};
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    max-height: 240px;
    overflow-y: auto;
  `,

  dropdownOption: css`
    width: 100%;
    padding: 10px 12px;
    background: ${color.white};
    border: none;
    text-align: left;
    ${typography.bodyR};
    color: ${color.black};
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    &:hover {
      background: ${color.cgrey50};
    }

    &:disabled {
      color: ${color.cgrey300};
      cursor: not-allowed;
    }
  `,

  dropdownOptionSelected: css`
    background: ${color.blue50};
    color: ${color.blue600};
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

  linkLabelWrapper: css`
    width: 100%;
    display: flex;
    padding: 8px 12px;
    align-items: center;
    gap: 4px;
    border-radius: 8px;
    border: 1px solid ${color.cgrey200};
    background: ${color.white};
  `,

  linkLabel: css`
    flex: 1;
  `,

  qrcodeButton: css`
    border: 1px solid ${color.cgrey200};
    border-radius: 50%;
    background-color: ${color.white};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    width: 24px;
    height: 24px;
  `,
} as const;
