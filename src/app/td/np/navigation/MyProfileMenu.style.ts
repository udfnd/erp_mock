import { css } from '@emotion/react';

import { color } from '@/style/color';
import { radius, shadow, spacing } from '@/style/primitive';
import { typography } from '@/style/typo';

export const container = css({
  position: 'absolute',
  left: 'calc(100% + 12px)',
  bottom: 0,
  width: '280px',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
  padding: spacing.base,
  background: color.white,
  border: `1px solid ${color.cgrey100}`,
  borderRadius: radius.md,
  boxShadow: shadow.sm,
  zIndex: 10,
});

export const header = css({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  justifyContent: 'space-between',
});

export const profileImage = css({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  objectFit: 'cover',
  flexShrink: 0,
});

export const userInfo = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
});

export const userName = css({
  ...typography.bodyB,
  color: color.cgrey700,
});

export const gigwanName = css({
  ...typography.bodySmallR,
  color: color.cgrey500,
});

export const closeButton = css({
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  color: color.cgrey400,
  cursor: 'pointer',
  padding: spacing.xs,
  margin: `-${spacing.xs}`,
  lineHeight: 0,
  '&:focus-visible': {
    outline: `2px solid ${color.blue200}`,
    outlineOffset: '2px',
  },
});

export const historySection = css({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
});

export const historyTitle = css({
  ...typography.captionB,
  color: color.cgrey500,
});

export const historyList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
  maxHeight: '220px',
  overflowY: 'auto',
});

export const historyButton = css({
  width: '100%',
  textAlign: 'left',
  border: `1px solid ${color.cgrey100}`,
  borderRadius: radius.md,
  background: color.cgrey10,
  padding: `${spacing.sm} ${spacing.base}`,
  cursor: 'pointer',
  ...typography.bodySmallR,
  color: color.cgrey600,
  transition: 'background 0.2s ease',
  '&:hover': {
    background: color.cgrey50,
  },
  '&:focus-visible': {
    outline: `2px solid ${color.blue200}`,
    outlineOffset: '2px',
  },
});

export const historyButtonName = css({
  display: 'block',
  ...typography.bodySmallSB,
  color: color.cgrey700,
});

export const historyButtonGigwan = css({
  display: 'block',
  marginTop: '2px',
  color: color.cgrey500,
});

export const historyEmpty = css({
  ...typography.bodySmallR,
  color: color.cgrey400,
  padding: `${spacing.sm} ${spacing.base}`,
  borderRadius: radius.md,
  background: color.cgrey10,
});

export const actions = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: spacing.sm,
});
