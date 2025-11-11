import { css } from '@emotion/react';
import { color, typography } from '@/style';

export const overlayStyle = css({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1300,
  padding: 24,
});

export const modalContainerStyle = css({
  width: 'min(840px, calc(100% - 48px))',
  maxHeight: '80vh',
  borderRadius: 16,
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
  backgroundColor: color.white,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const headerStyle = css({
  backgroundColor: color.cgrey50,
  padding: '24px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
});

export const titleStyle = css({
  ...typography.titleSmallB,
  color: color.cgrey700,
  margin: 0,
});

export const closeButtonStyle = css({
  border: 'none',
  background: 'transparent',
  color: color.cgrey500,
  cursor: 'pointer',
  padding: 8,
  borderRadius: 8,
  transition: 'background 0.2s ease, color 0.2s ease',
  '&:hover': {
    background: color.cgrey100,
    color: color.cgrey600,
  },
  '&:focus-visible': {
    outline: `2px solid ${color.blue}`,
    outlineOffset: 2,
  },
});

export const bodyLayoutStyle = css({
  display: 'grid',
  gridTemplateColumns: '220px 1fr',
  minHeight: 0,
  flex: 1,
});

export const menuListStyle = css({
  listStyle: 'none',
  margin: 0,
  padding: '16px 0',
  backgroundColor: color.cgrey50,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  overflowY: 'auto',
});

export const menuItemStyle = css({
  ...typography.bodyM,
  color: color.cgrey500,
  padding: '12px 24px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: 0,
  textAlign: 'left',
  backgroundColor: 'transparent',
  transition: 'background 0.2s ease, color 0.2s ease',
  '&:hover, &:focus-visible': {
    backgroundColor: color.cgrey100,
    color: color.cgrey600,
    outline: 'none',
  },
});

export const activeMenuItemStyle = css({
  backgroundColor: color.blue200,
  color: color.blue,
  '&:hover, &:focus-visible': {
    backgroundColor: color.blue200,
    color: color.blue,
  },
});

export const contentWrapperStyle = css({
  backgroundColor: color.white,
  padding: '24px 32px',
  overflowY: 'auto',
});

export const contentInnerStyle = css({
  minHeight: 0,
});
