import { css, keyframes } from '@emotion/react';
import { color, typography } from '@/style';

export const toastContainerStyle = css({
  position: 'fixed',
  left: 40,
  bottom: 40,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 12,
  zIndex: 1400,
});

const slideIn = keyframes({
  from: {
    transform: 'translateY(24px)',
    opacity: 0,
  },
  to: {
    transform: 'translateY(0)',
    opacity: 1,
  },
});

const slideOut = keyframes({
  from: {
    transform: 'translateY(0)',
    opacity: 1,
  },
  to: {
    transform: 'translateY(24px)',
    opacity: 0,
  },
});

export const toastWrapperStyle = css({
  width: 240,
  height: 114,
  borderRadius: 8,
  backgroundColor: color.white,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.16)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  animation: `${slideIn} 0.3s ease forwards`,
});

export const toastLeavingStyle = css({
  animation: `${slideOut} 0.2s ease forwards`,
});

export const toastAccentColors = {
  info: color.blue300,
  error: color.red40,
  warning: color.yellow,
  neutral: color.cgrey300,
} as const;

export type ToastVariant = keyof typeof toastAccentColors;

export const accentBarStyle = css({
  height: 6,
  width: '100%',
});

export const toastInnerStyle = css({
  flex: 1,
  padding: '16px 16px 12px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const messageStyle = css({
  ...typography.bodySmallM,
  color: color.cgrey700,
  margin: 0,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

export const actionRowStyle = css({
  marginTop: 'auto',
  display: 'flex',
  justifyContent: 'flex-end',
});

export const confirmButtonStyle = css({
  ...typography.bodySmallM,
  color: color.blue,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '6px 8px',
  alignSelf: 'flex-end',
  borderRadius: 6,
  transition: 'background 0.2s ease, color 0.2s ease',
  '&:hover': {
    backgroundColor: color.blue50,
  },
  '&:focus-visible': {
    outline: `2px solid ${color.blue}`,
    outlineOffset: 2,
  },
});
