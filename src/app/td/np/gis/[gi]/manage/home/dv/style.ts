import { css } from '@emotion/react';
import { color, typography } from '@/style';

export const page = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '160px 0',
});

export const image = css({
  objectFit: 'cover',
  marginBottom: '20px',
});

export const header = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
});

export const title = css({ ...typography.titleSmallB, color: color.black });
export const subtitle = css({ ...typography.bodyR, color: color.cgrey400 });
