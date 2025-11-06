import { css } from '@emotion/react';
import { color, typography } from '@/style';

export const page = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  padding: '32px',
});

export const header = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const title = css({ ...typography.titleSmallB, color: color.black });
export const subtitle = css({ ...typography.bodyR, color: color.cgrey500 });

export const hero = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '32px',
  borderRadius: '8px',
  background: color.blue50,
});

export const heroIcon = css({
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: color.blue200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: color.white,
  fontSize: 28,
});

export const heroContent = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const heroTitle = css({ ...typography.bodyLargeB, color: color.blue600 });
export const heroDescription = css({ ...typography.bodyR, color: color.blue600 });
