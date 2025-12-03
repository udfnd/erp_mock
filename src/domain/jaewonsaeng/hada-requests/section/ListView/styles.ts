'use client';

import { css } from '@emotion/react';

import { color, typography } from '@/style';

export const cssObj = {
  panel: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }),
  panelHeader: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  }),
  panelTitle: css({
    fontSize: 18,
    fontWeight: 600,
    color: color.black,
    ...typography.bodySB,
  }),
  panelSubtitle: css({
    ...typography.bodySmallSB,
    color: color.black,
  }),
  panelBody: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  }),
  helperText: css({
    fontSize: 13,
    color: color.cgrey400,
  }),
  detailList: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  }),
  detailItem: css({
    display: 'flex',
    gap: 8,
  }),
  detailLabel: css({
    ...typography.bodySmallM,
    color: color.cgrey500,
    minWidth: 96,
  }),
  detailValue: css({
    ...typography.bodyM,
    color: color.cgrey700,
  }),
};
